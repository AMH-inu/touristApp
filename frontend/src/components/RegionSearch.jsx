import React, { useState, useEffect } from "react";
import SearchResult from "./SearchResult"; // 검색 결과 컴포넌트 import
import {fetchAreaSearch, fetchRegionLists} from "./fetch"; // 지역별 관광지 검색 API 호출 함수 import

const RegionSearch = ({ selectedSido, setSelectedSido, 
                        selectedSigungu, setSelectedSigungu, 
                        results, setResults, 
                        favorites, onSelectPlace, 
                        page, setPage, toggleFavorite }) => {
  // useState 훅을 사용하여 상태 관리
  // 로딩 여부, 지역 목록, 선택된 지역, 검색 결과, 즐겨찾기 상태 등을 관리
  let isFirstRender = 0;

  const [loading, setLoading] = useState(false);
  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalPages, setTotalPages] = useState(1); // ✅ 전체 페이지 수

  // 1. 시도(areaCode) 목록 불러오기
  useEffect(() => {
  const fetchSidoList = async () => {
    try {
      const data = await fetchRegionLists(); // API에서 시도 목록 받아오기
      setSidoList(data); // state에 저장
    } catch (error) {
      console.error("시도 목록 불러오기 실패:", error);
    }
  };
  fetchSidoList();
  }, []);

  // 2. 시군구(sigunguCode) 목록 불러오기 (선택된 시도에 따라)
useEffect(() => {
  if (!selectedSido) return;

  const fetchSigungu = async () => {
    try {
      const data = await fetchRegionLists(Number(selectedSido)); // ← 문자열을 숫자로 변환
      setSigunguList(data);
    } catch (error) {
      console.error("시군구 불러오기 실패:", error);
    }
  };

  fetchSigungu();
}, [selectedSido]);

  // 3. 지역별 관광지 검색
  const handleSearch = async () => {
    if (!selectedSido && !selectedSigungu) {
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const data = await fetchAreaSearch(selectedSido, selectedSigungu, page);
      setTotalPages(Math.ceil(data.totalCount / 30)); // 전체 페이지 수 계산 (30개씩 나누기)
      console.log("Area", data);

      if (data.totalcount === 0) {
        alert("검색 결과가 없습니다.");
      } else {
        setResults(data);
      }
    } catch (error) {
      console.error("❌ 검색 중 오류:", error);
    } finally {
      setLoading(false); // 무조건 로딩 상태 해제
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
      handleSearch();
      }, [page]); // ✅ 페이지 바뀔 때마다 page에 맞는 검색 결과를 가져옴

  useEffect(() => {
    if (isFirstRender < 2) {  // 첫 렌더링 때는 실행 X
      isFirstRender++;
    } else {
      setPage(1);
    }
  }, [selectedSido, selectedSigungu]); // ✅ 페이지 바뀔 때마다 page에 맞는 검색 결과를 가져옴
  
  return (
    <div>
      <h2>📍 지역별로 검색</h2>

      <select value={selectedSido} onChange={(e) => setSelectedSido(e.target.value)}>
        <option value="">시/도 선택</option>
        {sidoList.map((sido) => (
          <option key={sido.code} value={sido.code}>{sido.name}</option>
        ))}
      </select>
      &nbsp;
      <select value={selectedSigungu} onChange={(e) => setSelectedSigungu(e.target.value)} disabled={!sigunguList.length}>
        <option value="">시/군/구 선택</option>
        {sigunguList.map((sigungu) => (
          <option key={sigungu.code} value={sigungu.code}>{sigungu.name}</option>
        ))}
      </select>

      <button onClick={handleSearch} style={{ marginLeft: "8px" }}>{loading ? "검색 중..." : "검색"}</button>

      {/* 페이지네이션 */}
      <div style={{
            display: "flex",
            justifyContent: "center", // ✅ 가운데 정렬
            alignItems: "center",
            marginTop: "1rem",
            gap: "0.25rem",
        }}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            style={{ padding: "6px 10px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      background: page === p ? "#007bff" : "#fff",
                      color: page === p ? "#fff" : "#333",
                      cursor: "pointer",
                      fontWeight: page === p ? "bold" : "normal", }}>
            {p}
          </button>
        ))}
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          &gt;
        </button>
      </div>

      <hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />
      
      {loading && <p>⏳ 관광지 정보를 불러오는 중입니다...</p>}
      {/* 검색 결과 출력 */}
      {!loading && hasSearched && results.length === 0 && (
        <p>❗ 검색 결과가 없습니다.</p>
      )}

      <SearchResult results={results}
          favorites = {favorites}
          toggleFavorite = {toggleFavorite}
          onSelectPlace={onSelectPlace} />
    </div>
  );
};

export default RegionSearch;