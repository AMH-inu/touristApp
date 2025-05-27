// import
import { useState } from 'react'; // useState Hook
import SearchBox from './components/SearchBox/SearchBox'; // 검색 화면 컴포넌트
import DetailView from './components/DetailView/DetailView'; // 상세 보기 화면 컴포넌트
import Title from "./components/Title/Title"; // 제목 컴포넌트
import DarkModeToggle from "./components/DarkMode/DarkModeToggle"; // 다크 모드 토글 컴포넌트
import './App.css'; // CSS 스타일

// App 컴포넌트 : 전체 애플리케이션의 구조를 정의하는 최상위 컴포넌트
function App() {

  // useState Hook
  const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 관광지 저장

  // 기능별 함수 정의
  // 1. 선택된 관광지가 있으면 상세 보기 화면을 렌더링하고, 없으면 검색 화면을 렌더링하도록 함
  const renderContent = () => {
    if (selectedPlace) { // 만약 선택된 관광지가 있다면 DetailView 컴포넌트를 렌더링
      return <DetailView place={selectedPlace} onBack={() => setSelectedPlace(null)} />;
    } else { // 선택한 관광지가 없으면 SearchBox 컴포넌트를 렌더링
      return <SearchBox onSelectPlace={setSelectedPlace} />;
    }
  };

  // return : 컴포넌트 HTML 렌더링
  return (
    <>
    <div className="DarkModeToggle">
      <DarkModeToggle />
    </div>
    <div className="Title">
      <Title /> 
    </div>
    <div className="MainComponent">
      {renderContent()} 
    </div>
    </>
  );
}
export default App;