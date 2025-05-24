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

// Vercel 서버리스 함수
export default async function handler(req, res) {
  const { lat, lon, after = 0 } = req.query;

  if (!lat || !lon) {
    res.status(400).json({ error: "lat/lon이 필요합니다." });
    return;
  }

  const SERVICE_KEY = process.env.SERVICE_KEY;
  const BASE_URL = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

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
    const response = await axios.get(BASE_URL, { params, headers: { "User-Agent": "Mozilla/5.0" } });
    const items = response?.data?.response?.body?.items?.item;

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

      let selected = {};

      if (after == 0) {
        selected = candidates.find((it) => parseInt(it.fcstTime) >= currentHHMM) || candidates[0];
      } else {
        selected = candidates.find((it) => parseInt(it.fcstDate) >= currentYYYYMMDD + parseInt(after)) || candidates[0];
      }

      if (selected && selected.fcstValue !== "강수없음") {
        weather[code] = selected.fcstValue;
      }
    });

    res.status(200).json(weather);
  } catch (error) {
    console.error("❌ 기상청 날씨 데이터 요청 실패:", error.response?.data || error.message);
    res.status(500).json({
      error: "기상청 날씨 API 요청 실패",
      detail: error.response?.data || error.message,
    });
  }
}