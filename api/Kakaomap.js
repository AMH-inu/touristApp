// Vercel Serverless Function 3. Kakaomap
// 단순히 Vercel에 등록된 카카오 맵 SDK 키를 반환하는 API 핸들러
export default async function handler(req, res) {

  // Vercel의 환경 변수로부터 카카오 맵 SDK 키를 가져옴
  const KAKAO_SDK_KEY = process.env.KAKAO_SDK_KEY;

  // KAKAO_SDK_KEY가 없을 경우 에러 응답 및 예외 처리
  if (!KAKAO_SDK_KEY) {
    console.error("❌ KAKAO_SDK_KEY가 설정되지 않았습니다!");
    return;
  }

  try {
    res.status(200).json({ key: KAKAO_SDK_KEY });
  } catch (error) {
    console.error("❌ 카카오 SDK 키 로드 실패:", error.message);
    return res.status(500).json({ error: "KAKAO_SDK_KEY가 설정되지 않았습니다." });
  }
}