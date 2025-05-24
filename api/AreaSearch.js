import axios from "axios";

// 서버리스 함수 (예: /api/areaSearch.js)
export default async function handler(req, res) {
  const { areaCode = "", sigunguCode = "", pageNo = 1 } = req.query;

  const BASE_URL = "https://apis.data.go.kr/B551011/KorService2/areaBasedList2";
  const SERVICE_KEY = process.env.SERVICE_KEY;

  const params = {
    numOfRows: 30,
    pageNo,
    MobileOS: "ETC",
    MobileApp: "TouristApp",
    _type: "json",
    arrange: "C",
    areaCode,
    sigunguCode,
    ServiceKey: SERVICE_KEY,
  };

  // 요청 및 재시도 로직
  const tryFetch = async () => {
    const response = await axios.get(BASE_URL, { params, headers: { "User-Agent": "Mozilla/5.0" } });
    const totalCount = response?.data?.response?.body?.totalCount;
    // items가 없는 경우 방어코드
    const items = response?.data?.response?.body?.items?.item || [];
    if (Array.isArray(items)) {
      items.totalCount = totalCount;
    }
    return items;
  };

  try {
    let results = await tryFetch();
    let i = 0;

    while (i < 7 && results.length === 0) {
      console.log("❗ 결과가 없습니다. 재시도 중...", i + 1);
      await new Promise((r) => setTimeout(r, 300));
      results = await tryFetch();
      i++;
    }

    // 응답 반환
    res.status(200).json(results);
  } catch (error) {
    console.error("❌ API 실패:", error.response?.data || error.message);
    res.status(500).json({ error: "API 요청 실패" });
  }
}