import SearchBox from './components/SearchBox/SearchBox';
import DetailView from './components/DetailView/DetailView';
import Title from "./components/Title/Title";
import DarkModeToggle from "./components/DarkMode/DarkModeToggle";
import { useState } from 'react';
import './App.css';

function App() {
  const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 관광지를 저장하기 위한 상태

  const renderContent = () => {
    if (selectedPlace) { // 만약 선택된 관광지가 있다면 DetailView 컴포넌트를 렌더링
      return <DetailView place={selectedPlace} onBack={() => setSelectedPlace(null)} />;
    } else { // 선택한 관광지가 없으면 SearchBox 컴포넌트를 렌더링
      return <SearchBox onSelectPlace={setSelectedPlace} />;
    }
  };

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