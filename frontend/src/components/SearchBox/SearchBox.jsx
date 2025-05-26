import React, { useState, useEffect } from "react";
import NameSearch from "./NameSearch/NameSearch";
import RegionSearch from "./RegionSearch/RegionSearch";
import FavoriteList from "./FavoriteList/FavoriteList";
import "./SearchBox.css"; // 스타일 파일

const SearchBox = ({ onSelectPlace }) => {
  // usestate Hook을 사용하여 각각의 상태를 통합 관리 (부모 컴포넌트에서의 관리)
  // 다른 컴포넌트로 이동하여도 각각의 컴포넌트 검색 결과가 유지되도록 구현함 

  // 1. NameSearch 컴포넌트에서 사용될 상태 (최근 검색어 기록, 현재 검색어, 검색 결과, 현재 페이지)
  const [history, setHistory] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [NameResults, setNameResults] = useState([]);
  const [page1, setPage1] = useState(1);

  // 2. RegionSearch 컴포넌트에서 사용될 상태 (선택된 시도, 선택된 시군구, 검색 결과, 현재 페이지)
  const [selectedSido, setSelectedSido] = useState("");
  const [selectedSigungu, setSelectedSigungu] = useState("");
  const [RegionResults, setRegionResults] = useState([]);
  const [page2, setPage2] = useState(1);

  // 3. 현재 활성화되어 있는 검색 메뉴명을 관리하는 상태
  const [activeTab, setActiveTab] = useState("name");

  // 4. 즐겨찾기 상태를 관리하는 useState (매 실행 시마다 로컬 스트리지에서 불러옴)
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("tour_favorites")) || [];
  });

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

  // useEffect 2) 즐겨찾기 상태를 로컬 스토리지에 저장하는 함수수
  useEffect(() => {
    localStorage.setItem("tour_favorites", JSON.stringify(favorites));
    }, [favorites]);


  // 즐겨찾기 토글 (토글을 클릭하면 즐겨찾기에 추가되거나 제거됨)
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