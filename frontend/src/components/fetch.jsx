import axios from "axios";

// 지역 코드와 시군구 코드를 기반으로 관광지 목록을 가져오는 함수
export const fetchAreaSearch = async (areaCode, sigunguCode, pageNo = 1) => {
  try {
    const response = await axios.get("/api/AreaSearch", {
      params: { areaCode, sigunguCode, pageNo },
    });
    return response.data;
  } catch (error) {
    console.error("❌ 서버리스 호출 실패:", error);
    return [];
  }
};

// 관광지 이름을 기반으로 검색하는 함수
export const fetchTouristPlaces = async (keyword, pageNo = 1) => {
  try {
    // 프론트에서 서버리스 API를 호출
    const response = await axios.get("/api/NameSearch", {
      params: { keyword, pageNo },
    });

    // 서버리스 함수에서 반환된 데이터 (배열)
    return response.data;
  } catch (error) {
    console.error("❌ 서버리스 API 호출 실패:", error.response?.data || error.message);
    return [];
  }
};

// 지역 목록을 가져오는 함수
export const fetchRegionLists = async (areaCode = "") => {
  try {
    // 프론트에서 서버리스 API를 호출
    const response = await axios.get("/api/RegionList", {
      params: { areaCode },
    });

    // 서버리스 함수에서 반환된 데이터 (배열)
    return response.data;
  } catch (error) {
    console.error("❌ 서버리스 API 호출 실패:", error.response?.data || error.message);
    return [];
  }
};

// ID로 관광지 상세 정보를 가져오는 함수
export const fetchPlaceDetail = async (contentId) => {
  try {
    const response = await axios.get("/api/DetailInfo", {
      params: { contentId },
    });

    // 서버리스 함수에서 반환된 데이터
    return response.data;
  } catch (error) {
    console.error("❌ 관광지 상세 정보 API 호출 실패:", error.response?.data || error.message);
    return null;
  }
};

// 관광지의 날씨 정보를 가져오는 함수
export const fetchWeather = async (lat, lon, after = 0) => {
  try {
    const response = await axios.get("/api/Weather", {
      params: { lat, lon, after },
    });
    return response.data;
  } catch (error) {
    console.error("❌ 기상청 날씨 API 호출 실패:", error.response?.data || error.message);
    return { TMP: "정보 없음", REH: "정보 없음", RN1: "0" };
  }
};

// 관광지의 주소 기반 지도를 가져오는 함수
export const fetchKakaoMap = async (lat, lon) => {
  try {
    const response = await axios.get("/api/Kakaomap", {
      params: { lat, lon },
    });
    return response.data;
  } catch (error) {
    console.error("❌ 카카오 좌표 → 주소 API 호출 실패:", error.response?.data || error.message);
    return null;
  }
};