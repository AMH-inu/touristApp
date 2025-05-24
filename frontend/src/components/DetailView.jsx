import React, { useState, useEffect, useRef } from "react";
import Kakaomap from "../../../api/Kakaomap"; // 카카오맵 로딩 함수
import {fetchPlaceDetail, fetchWeather, fetchKakaoMap} from "./fetch"; // 지역별 관광지 검색 API 호출 함수 import
import "./DetailView.css"; // 스타일은 따로 분리

const DetailView = ({ place, onBack }) => {
  const [weather, setWeather] = useState(null); // 현재 날씨 정보를 위한 상태
  const [weather2, setWeather2] = useState(null); // 내일 날씨 예보를 위한 상태
  const mapRef = useRef(null);
  const [detail, setDetail] = useState(null);

  // 관광지의 현재 날씨 정보를 불러옴
  useEffect(() => {
    if (detail?.mapy && detail?.mapx) {
    const getWeather = async () => {
      const data = await fetchWeather(detail.mapy, detail.mapx);
      setWeather(data);
    };

    getWeather();
  }
  }, [detail]);

  // 관광지의 내일 날씨 정보를 불러옴
  useEffect(() => {
    if (detail?.mapy && detail?.mapx) {
    const getTomorrowWeather = async () => {
      const data = await fetchWeather(detail.mapy, detail.mapx, 1);
      setWeather2(data);     
    };

    getTomorrowWeather();
  }
  }, [detail]);

  useEffect(() => {
  console.log("weather가 업데이트 됨:", weather);
  console.log("weather2가 업데이트 됨:", weather2);
  }, [weather, weather2]);

  // 관광지의 지도 정보를 불러옴
  useEffect(() => {
  if (place && mapRef.current) {
    fetchKakaoMap({lat: place.mapy, lng: place.mapx, container: mapRef.current,});
  } else {
    console.warn("🛑 지도 생성 불가 - place 또는 mapRef가 없습니다.");
  }
}, [place]);

  // 관광지의 상세 정보를 불러옴
  useEffect(() => {
    if (place?.contentid) {
      const fetchDetail = async () => {
        const result = await fetchPlaceDetail(place.contentid);
        if (result) {
          setDetail(result);
        } else {
          console.warn("❗ 관광지 상세 정보를 못 받음");
       }
      };

    fetchDetail();
  } else {
    console.warn("❌ place.contentid 없음");
  }
}, [place?.contentid]);

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
