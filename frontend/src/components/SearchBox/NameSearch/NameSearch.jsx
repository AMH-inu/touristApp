import React, { useState, useEffect } from "react";
import SearchResult from "../SearchResult"; // 검색 결과 컴포넌트 import
import { fetchTouristPlaces } from "../../fetch"; // 지역별 관광지 검색 API 호출 함수 import
import "./NameSearch.css"; // CSS 스타일 import

const MAX_SEARCH_HISTORY = 10; // 최근 검색어 기록 최대 개수

// 이름으로 검색 기능을 제공하는 컴포넌트
const NameSearch = ({ history, setHistory, 
                      keyword, setKeyword, 
                      results, setResults, 
                      favorites, onSelectPlace, 
                      toggleFavorite, page, setPage }) => {

  // useState Hook
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 관리
  const [hasSearched, setHasSearched] = useState(false); // 검색 버튼을 눌렀는지 여부 관리 

  // 검색어에 해당하는 검색 결과를 가져오는 함수
  const handleSearch = async (historyParam = keyword) => {
    if (!historyParam.trim()) return; // 검색어가 비어있으면 검색하지 않음

    // 각각의 상태 지정
    setHasSearched(true);             // 검색이 실제로 실행되었음을 표시
    updateHistory(historyParam);      // 검색어를 기록에 추가
    setKeyword(historyParam);         // 검색어 상태 업데이트
    setLoading(true);                 // 로딩 중으로 변경
    setPage(1);                       // 페이지를 1로 초기화

    try {
      const data = await fetchTouristPlaces(historyParam, page); // API 호출하여 검색 결과 가져오기
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

  // useEffect 1) 최근 검색어 정보를 로컬 스토리지로부터 불러오는 함수
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setHistory(saved);
  }, []);

  // useEffect 2) 페이지가 바뀔 경우 현재 검색어의 변경된 페이지 결과를 새롭게 가져오는 함수
    useEffect(() => {
    if (keyword) {
      setPage(page); // 페이지 상태 업데이트
      handleSearch(keyword); // 현재 키워드로 검색
    }
  }, [page]);

  // 검색어 기록을 업데이트함 (새로운 검색어를 추가하고, 최대 개수를 초과하면 가장 오래된 검색어부터 제거)
  const updateHistory = (newKeyword) => {
    let updated = [newKeyword, ...history.filter(k => k !== newKeyword)];
    if (updated.length > MAX_SEARCH_HISTORY) updated = updated.slice(0, MAX_SEARCH_HISTORY);
    setHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  // 특정 검색어 삭제
  const removeKeyword = (termToRemove) => {
    const updated = history.filter((term) => term !== termToRemove);
    setHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  // 전체 검색어 초기화
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  // 페이지를 변경하는 경우
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Enter 키를 눌렀을 때 handleSearch를 실행하여 검색을 실행하는 함수
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div>
      <h2>🔎 이름으로 검색 </h2>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="검색어를 입력하세요."
      />
      <button onClick={handleSearch} disabled={loading} style={{ marginLeft: "8px" }}>
        {loading ? "검색 중..." : "검색"}
      </button>

      {history.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <h4>🔍 최근 검색어 </h4>

          {/* 최근 검색어 버튼 */}
          <ul className="search-history-list">
            {history.map((term, index) => (
              <li key={index} className="search-history-item">
                <div className="search-history-button">
                  <button
                    className="search-history-term"
                    onClick={() => handleSearch(term)}>
                    {term}
                  </button>

                   {/* 개별 삭제 버튼 */}
                  <button
                    onClick={() => removeKeyword(term)}
                    className="search-history-remove"
                    title="삭제">
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <br />             
          {/* 전체 삭제 */}
          <button
            onClick={clearHistory}
            className="clear-history-button">
            전체 삭제
          </button>
        </div>
      )}

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
          className="pagination-arrow">
          &gt;
        </button>
      </div>
      
      <hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />

      {loading && <p>⏳ 관광지 정보를 불러오는 중입니다...</p>}
      
      {/* 검색 결과 출력 */}

      {!loading && results.length === 0 && keyword && (
        <p>❗ 검색 결과가 없습니다.</p>
      )}

      <SearchResult results={results}
          favorites = {favorites}
          toggleFavorite = {toggleFavorite}
          onSelectPlace={onSelectPlace} />
    </div>
  );
};

export default NameSearch;