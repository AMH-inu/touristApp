// import
import React, { useState, useEffect, useRef } from "react"; // React 라이브러리 및 Hook
import SearchResult from "../SearchResult"; // 검색 결과 컴포넌트
import {fetchAreaSearch, fetchRegionLists} from "../../fetch"; // 지역별 관광지 검색 API 호출 함수
import "./RegionSearch.css"; // CSS 스타일

// 지역별로 검색 기능을 제공하는 컴포넌트
const RegionSearch = ({ selectedSido, setSelectedSido, 
                        selectedSigungu, setSelectedSigungu, 
                        results, setResults, 
                        favorites, onSelectPlace, 
                        page, setPage, toggleFavorite,
                        totalPages, setTotalPages }) => {

  // useState Hook
  const [loading, setLoading] = useState(false); // 로딩 상태 관리 
  const [sidoList, setSidoList] = useState([]); // 시도 목록 관리 
  const [sigunguList, setSigunguList] = useState([]); // 시군구 목록 관리 
  const [hasSearched, setHasSearched] = useState(false); // 검색 버튼을 눌렀는지 여부 관리 

  // useRef Hook
  const isFirstMount = useRef(true);

  // useEffect Hook
  // useEffect 1) 시도 목록(sidoList)을 가져오는 함수 (첫 렌더링 시 자동 실행)
  useEffect(() => {
  const fetchSidoList = async () => {
    try {
      const data = await fetchRegionLists(); // API에서 시도 목록 받아오기
      setSidoList(data); // state에 저장
    } catch (error) {
      console.error("시도 목록 불러오기 실패:", error); // 예외 처리
    }
  };
  fetchSidoList();
  }, []);

  // useEffect 2) (시도가 선택되면) 시도에 따른 시군구 목록(sigunguList)을 가져오는 함수 
  useEffect(() => {
  if (!selectedSido) return;

  // isFirstMount를 사용하여 첫 렌더링 시에는 시군구를 초기화하지 않도록 함
  if (isFirstMount.current) {
    isFirstMount.current = false; 
  } else { 
    setSelectedSigungu("");  
  }

  const fetchSigunguList = async () => {
    try {
      const data = await fetchRegionLists(Number(selectedSido)); // ← ID를 숫자로 변환하여 대입
      setSigunguList(data);
    } catch (error) {
      console.error("시군구 불러오기 실패:", error); // 예외 처리
    }
  };
  fetchSigunguList();
}, [selectedSido]);

  // useEffect 3) 페이지가 바뀔 경우 현재 조건의 변경된 페이지 결과를 새롭게 가져오는 함수
  useEffect(() => {
    if (hasSearched) {
      handleSearch(page);
    }
  }, [page]);

  // 기능별 함수 정의
  // 1. 선택한 지역(시도 및 시군구) 및 현재 페이지에 해당하는 검색 결과를 가져오는 함수
  const handleSearch = async (page) => {
    if (!selectedSido && !selectedSigungu) {
      return;
    }

    setLoading(true);  // 로딩 중으로 변경 
    setHasSearched(true); // 검색 버튼을 눌렀음을 표시

    try {
      const data = await fetchAreaSearch(selectedSido, selectedSigungu, page);
      setTotalPages(Math.ceil(data.totalCount / 30)); // 전체 페이지 수 계산 (30개씩 나누기)

      if (data.totalCount === 0) {
        alert("검색 결과가 없습니다.");
      } else {
        setResults(data.items);
      }
    } catch (error) { // 에러가 발생하는 경우 예외 처리
      console.error("❌ 검색 중 오류:", error);
    } finally {
      setLoading(false); // 검색이 끝날 경우 로딩 상태는 무조건 해제
    }
  };

  // 2. 페이지를 변경하는 경우
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // 3. 검색 버튼를 마우스로 눌렀을 때 handleSearch를 실행하여 검색을 실행하는 함수
  const handleClickSearch = () => {
    const resetPage = 1;
    setPage(resetPage);
    handleSearch(resetPage);
  };

  // 4. Enter 키를 눌렀을 때 handleSearch를 실행하여 검색을 실행하는 함수 (시도, 시군구 모두 선택된 경우) 
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // 시도와 시군구가 모두 선택된 경우만 검색 실행되도록 함
      if (selectedSido && selectedSigungu) {
        const resetPage = 1;
        setPage(resetPage);
        handleSearch(resetPage);
      } else { // 예외 처리
        alert("시도와 시군구를 모두 선택하세요.");
      }
    }
  };
  
  // return : 컴포넌트 HTML 렌더링
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
      <select value={selectedSigungu} onChange={(e) => setSelectedSigungu(e.target.value)} 
              onKeyDown={handleKeyPress} disabled={!sigunguList.length}>
        <option value="">시/군/구 선택</option>
        {sigunguList.map((sigungu) => (
          <option key={sigungu.code} value={sigungu.code}>{sigungu.name}</option>
        ))}
      </select>

      <button onClick={handleClickSearch} style={{ marginLeft: "8px" }}>{loading ? "검색 중..." : "검색"}</button>

      {/* 페이지네이션 */}
      <div className="pagination-container">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="pagination-arrow">
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`pagination-button ${page === p ? "active" : ""}`}>
            {p}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="pagination-arrow"
        >
          &gt;
        </button>
      </div>

      <hr className="divider" />

      {loading && <p>⏳ 관광지 정보를 불러오는 중입니다...</p>}

      {!loading && hasSearched && results.length === 0 && (
        <p>❗ 검색 결과가 없습니다.</p>
      )}

      <SearchResult
        results={results}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        onSelectPlace={onSelectPlace}/>
    </div>
  );
};

export default RegionSearch;