export default async function handler(req, res) {

  const { KAKAO_SDK_KEY } = process.env.KAKAO_SDK_KEY;

  if (!lat || !lon) {
    res.status(400).json({ error: "위도(lat)와 경도(lon)가 필요합니다." });
    return;
  }

  try {
    res.status(200).json({ key: KAKAO_JS_KEY });
  } catch (error) {
    console.error("❌ 카카오 SDK 키 로드 실패:", error.message);
    return res.status(500).json({ error: "KAKAO_JS_KEY가 설정되지 않았습니다." });
  }
}