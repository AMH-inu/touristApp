// import
import "./Title.css"; // CSS 스타일

// 제목 컴포넌트 (화면 상단 위치)
const Title = () => {

  // return : 컴포넌트 HTML 렌더링 (정적 형태)
  return (
    <div>
    <div className="Title">
      <h1>📌 우리의 관광지를 찾아서 </h1>
    </div>
    <div className="Description">
      <p>대한민국 곳곳에 숨어 있는 우리 주변의 관광지를 찾아보세요.</p>
      <p>각각의 관광지의 주소 및 관련 이미지, 지도 정보, 설명 및 현재 날씨 정보 등을 제공합니다.</p>
      <p className="copyright"> @ 자료 제공 : 한국관광공사 Tour API, KaKao Map API, 기상청 Weather API </p>
    </div>
    </div>
  );
};

export default Title;