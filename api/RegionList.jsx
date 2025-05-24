import axios from "axios"; // axios를 사용하여 API 호출하기 위한 라이브러리 import

// Vercel 서버리스 함수
export default async function handler(req, res) {
  // 클라이언트에서 쿼리스트링으로 전달된 areaCode 받기
  const { areaCode = "" } = req.query;

  const BASE_URL = "https://apis.data.go.kr/B551011/KorService2/areaCode2";
  const SERVICE_KEY = process.env.SERVICE_KEY;

  const params = {
    numOfRows: 30,
    pageNo: 1,
    MobileOS: "ETC",
    MobileApp: "TouristApp",
    _type: "json",
    ServiceKey: SERVICE_KEY, // 서비스 키를 사용하여 인증
    areaCode, // 지역 코드 (시군구 조회에 사용)
  };

  // 요청 및 재시도 로직
  const tryFetch = async () => {
    const response = await axios.get(BASE_URL, { params });
    return response.data?.response?.body?.items?.item || [];
  };

  try {
    let results = await tryFetch();
    let i = 0; // retry counter 선언

    while (i < 7 && results.length === 0) {
      console.log("❗ 결과가 없습니다. 재시도 중...", i + 1);
      await new Promise((r) => setTimeout(r, 300)); // 0.3초 대기
      results = await tryFetch();
      i++;
    }

    // 최종 결과를 JSON 형태로 반환
    res.status(200).json(results);
  } catch (error) {
    console.error("❌ API 실패:", error.response?.data || error.message);
    res.status(500).json({ error: "API 요청 실패" });
  }
}