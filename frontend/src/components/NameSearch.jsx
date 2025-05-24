import React, { useState, useEffect } from "react";
import SearchResult from "./SearchResult"; // 검색 결과 컴포넌트 import
import { fetchTouristPlaces } from "./fetch"; // 지역별 관광지 검색 API 호출 함수 import

const MAX_SEARCH_HISTORY = 10; // 최대 검색 기록 개수
const NameSearch = ({ history, setHistory, 
                      keyword, setKeyword, 
                      results, setResults, 
                      favorites, onSelectPlace, 
                      toggleFavorite, page, setPage }) => {

  let isFirstRender = 0;

  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1); // ✅ 전체 페이지 수

 // 최근 검색어 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setHistory(saved);
  }, []);

  // 검색어 기록 업데이트
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

  const handleSearch = async (historyParam = keyword) => {
    if (!historyParam.trim()) return; // 검색어가 비어있으면 검색하지 않음
    updateHistory(historyParam); // 검색어를 기록에 추가
    setKeyword(historyParam); // 검색어 상태 업데이트
    setLoading(true);

    try {
      const data = await fetchTouristPlaces(historyParam, page); // API 호출하여 검색 결과 가져오기
      setTotalPages(Math.ceil(data.totalCount / 30)); // 전체 페이지 수 계산 (30개씩 나누기)
      console.log(totalPages);

      if (data.totalCount === 0) {
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

  useEffect(() => {
      if (isFirstRender < 2) {  // 첫 렌더링 때는 실행 X
        isFirstRender++;
      } else {
        setPage(1);
      }
  }, [keyword]); // ✅ 키워드 바뀔 때마다 페이지를 1로 초기화

  
  useEffect(() => {
    if (keyword) {
      handleSearch(keyword); // 현재 키워드로 검색
    }
  }, [page]); // ✅ 페이지 바뀔 때마다 page에 맞는 검색 결과를 가져옴

  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

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
          <ul style={{ display: "flex", flexWrap: "wrap", listStyle: "none", paddingLeft: 0 }}>
            {history.map((term, index) => (
              <li
                key={index}
                style={{
                  marginRight: "12px", // 다음 검색어와 간격
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#f5f5f5",
                    border: "1px solid #ccc",
                    borderRadius: "16px",
                    padding: "4px 8px",
                  }}
                >
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      padding: "0 6px 0 0",
                      fontSize: "0.85rem",
                    }}
                    onClick={() => handleSearch(term)}
                  >
                    {term}
                  </button>

                   {/* 개별 삭제 버튼 */}
                  <button
                    onClick={() => removeKeyword(term)}
                    style={{
                      padding: "0 6px",
                      border: "none",
                      borderRadius: "50%",
                      background: "#ff6b6b",
                      color: "#fff",
                      fontWeight: "bold",
                      cursor: "pointer",
                      lineHeight: "1",
                      fontSize: "14px",
                    }}
                    title="삭제"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
                            
          {/* 전체 삭제 */}
          <button
            onClick={clearHistory}
            style={{
              marginBottom: "8px",
              padding: "4px 10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#ffe0e0",
              cursor: "pointer",
            }}
          >
            전체 삭제
          </button>
        </div>
      )}
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