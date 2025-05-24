import React, { useState, useEffect } from "react";
import NameSearch from "./NameSearch";
import RegionSearch from "./RegionSearch";
import FavoriteList from "./FavoriteList";
import "./SearchBox.css"; // 스타일 파일

const SearchBox = ({ onSelectPlace }) => {
  // 각각의 탭에서의 검색어와 결과, 즐겨찾기를 관리하기 위한 useState Hook
  // nameSearch와 regionSearch 각각의 상태를 관리
  const [history, setHistory] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedSido, setSelectedSido] = useState("");
  const [selectedSigungu, setSelectedSigungu] = useState("");
  const [NameResults, setNameResults] = useState([]);
  const [RegionResults, setRegionResults] = useState([]);
  const [page1, setPage1] = useState(1); // ✅ 현재 페이지
  const [page2, setPage2] = useState(1); // ✅ 현재 페이지

  const [activeTab, setActiveTab] = useState("name");
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("tour_favorites")) || [];
  });

  // 즐겨찾기 상태를 로컬 스토리지에서 불러오기
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

  // 즐겨찾기 상태를 로컬 스토리지에 저장하기
  useEffect(() => {
    localStorage.setItem("tour_favorites", JSON.stringify(favorites));
    }, [favorites]);

  // 즐겨찾기 토글
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