// Vercel Serverless Function 5. RegionList
// 지역 목록을 가져오는 API 핸들러 (areaCode가 없으면 시도 목록, 있으면 시군구 목록을 가져옴)
export default async function handler(req, res) {
  // 쿼리 파라미터 추출 (areaCode에 따라 가져오는 목록의 종류가 다름)
  const { areaCode } = req.query;

  // API 기본 URL 및 서비스 키(Vercel 등록) 지정
  const BASE_URL = "https://apis.data.go.kr/B551011/KorService2/areaCode2";
  const SERVICE_KEY = process.env.SERVICE_KEY;

  // 요청 파라미터를 URLSearchParams로 구성
  const params = new URLSearchParams({
    numOfRows: "30",
    pageNo: "1",
    MobileOS: "ETC",
    MobileApp: "TouristApp",
    _type: "json",
    ServiceKey: SERVICE_KEY,
  });

  // areaCode가 없는 경우, 파라미터를 유지함 (Case 1 : 시도 목록을 가져옴)

  // areaCode가 있는 경우, 파라미터에 areaCode를 추가 (Case 2 : 시군구 목록을 가져옴)
  if (areaCode) {
    params.append("areaCode", areaCode);
  }

  // fetch를 활용한 API 요청 함수 (요청 실패 시 재시도 로직 포함)
  // 응답받은 JSON 데이터 중에서 item 배열을 취함
  const tryFetch = async () => {
    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);
    const data = await response.json();
    return data?.response?.body?.items?.item || [];
  };

  // API 호출 실패 시 7회까지 반복하여 재시도함
  try {
    let results = await tryFetch();
    let i = 0;

    while (i < 7 && results.length === 0) {
      console.log("❗ 결과가 없습니다. 재시도 중...", i + 1);
      await new Promise((r) => setTimeout(r, 300));
      results = await tryFetch();
      i++;
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("❌ API 요청 실패:", {
      message: error.message,
      code: error.code,
    });
    res.status(500).json({ error: "API 요청 실패" });
  }
}