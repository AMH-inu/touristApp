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
    const response = await axios.get("/api/NameSearch", {
      params: { keyword, pageNo },
    });

    return response.data;
  } catch (error) {
    console.error("❌ 서버리스 API 호출 실패:", error.response?.data || error.message);
    return [];
  }
};

// 지역 목록을 가져오는 함수
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

// ID로 관광지 상세 정보를 가져오는 함수
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

// 좌표에 해당하는 주소를 가져오는 함수
export const fetchKakaoMap = async (lat, lon) => {
  try {
    const response = await axios.get("/api/Kakaomap", {
      params: { lat, lon },
    });
    console.log(response.data.address);
    return response.data.address || "주소 정보 없음";
  } catch (error) {
    console.error("❌ 좌표 → 주소 변환 API 호출 실패:", error.response?.data || error.message);
    return "주소 정보 없음";
  }
};

// 주소 기반 카카오맵을 표시하는 함수
export const displayMap = (container, lat, lon, address) => {
  if (!window.kakao || !window.kakao.maps) {
    console.error("❌ Kakao Maps SDK가 로드되지 않았습니다.");
    return;
  }

  const map = new window.kakao.maps.Map(container, {
    center: new window.kakao.maps.LatLng(lat, lon),
    level: 3,
  });

  const marker = new window.kakao.maps.Marker({
    position: new window.kakao.maps.LatLng(lat, lon),
  });
  marker.setMap(map);

  const infoWindow = new window.kakao.maps.InfoWindow({
    content: `<div style="padding:5px;">${address}</div>`,
  });
  infoWindow.open(map, marker);

  console.log("✅ 지도와 주소 인포윈도우 생성 완료!");
};