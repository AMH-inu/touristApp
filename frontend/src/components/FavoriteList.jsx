import React, { useState, useEffect } from "react";
import SearchResult from "./SearchResult";

const FavoriteList = ({ favorites, onSelectPlace, toggleFavorite }) => {

  return (
    <div>
      <h2>⭐ 즐겨찾기 목록</h2>
      <hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />
      {favorites.length === 0 ? (
        <p>💬 즐겨찾기한 관광지가 없습니다.</p>
      ) : (
        <SearchResult
          results={favorites} // ✅ 전체 즐겨찾기 목록을 사용
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          onSelectPlace={onSelectPlace}
        />
      )}
    </div>
  );
};

export default FavoriteList;