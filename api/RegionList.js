export default async function handler(req, res) {
  const { areaCode } = req.query;

  const BASE_URL = "https://apis.data.go.kr/B551011/KorService2/areaCode2";
  const SERVICE_KEY = process.env.SERVICE_KEY;

  if (!SERVICE_KEY) {
    console.error("❌ SERVICE_KEY 환경변수가 누락되었습니다!");
    return res.status(500).json({ error: "Internal Server Error (SERVICE_KEY)" });
  }

  // ✅ 요청 파라미터를 URLSearchParams로 구성
  const params = new URLSearchParams({
    numOfRows: "30",
    pageNo: "1",
    MobileOS: "ETC",
    MobileApp: "TouristApp",
    _type: "json",
    ServiceKey: SERVICE_KEY,
  });

  // ✅ areaCode가 있으면 추가
  if (areaCode) {
    params.append("areaCode", areaCode);
  }

  const tryFetch = async () => {
    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);
    const data = await response.json();
    return data?.response?.body?.items?.item || [];
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

    res.status(200).json(results);
  } catch (error) {
    console.error("❌ API 요청 실패:", {
      message: error.message,
      code: error.code,
    });
    res.status(500).json({ error: "API 요청 실패" });
  }
}