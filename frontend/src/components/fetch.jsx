import axios from "axios";

// 서버리스 API를 호출하는 각각의 fetch 함수 정의

// 1. 지역 코드와 시군구 코드를 기반으로 관광지 목록을 가져오는 함수
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

// 2. 관광지 이름을 기반으로 검색하는 함수
export const fetchTouristPlaces = async (keyword, pageNo = 1) => {
  try {
    const response = await axios.get("/api/NameSearch", {
      params: { keyword, pageNo },
    });

    return response.data;
  } catch (error) {
    console.error("❌ 서버리스 API 호출 실패:", error.response?.data || error.message);
    return [];
  }
};

// 3. 지역 목록을 가져오는 함수
export const fetchRegionLists = async (areaCode = "") => {
  try {
    const response = await axios.get("/api/RegionList", {
      params: { areaCode },
    });

    return response.data;
  } catch (error) {
    console.error("❌ 서버리스 API 호출 실패:", error.response?.data || error.message);
    return [];
  }
};

// 4. ID로 관광지 상세 정보를 가져오는 함수
export const fetchPlaceDetail = async (contentId) => {
  try {
    const response = await axios.get("/api/DetailInfo", {
      params: { contentId },
    });

    return response.data;
  } catch (error) {
    console.error("❌ 관광지 상세 정보 API 호출 실패:", error.response?.data || error.message);
    return null;
  }
};

// 5. 관광지의 날씨 정보를 가져오는 함수
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

// 6. 카카오맵 지도를 가져오는 함수
export const fetchKakaoMap = async (onLoadCallback) => {
  try {
    // 서버리스에서 JavaScript Key 받아오기
    const response = await axios.get("/api/Kakaomap");
    const jsKey = response.data.key;

    if (!jsKey) throw new Error("JavaScript Key를 받아오지 못했습니다.");

    // Kakao Maps SDK 스크립트 동적 삽입
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${jsKey}&autoload=false&libraries=services`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("✅ Kakao Maps SDK 로드 완료");
        onLoadCallback();
      });
    };
    document.head.appendChild(script);
  } catch (error) {
    console.error("❌ Kakao JS SDK 로드 실패:", error.message);
  }
};