import axios from "axios"; // axio를 사용하여 API 호출하기 위한 라이브러리 import

// 서버리스 함수 (Vercel 환경)
export default async function handler(req, res) {
  // 클라이언트에서 쿼리스트링으로 전달된 keyword, pageNo 받기
  const { keyword = "", pageNo = 1 } = req.query;

  const BASE_URL = "https://apis.data.go.kr/B551011/KorService2/searchKeyword2";
  const SERVICE_KEY = "W6r4Wyzx6d3Kr7iLcwIOYqVzAQ31Jp2ki1WMh96sFEJ5QGEktd2FezH/T4i81B8mMibZZQgKuvoWp1hOD+09Sg=="; // API 호출에 필요한 키
  // const SERVICE_KEY = process.env.SERVICE_KEY; Vercel 업로드 후 수정

  const params = {
    numOfRows: 30,
    pageNo,
    MobileOS: "ETC",
    MobileApp: "TouristApp",
    _type: "json",
    arrange: "B",
    keyword,
    ServiceKey: SERVICE_KEY, // 서비스 키를 사용하여 인증
  };

  // 요청 및 재시도 로직
  const tryFetch = async () => {
    const response = await axios.get(BASE_URL, { params });
    const totalCount = response?.data?.response?.body?.totalCount;

    // items가 없는 경우 방어코드
    const items = response?.data?.response?.body?.items?.item || [];
    if (Array.isArray(items)) {
      items.totalCount = totalCount; // totalCount를 items에 추가
    }
    return items;
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