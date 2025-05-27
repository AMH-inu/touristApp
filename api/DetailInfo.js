// Vercel Serverless Function 2. DetailInfo
// 관광지 식별 번호(ID)를 기반으로 해당하는 관광지의 세부 정보를 가져오는 API 핸들러
export default async function handler(req, res) {
  // 쿼리 파라미터 추출 (조건에 따라 변화할 수 있는 파라미터)
  const { contentId } = req.query;

  // contentId가 없을 경우 에러 응답 및 예외 처리
  if (!contentId) {
    res.status(400).json({ error: "contentId가 필요합니다." });
    return;
  }

  // API 기본 URL 및 서비스 키(Vercel 등록) 지정
  const BASE_URL = "https://apis.data.go.kr/B551011/KorService2/detailCommon2";
  const SERVICE_KEY = process.env.SERVICE_KEY;

  // 요청 파라미터를 URLSearchParams로 구성
  const params = new URLSearchParams({
    ServiceKey: SERVICE_KEY,
    contentId,
    MobileOS: "ETC",
    MobileApp: "TouristApp",
    _type: "json",
  });

  // fetch를 활용한 API 요청 (요청 실패 시 재시도 로직 포함)
  // 응답받은 JSON 데이터 중에서 상세 정보와 관련된 항목을 취함
  try {
    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);
    const data = await response.json();

    const item = data?.response?.body?.items?.item?.[0];
    if (!item) { // item이 비어있는 경우
      console.warn("⚠️ 관광지 상세 항목이 비어있습니다:", data);
    }

    res.status(200).json(item || null);
  } catch (error) {
    console.error("❌ 관광지 상세 정보 가져오기 실패:", error.message);
    res.status(500).json({ error: "API 요청 실패" });
  }
}