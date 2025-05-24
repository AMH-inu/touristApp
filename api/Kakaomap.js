export default async function handler(req, res) {
  const { lat, lon } = req.query;

  // ✅ 위도/경도 파라미터 체크
  if (!lat || !lon) {
    res.status(400).json({ error: "위도(lat)와 경도(lon)가 필요합니다." });
    return;
  }

  const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

  try {
    // ✅ Kakao 지도 API 요청 URL
    const url = new URL("https://dapi.kakao.com/v2/local/geo/coord2address.json");
    url.searchParams.set("x", lon); // Kakao API는 경도 → x
    url.searchParams.set("y", lat); // Kakao API는 위도 → y

    // ✅ fetch로 요청 (axios 없이!)
    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API 요청 실패: ${response.status} ${errorData}`);
    }

    const data = await response.json();

    // ✅ Kakao API 응답을 프론트로 그대로 반환
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ 카카오 좌표 → 주소 API 요청 실패:", error.message);
    res.status(500).json({
      error: "카카오 API 요청 실패",
      detail: error.message,
    });
  }
}