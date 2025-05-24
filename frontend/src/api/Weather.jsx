import axios from "axios";

function convertToGrid(lat, lon) {
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;

  const DEGRAD = Math.PI / 180.0;
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  const sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  const snVal = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  const sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5) ** snVal * (Math.cos(slat1) / snVal);
  const ro = re * sf / Math.tan(Math.PI * 0.25 + olat * 0.5) ** snVal;

  const ra = re * sf / Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5) ** snVal;
  const theta = lon * DEGRAD - olon;
  const x = Math.floor(ra * Math.sin(theta * snVal) + XO + 0.5);
  const y = Math.floor(ro - ra * Math.cos(theta * snVal) + YO + 0.5);

  return { nx: x, ny: y };
}

function getBaseDateTime() {
  const now = new Date();
  const baseTimes = ["0200", "0500", "0800", "1100", "1400", "1700", "2000", "2300"];
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const date = `${yyyy}${mm}${dd}`;
  const currentHHMM = now.getHours() * 100 + now.getMinutes();

  let base_time = baseTimes[0];
  for (let i = 0; i < baseTimes.length; i++) {
    if (currentHHMM < parseInt(baseTimes[i])) break;
    base_time = baseTimes[i];
  }

  if (base_time === "2300" && currentHHMM < 200) {
    const yesterday = new Date(now.setDate(now.getDate() - 1));
    const y = yesterday.getFullYear();
    const m = String(yesterday.getMonth() + 1).padStart(2, "0");
    const d = String(yesterday.getDate()).padStart(2, "0");
    return { base_date: `${y}${m}${d}`, base_time };
  }

  return { base_date: date, base_time };
}

export const fetchKmaWeather = async (lat, lon, after = 0) => {
  const SERVICE_KEY = "ehv0qyzF0IBRdYHS5pZHvDXVBMHvTsVmIJw7GIcrNMhsyLKbp+uwEa2drOopqwdig7EUA4KCgGz+r/D0u7iAsw==";
  const BASE_URL = "/api/1360000/VilageFcstInfoService_2.0/getVilageFcst";

  const { nx, ny } = convertToGrid(lat, lon);
  const { base_date, base_time } = getBaseDateTime();

  const params = {
    ServiceKey: SERVICE_KEY,
    pageNo: "1",
    numOfRows: "1000",
    dataType: "JSON",
    base_date,
    base_time,
    nx,
    ny,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    console.log(response);
    const items = response?.data?.response?.body?.items?.item;
    console.log(items);
    if (!items) throw new Error("기상청 응답 오류 또는 데이터 없음");

    const weather = { TMP: "정보 없음", REH: "정보 없음", RN1: "0" };

    ["TMP", "REH", "RN1"].forEach((code) => {
      const candidates = items
        .filter((it) => it.category === code)
        .sort((a, b) => a.fcstTime.localeCompare(b.fcstTime));

      const now = new Date();
      const currentHHMM = parseInt(
        `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`
      );
      const currentYYYYMMDD = parseInt(
        `${String(now.getFullYear()).padStart(4, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`
      );

      console.log("currentHHMM", currentHHMM);
      console.log("currentYYYYMMDD", currentYYYYMMDD);    
      let selected = {};

        if (after == 0) { 
            selected = candidates.find((it) => parseInt(it.fcstTime) >= currentHHMM) || candidates[0]; 
            console.log('A');
        } else { 
            selected = candidates.find((it) => parseInt(it.fcstDate) >= currentYYYYMMDD + after) || candidates[0]; 
            console.log('B');
        }

        if (selected && selected.fcstValue !== "강수없음") {
            weather[code] = selected.fcstValue;
        }
    });

    console.log("API 호출 결과 :", weather);
    return weather;
  } catch (error) {
    console.error("❌ 기상청 날씨 데이터 요청 실패:", error);
    return { TMP: "정보 없음", REH: "정보 없음", RN1: "0" };
  }
};