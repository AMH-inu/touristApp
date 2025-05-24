export default async function handler(req, res) {
  const { keyword = "", pageNo = 1 } = req.query;

  const BASE_URL = "https://apis.data.go.kr/B551011/KorService2/searchKeyword2";
  const SERVICE_KEY = process.env.SERVICE_KEY;

  // ✅ 요청 파라미터를 URLSearchParams로 구성
  const params = new URLSearchParams({
    numOfRows: "30",
    pageNo: String(pageNo),
    MobileOS: "ETC",
    MobileApp: "TouristApp",
    _type: "json",
    arrange: "B",
    keyword,
    ServiceKey: SERVICE_KEY,
  });

  // 요청 및 재시도 로직
  const tryFetch = async () => {
    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);
    const data = await response.json();
    console.log("nameSearch", data);

    const totalCount = data?.response?.body?.totalCount;
    const items = data?.response?.body?.items?.item || [];

    if (Array.isArray(items)) {
      items.totalCount = totalCount; // totalCount를 items에 추가
    }
    console.log("totalCount:", items.totalCount);
    console.log("items:", items);
    return items;
  };

  try {
    let results = await tryFetch();
    let i = 0;

    while (i < 7 && results.length === 0) {
      console.log("❗ 결과가 없습니다. 재시도 중...", i + 1);
      await new Promise((r) => setTimeout(r, 300)); // 0.3초 대기
      results = await tryFetch();
      i++;
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("❌ API 실패:", error.message);
    res.status(500).json({ error: "API 요청 실패" });
  }
}