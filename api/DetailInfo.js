export default async function handler(req, res) {
  const { contentId } = req.query;

  if (!contentId) {
    res.status(400).json({ error: "contentId가 필요합니다." });
    return;
  }

  const BASE_URL = "https://apis.data.go.kr/B551011/KorService2/detailCommon2";
  const SERVICE_KEY = process.env.SERVICE_KEY;

  // ✅ 요청 파라미터를 URLSearchParams로 구성
  const params = new URLSearchParams({
    ServiceKey: SERVICE_KEY,
    contentId,
    MobileOS: "ETC",
    MobileApp: "TouristApp",
    _type: "json",
  });

  try {
    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);
    const data = await response.json();

    const item = data?.response?.body?.items?.item?.[0];

    if (!item) {
      console.warn("⚠️ 관광지 상세 항목이 비어있습니다:", data);
    }

    res.status(200).json(item || null);
  } catch (error) {
    console.error("❌ 관광지 상세 정보 가져오기 실패:", error.message);
    res.status(500).json({ error: "API 요청 실패" });
  }
}