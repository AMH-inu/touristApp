// import
import React, { useState, useEffect, useRef } from "react"; // React 라이브러리 및 Hook
import {fetchPlaceDetail, fetchWeather, fetchKakaoMap} from "../fetch"; // 지역별 관광지 검색 API 호출 함수
import "./DetailView.css"; // CSS 스타일

// 관광지 상세 정보를 별도 화면으로 나타내는 컴포넌트
const DetailView = ({ place, onBack }) => {

  // useState Hook
  const [weather, setWeather] = useState(null); // 현재 날씨 정보
  const [weather2, setWeather2] = useState(null); // 내일 날씨 정보
  const [detail, setDetail] = useState(null); // 선택된 관광지의 상세 정보 (json 형태로 저장)
  const [isSdkLoaded, setIsSdkLoaded] = useState(false); // 카카오 SDK가 로드되었는지 여부를 저장하는 상태

  // useRef Hook
  const mapRef = useRef(null); // 카카오 맵을 렌더링할 div 요소를 참조

  // useEffect Hook
  // useEffect 1) Kakao SDK 동적 로드 (컴포넌트 실행 시 무조건 자동 실행)
  useEffect(() => {
    fetchKakaoMap(() => setIsSdkLoaded(true));
  }, []);

  // useEffect 2) 선택된 관광지의 세부 정보가 바뀌면(관광지 새로 선택 시) 관광지의 현재 날씨 정보를 불러옴
  useEffect(() => {
    if (detail?.mapy && detail?.mapx) {
    const getTodayWeather = async () => {
      const data = await fetchWeather(detail.mapy, detail.mapx);
      setWeather(data);
    };
    getTodayWeather();
    } else {
      console.warn("❗ 현재 실시간 날씨 정보를 못 받음"); // 예외 처리
    }
  }, [detail]);

  // useEffect 3) 선택된 관광지의 세부 정보가 바뀌면(관광지 새로 선택 시) 관광지의 내일 날씨 예보를 불러옴
  useEffect(() => {
    if (detail?.mapy && detail?.mapx) {
    const getTomorrowWeather = async () => {
      const data = await fetchWeather(detail.mapy, detail.mapx, 1);
      setWeather2(data);     
    };
    getTomorrowWeather();
  } else {
      console.warn("❗ 내일일 날씨 정보를 못 받음"); // 예외 처리
    }
  }, [detail]);

  // useEffect 4) 관광지가 새로 선택되거나 SDK가 로드되면 관광지의 카카오 맵 정보를 불러옴
  useEffect(() => {
    // 위도와 경도에 반영
    const lat = detail?.mapy;
    const lon = detail?.mapx;

    // 카카오 맵 SDK가 로드되었고, 위도와 경도가 존재하며, mapRef가 유효한 경우에만 맵을 초기화
    if (isSdkLoaded && lat && lon && mapRef.current) {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(lat, lon),
        level: 2,
      };
      const map = new window.kakao.maps.Map(container, options);
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(lat, lon),
      });
      marker.setMap(map);
    }
  }, [isSdkLoaded, detail]);

  // useEffect 5) 관광지의 ID 값 변화(관광지 새로 선택) 시 관광지의 상세 정보를 불러옴
  useEffect(() => {
    if (place?.contentid) {
      const fetchDetail = async () => {
        const result = await fetchPlaceDetail(place.contentid); // 장소의 ID를 기반으로 상세 정보에 접근
        if (result) {
          setDetail(result);
        } else {
          console.warn("❗ 관광지 상세 정보를 못 받음"); // 예외 처리
       }
      };
    fetchDetail();
  } else {
    console.warn("❌ place.contentid 없음");
  }
}, [place?.contentid]);

  // return : 컴포넌트 HTML 렌더링
  // 만약 place가 없으면(상세 정보를 아직 불러오지 못했으면) 로딩 중 메시지를 표시

  if (!place) return <p>⏳ 상세 정보를 불러오는 중입니다...</p>;

  return (
    <div className="detail-container">
      <button className="detail-back-button" onClick={onBack}>← 처음 화면으로 돌아가기</button>
      <h2 className="detail-title">{place.title}</h2>
      <hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />
      <p className="detail-address">🗺️ {place.addr1}</p>
      <p className="detail-homepage" 
      dangerouslySetInnerHTML={{__html: detail?.homepage? `🖥️ ${detail.homepage}`: "🖥️ 홈페이지가 없습니다."}}/>     
      <div className="detail-content-wrapper">
        <div className="detail-image">
          <img src={place.firstimage || "/image/no_image.png"} alt={place.title} style={{ width: "100%", borderRadius: "8px" }} />
        </div>
        <div className="detail-map" ref={mapRef}></div>
      </div>
      <p className="detail-overview">&nbsp; {detail?.overview || "상세 설명이 없습니다."}</p>
      <hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />
        <div className="detail-weather">
          <h2>☀️ 기상청 실시간 날씨 정보</h2>
            {weather ? (
            <><b>
              <p>🌡 기온 : {weather.TMP !== "정보 없음" ? `${weather.TMP} °C` : "정보 없음"}</p>
              <p>💧 습도 : {weather.REH !== "정보 없음" ? `${weather.REH} %` : "정보 없음"}</p>
              <p>☔ 1시간 강수량 : {weather.RN1 !== "0" ? `${weather.RN1} mm` : "0 mm"}</p>
            </b></>
        ) : (
          <p>🌥 실시간 날씨 정보를 불러오는 중입니다...</p>
        )}
        <hr style={{ border: "1px solid #000", margin: "20px 0" }} />
          <h2>🌥️ 기상청 내일 날씨 예보</h2>
            {weather2 ? (
            <><b>
              <p>🌡 예상 기온 : {weather2.TMP !== "정보 없음" ? `${weather2.TMP} °C` : "정보 없음"}</p>
              <p>💧 예상 습도 : {weather2.REH !== "정보 없음" ? `${weather2.REH} %` : "정보 없음"}</p>
              <p>☔ 1시간 예상 강수량 : {weather2.RN1 !== "0" ? `${weather2.RN1} mm` : "0 mm"}</p>
            </b></>
        ) : (
        <p>🌥 내일 날씨 정보를 불러오는 중입니다...</p>
        )}
      </div>
    </div>
  );
};

export default DetailView;