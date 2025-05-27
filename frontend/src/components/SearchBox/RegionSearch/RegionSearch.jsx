import React, { useState, useEffect, useRef } from "react";
import SearchResult from "../SearchResult"; // 검색 결과 컴포넌트 import
import {fetchAreaSearch, fetchRegionLists} from "../../fetch"; // 지역별 관광지 검색 API 호출 함수 import
import "./RegionSearch.css"; // CSS 스타일 import

// 지역별로 검색 기능을 제공하는 컴포넌트
const RegionSearch = ({ selectedSido, setSelectedSido, 
                        selectedSigungu, setSelectedSigungu, 
                        results, setResults, 
                        favorites, onSelectPlace, 
                        page, setPage, toggleFavorite }) => {

  const isFirstRender = useRef(true); // 첫 렌더링 여부를 확인하기 위한 변수

  // useState Hook
  const [loading, setLoading] = useState(false); // 로딩 상태 관리 
  const [sidoList, setSidoList] = useState([]); // 시도 목록 관리 
  const [sigunguList, setSigunguList] = useState([]); // 시군구 목록 관리 
  const [hasSearched, setHasSearched] = useState(false); // 검색 버튼을 눌렀는지 여부 관리 
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 관리 

  // 선택한 지역에 해당하는 검색 결과를 가져오는 함수
  const handleSearch = async () => {
    if (!selectedSido || !selectedSigungu) { return; } // 시도나 시군구가 선택되지 않은 경우 검색 실행 X

    // 각각의 상태 지정
    setLoading(true);       // 로딩 중으로 변경 
    setHasSearched(true);   // 검색 버튼을 눌렀음을 표시
    setPage(1);             // 페이지를 1로 초기화

    try {
      const data = await fetchAreaSearch(selectedSido, selectedSigungu, page);
      setTotalPages(Math.ceil(data.totalCount / 30)); // 전체 페이지 수 계산 (30개씩 나누기)

      if (data.totalcount === 0) {
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

  // useEffect 1) 시도 목록(sidoList)을 가져오는 함수 
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
  if (!isFirstRender.current) // 첫 렌더링이 아닌 경우 
  { setSelectedSigungu(""); 
    setResults([]);
  }  // 시도가 선택되면 시군구를 초기화 & 검색 결과 초기화


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
    if (selectedSido && selectedSigungu) {
      setPage(page); // 페이지 상태 업데이트
      handleSearch(); // 현재 조건으로 검색
    }
  }, [page]);

  // useEffect 4) 선택된 시도나 시군구가 바뀔 경우 페이지를 1로 초기화하는 함수
  /* useEffect(() => {
    if (isFirstRender.current) { // 첫 렌더링 이후로 false로 전환 / 첫 렌더링 이전에는 실행하지 않음
      isFirstRender.current = false;
    } else {
        setPage(1); // 페이지를 1로 세팅 
    }
  }, [selectedSido, selectedSigungu]); */

  // 페이지를 변경하는 경우
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  
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