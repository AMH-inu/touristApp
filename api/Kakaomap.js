export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    res.status(400).json({ error: "위도(lat)와 경도(lon)가 필요합니다." });
    return;
  }

  const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

  try {
    const url = new URL("https://dapi.kakao.com/v2/local/geo/coord2address.json");
    url.searchParams.set("x", lon); // 카카오는 x: 경도
    url.searchParams.set("y", lat); // y: 위도

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
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ 카카오 좌표 → 주소 API 요청 실패:", error.message);
    res.status(500).json({
      error: "카카오 API 요청 실패",
      detail: error.message,
    });
  }
}