import SearchResult from "../SearchResult";

// favorites : 현재 즐겨찾기 목록
// onSelectPlace : 선택된 관광지를 변경하는 함수
// toggleFavorite : 즐겨찾기 상태를 제공하는 함수

// 즐겨찾기 목록을 보여주는 컴포넌트
const FavoriteList = ({ favorites, onSelectPlace, toggleFavorite }) => {

  return (
    <div>
      <h2>⭐ 즐겨찾기 목록</h2>
      <hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />
      {favorites.length === 0 ? (
        <p>💬 즐겨찾기한 관광지가 없습니다.</p>
      ) : (
        <SearchResult
          results={favorites} // 검색 결과로 전체 즐겨찾기 목록을 보여줌
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          onSelectPlace={onSelectPlace}
        />
      )}
    </div>
  );
};

export default FavoriteList;