// Vercel Serverless Function 4. NameSearch
// 관광지의 이름을 기준으로 해당 이름이 포함된 관광지의 목록을 가져오는 API 핸들러
export default async function handler(req, res) {
  // 쿼리 파라미터 추출 (조건에 따라 변화할 수 있는 파라미터)
  const { keyword = "", pageNo = 1 } = req.query;

  // API 기본 URL 및 서비스 키(Vercel 등록) 지정
  const BASE_URL = "https://apis.data.go.kr/B551011/KorService2/searchKeyword2";
  const SERVICE_KEY = process.env.SERVICE_KEY;

  // 요청 파라미터를 URLSearchParams로 구성
  const params = new URLSearchParams({
    numOfRows: "30",
    pageNo: String(pageNo),
    MobileOS: "ETC",
    MobileApp: "TouristApp",
    _type: "json",
    arrange: "B",
    keyword,
    ServiceKey: SERVICE_KEY,
  });

  // fetch를 활용한 API 요청 함수 (요청 실패 시 재시도 로직 포함)
  // 응답받은 JSON 데이터 중에서 item 배열과 totalCount 변수 값을 취함
  const tryFetch = async () => {
    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);
    const data = await response.json();


    const totalCount = data?.response?.body?.totalCount;
    const items = data?.response?.body?.items?.item || [];

    return {items, totalCount};
  };

  // API 호출 실패 시 7회까지 반복하여 재시도함
  try {
    let results = await tryFetch();
    let i = 0;

    while (i < 7 && results.length === 0) {
      console.log("❗ 결과가 없습니다. 재시도 중...", i + 1);
      await new Promise((r) => setTimeout(r, 300)); // 0.3초 대기
      results = await tryFetch();
      i++;
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("❌ API 실패:", error.message);
    res.status(500).json({ error: "API 요청 실패" });
  }
}