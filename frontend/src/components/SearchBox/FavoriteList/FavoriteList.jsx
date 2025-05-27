// import
import SearchResult from "../SearchResult"; // 검색 결과 컴포넌트

// favorites : 즐겨찾기 목록 저장 배열       // onSelectPlace : 선택된 관광지 변경 함수
// toggleFavorite : 즐겨찾기 토글 기능

// 즐겨찾기 목록을 보여주는 컴포넌트
const FavoriteList = ({ favorites, onSelectPlace, toggleFavorite }) => {

  // return : 컴포넌트 HTML 렌더링
  return (
    <div>
      <h2>⭐ 즐겨찾기 목록</h2>
      <hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />
      {favorites.length === 0 ? (
        <p>💬 즐겨찾기한 관광지가 없습니다.</p>
      ) : (
        <SearchResult
          results={favorites}   // 전체 즐겨찾기 목록을 검색 결과로서 보여줌
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          onSelectPlace={onSelectPlace}
        />
      )}
    </div>
  );
};

export default FavoriteList;