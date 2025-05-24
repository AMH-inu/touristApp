export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "위도(lat)와 경도(lon)가 필요합니다." });
  }

  const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
  const BASE_URL = "https://dapi.kakao.com/v2/local/geo/coord2address.json";

  try {
    const response = await fetch(
      `${BASE_URL}?x=${lon}&y=${lat}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`카카오 API 요청 실패: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    const address = data.documents?.[0]?.address?.address_name || "주소 정보 없음";

    res.status(200).json({ address });
  } catch (error) {
    console.error("❌ 좌표 → 주소 변환 실패:", error.message);
    res.status(500).json({ error: "API 요청 실패", detail: error.message });
  }
}