// Vercel Serverless Function 6. Weather
// 설정한 좌표(X, Y)에 따른 위치의 기상청 날씨 정보를 가져오는 API 핸들러
export default async function handler(req, res) {
  // 쿼리 파라미터 추출 : 위도(lat)와 경도(lon), 이후 날짜(after)
  const { lat, lon, after = 0 } = req.query;

  // lat과 lon이 없을 경우 에러 응답 및 예외 처리
  if (!lat || !lon) {
    res.status(400).json({ error: "lat/lon이 필요합니다." });
    return;
  }

  // API 기본 URL 및 서비스 키(Vercel 등록) 지정
  const BASE_URL = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
  const SERVICE_KEY = process.env.SERVICE_KEY;

  // 위도와 경도(Tour API 제공값)를 기상청 API 요청에 필요한 파라미터 형태로 변환
  // 기상청 API 요청에 필요한 base_date와 base_time을 현재 시간 기준으로 계산
  const { nx, ny } = convertToGrid(lat, lon);
  const { base_date, base_time } = getBaseDateTime();

  // 요청 파라미터를 URLSearchParams로 구성
  const params = new URLSearchParams({
    ServiceKey: SERVICE_KEY,
    pageNo: "1",
    numOfRows: "1000",
    dataType: "JSON",
    base_date,
    base_time,
    nx,
    ny,
  });

  // fetch를 활용한 API 요청 (요청 실패 시 재시도 로직 포함)
  // 응답받은 JSON 데이터 중에서 TMP(온도), REH(습도), RH1(1시간 강수량) 값을 JS 객체 형태로 취함
  try {
    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);

    const data = await response.json();
    const items = data?.response?.body?.items?.item; // 기상청 API 응답에서 items 배열 추출

    if (!items) throw new Error("기상청 응답 오류 또는 데이터 없음");

    const weather = { TMP: "정보 없음", REH: "정보 없음", RN1: "0" }; // 기본값 설정

    // items 배열의 각 항목을 시간 순으로 정렬
    ["TMP", "REH", "RN1"].forEach((code) => {
      const candidates = items
        .filter((it) => it.category === code)
        .sort((a, b) => a.fcstTime.localeCompare(b.fcstTime));

      // 현재 시간과 현재 날짜를 각각 HHMM, YYYYMMDD 형태로 변환
      const now = new Date();
      const currentHHMM = parseInt(
        `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`
      );
      const currentYYYYMMDD = parseInt(
        `${String(now.getFullYear()).padStart(4, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`
      );

      // after = 0 : 현재의 날씨 정보 요청 (즉, 가장 가까운 이후 시간의 정보를 selected에 저장)
      // after > 0 : 현재 이후 날짜의 날씨 정보 요청 (즉, 현재 날짜 + after의 값에 해당하는 시간의 정보를 selected에 저장)
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
    console.error("❌ 기상청 날씨 데이터 요청 실패:", error.message);
    res.status(500).json({
      error: "기상청 날씨 API 요청 실패",
      detail: error.message,
    });
  }
}

// 기상청 API 활용을 위한 추가 정의 함수
// 1. TourAPI에서의 위도와 경도를 기상청 API에 필요한 파라미터로 변환하는 함수 
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

// 2. 현재 시간을 기준으로 기상청 API에 필요한 base_date와 base_time을 계산하는 함수
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