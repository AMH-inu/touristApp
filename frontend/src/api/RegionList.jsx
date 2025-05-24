import axios from "axios"; // axio를 사용하여 API 호출하기 위한 라이브러리 import

export const regionLists = async (areaCode = "") => {
  const BASE_URL = "/api/B551011/KorService2/areaCode2";
  // const SERVICE_KEY = "W6r4Wyzx6d3Kr7iLcwIOYqVzAQ31Jp2ki1WMh96sFEJ5QGEktd2FezH/T4i81B8mMibZZQgKuvoWp1hOD+09Sg=="; // API 호출에 필요한 키
  const SERVICE_KEY = "ehv0qyzF0IBRdYHS5pZHvDXVBMHvTsVmIJw7GIcrNMhsyLKbp+uwEa2drOopqwdig7EUA4KCgGz+r/D0u7iAsw==";

  const params = {
    numOfRows: 30,
    pageNo: 1,
    MobileOS: "ETC",
    MobileApp: "TouristApp",
    _type: "json",
    ServiceKey: SERVICE_KEY, // 서비스 키를 사용하여 인증
    areaCode, // 지역 코드 (시군구 조회에 사용)
  };

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

    return results;
  } catch (error) {
    console.error("❌ API 실패:", error.response?.data || error.message);
    return [];
  }
};