import "./SearchResult.css";

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