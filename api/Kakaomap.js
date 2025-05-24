import axios from "axios";

export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    res.status(400).json({ error: "위도(lat)와 경도(lon)가 필요합니다." });
    return;
  }

  const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

  try {
    const response = await axios.get(
      "https://dapi.kakao.com/v2/local/geo/coord2address.json",
      {
        params: { x: lon, y: lat }, // 카카오는 x: 경도, y: 위도 순서!
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ 카카오 좌표 → 주소 API 요청 실패:", error.response?.data || error.message);
    res.status(500).json({
      error: "카카오 API 요청 실패",
      detail: error.response?.data || error.message,
    });
  }
}