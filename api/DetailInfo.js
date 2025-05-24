// Vercel 서버리스 함수

export default async function handler(req, res) {
  // 클라이언트에서 쿼리스트링으로 전달된 contentId 받기
  const { contentId } = req.query;

  if (!contentId) {
    res.status(400).json({ error: "contentId가 필요합니다." });
    return;
  }

  const BASE_URL = "https://apis.data.go.kr/B551011/KorService2/detailCommon2";
  const SERVICE_KEY = process.env.SERVICE_KEY;

  const params = {
    ServiceKey: SERVICE_KEY,
    contentId,
    MobileOS: "ETC",
    MobileApp: "TouristApp",
    _type: "json",
  };

  try {
    const response = await axios.get(BASE_URL, { params, headers: { "User-Agent": "Mozilla/5.0" } });
    const item = response?.data?.response?.body?.items?.item?.[0];
    
    if (!item) {
      console.warn("⚠️ 관광지 상세 항목이 비어있습니다:", response.data);
    }

    // 결과 반환
    res.status(200).json(item || null);
  } catch (error) {
    console.error("❌ 관광지 상세 정보 가져오기 실패:", error.response?.data || error.message);
    res.status(500).json({ error: "API 요청 실패" });
  }
}