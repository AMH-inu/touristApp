// import
import React, { useState, useEffect } from "react"; // React 라이브러리 및 Hook
import NameSearch from "./NameSearch/NameSearch"; // 이름으로 검색 컴포넌트
import RegionSearch from "./RegionSearch/RegionSearch"; // 지역별로 검색 컴포넌트
import FavoriteList from "./FavoriteList/FavoriteList"; // 즐겨찾기 조회 컴포넌트
import "./SearchBox.css"; // CSS 스타일

// 검색 기능과 관련된 메뉴 및 검색 결과를 나타내는 컴포넌트
const SearchBox = ({ onSelectPlace }) => {
  
  // useState Hook
  // 특징) 부모 컴포넌트에서 자식 컴포넌트 각각의 상태를 통합 관리하도록 구현 (부모 컴포넌트에서의 관리)
  // 목적) SearchBox 내 다른 컴포넌트로 이동하더라도 각각의 컴포넌트 검색 결과를 유지시키기 위함 

  // useState 1) 현재 활성화되어 있는 검색 메뉴명을 관리하는 상태
  const [activeTab, setActiveTab] = useState("name");

  // useState 2) NameSearch 컴포넌트에서 사용될 useState Hook (최근 검색어 기록, 현재 검색어, 검색 결과, 현재 페이지)
  const [history, setHistory] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [NameResults, setNameResults] = useState([]);
  const [page1, setPage1] = useState(1);

  // useState 3) RegionSearch 컴포넌트에서 사용될 상태 (선택된 시도, 선택된 시군구, 검색 결과, 현재 페이지)
  const [selectedSido, setSelectedSido] = useState("");
  const [selectedSigungu, setSelectedSigungu] = useState("");
  const [RegionResults, setRegionResults] = useState([]);
  const [page2, setPage2] = useState(1);

  // useState 4) 즐겨찾기 목록을 관리하는 useState (매 실행 시마다 로컬 스토리지에서 자동으로 불러옴)
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("tour_favorites")) || [];
  });

  // useEffect Hook 
  // useEffect 1) 즐겨찾기 상태를 로컬 스토리지에서 불러오는 함수 
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tour_favorites");
      if (saved) {
        setFavorites(JSON.parse(saved)); // 객체 배열로 저장
      }
    } catch (e) {
      console.error("로컬 스토리지 불러오기 실패 :", e);
      setFavorites([]);
    } // 예외 처리
  }, []);

  // useEffect 2) 즐겨찾기 상태를 로컬 스토리지에 저장하는 함수
  useEffect(() => {
    localStorage.setItem("tour_favorites", JSON.stringify(favorites));
    }, [favorites]);

  // 기능별 함수 정의 
  // 1. 즐겨찾기 토글 기능 (토글을 클릭하면 즐겨찾기에 추가/제거됨, 각각의 자식 컴포넌트에서 모두 사용)
  const toggleFavorite = (place) => {
    setFavorites((prev) => {
     const exists = prev.find((p) => p.contentid === place.contentid);
        if (exists) {
        return prev.filter((p) => p.contentid !== place.contentid);
        } else {
         return [...prev, place];
        }
    });
    };

  // return : 컴포넌트 HTML 렌더링
  return (
    <div className="search-container">
      <div className="search-tabs">
        <button
          className={activeTab === "name" ? "tab active" : "tab"}
          onClick={() => setActiveTab("name")}
        >
          이름으로 검색
        </button>
        <button
          className={activeTab === "region" ? "tab active" : "tab"}
          onClick={() => setActiveTab("region")}
        >
          지역별로 검색
        </button>
        <button
          className={activeTab === "favorite" ? "tab active" : "tab"}
          onClick={() => setActiveTab("favorite")}
        >
          즐겨찾기 조회
        </button>
      </div>
      <hr />
      <div className="search-content">
        {activeTab === "name" && <NameSearch 
          history={history}
          setHistory={setHistory}
          keyword={keyword}
          setKeyword={setKeyword}
          results={NameResults}
          setResults={setNameResults}
          favorites={favorites}
          onSelectPlace={onSelectPlace}
          toggleFavorite={toggleFavorite}
          page={page1}
          setPage={setPage1} />}

        {activeTab === "region" && <RegionSearch 
          selectedSido={selectedSido}
          setSelectedSido={setSelectedSido}
          selectedSigungu={selectedSigungu}
          setSelectedSigungu={setSelectedSigungu}
          results={RegionResults}
          setResults={setRegionResults} 
          favorites={favorites}
          onSelectPlace={onSelectPlace}
          toggleFavorite={toggleFavorite} 
          page={page2}
          setPage={setPage2} />}

        {activeTab === "favorite" && <FavoriteList
          favorites={favorites}
          onSelectPlace={onSelectPlace}
          toggleFavorite={toggleFavorite} />}
      </div>
    </div>
  );
};

export default SearchBox;