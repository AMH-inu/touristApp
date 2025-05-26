import "./SearchResult.css";

// results : 검색 결과를 저장하는 배열
// favorites : 즐겨찾기 목록을 저장하는 배열
// onSelectPlace : 선택된 관광지를 변경하는 함수
// toggleFavorite : 즐겨찾기 상태를 제공하는 함수

// 검색 결과를 보여주는 컴포넌트
const SearchResult = ({ results, favorites, onSelectPlace, toggleFavorite }) => {
  return (
    <ul className="search-result-list">
      {results.map((place) => (
        <li
          key={place.contentid}
          className="tour-card"
        >            
          <img
            src={place.firstimage || "/image/no_image.png"}
            alt={place.title}
            className="tour-image"
          />         
          <div className="tour-card-header">
            <h3>{place.title}</h3>
          <button
            onClick={() => toggleFavorite(place)} // 객체 전체 전달
            className="favorite-button"
          >
            {favorites.find((f) => f.contentid === place.contentid) ? "❤️" : "🤍"}
          </button>
          </div>

          <p className="tour-card-address">
           {place.addr1 || "주소 없음"}
          </p>
          <br />
          <button onClick={() => onSelectPlace(place)} className="detail-link">
            📌 상세보기
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SearchResult;