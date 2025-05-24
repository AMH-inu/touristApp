import axios from "axios"; // axios를 사용하여 API 호출하기 위한 라이브러리 import

export default async function handler(req, res) {
  const { areaCode } = req.query;

  const BASE_URL = "https://apis.data.go.kr/B551011/KorService2/areaCode2";
  const SERVICE_KEY = process.env.SERVICE_KEY;
  console.log("✅ SERVICE_KEY 확인:", process.env.SERVICE_KEY ? "있음" : "없음");

  if (!SERVICE_KEY) {
    console.error("❌ SERVICE_KEY 환경변수가 누락되었습니다!");
    return res.status(500).json({ error: "Internal Server Error (SERVICE_KEY)" });
  }

  const params = {
    numOfRows: 30,
    pageNo: 1,
    MobileOS: "ETC",
    MobileApp: "TouristApp",
    _type: "json",
    ServiceKey: SERVICE_KEY,
  };

  // ✅ areaCode가 있으면 추가, 없으면 areaCode 없이 요청
  if (areaCode) {
    params.areaCode = areaCode;
  }

  const tryFetch = async () => {
    const response = await axios.get(BASE_URL, { params });
    return response.data?.response?.body?.items?.item || [];
  };

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
      responseData: error.response?.data,
    });
    res.status(500).json({ error: "API 요청 실패" });
  }
}