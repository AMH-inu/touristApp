import axios from "axios";

export const getPlaceDetail = async (contentId) => {
  const BASE_URL = "/api/B551011/KorService2/detailCommon2";
  // const SERVICE_KEY = "W6r4Wyzx6d3Kr7iLcwIOYqVzAQ31Jp2ki1WMh96sFEJ5QGEktd2FezH/T4i81B8mMibZZQgKuvoWp1hOD+09Sg=="; // API 호출에 필요한 키
  const SERVICE_KEY = "ehv0qyzF0IBRdYHS5pZHvDXVBMHvTsVmIJw7GIcrNMhsyLKbp+uwEa2drOopqwdig7EUA4KCgGz+r/D0u7iAsw==";

  const params = {
    ServiceKey: SERVICE_KEY,
    contentId,
    MobileOS: "ETC",
    MobileApp: "TouristApp",
    _type: "json",
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    const item = response?.data?.response?.body?.items?.item?.[0];
    
    if (!item) {
      console.warn("⚠️ 관광지 상세 항목이 비어있습니다:", response.data);
    }

    return item || null;
  } catch (error) {
    console.error("❌ 관광지 상세 정보 가져오기 실패:", error);
    return null;
  }
};