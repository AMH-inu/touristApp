// import
import "./SearchResult.css"; // CSS 스타일

// results : 검색 결과 저장 배열              // favorites : 즐겨찾기 목록 저장 배열
// onSelectPlace : 선택된 관광지 변경 함수    // toggleFavorite : 즐겨찾기 토글 기능

// 검색 결과를 보여주는 컴포넌트
const SearchResult = ({ results, favorites, onSelectPlace, toggleFavorite }) => {

  // return : 컴포넌트 HTML 렌더링
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