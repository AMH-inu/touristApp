import SearchBox from './components/SearchBox';
import DetailView from './components/DetailView';
import Title from "./components/Title";
import DarkModeToggle from "./components/DarkModeToggle";
import { useState } from 'react';
import './App.css';

function App() {
  const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 관광지를 저장하기 위한 상태

  const renderContent = () => {
    if (selectedPlace) {
      return <DetailView place={selectedPlace} onBack={() => setSelectedPlace(null)} />;
    } else {
      return <SearchBox onSelectPlace={setSelectedPlace} />;
    }
  }; // 조건에 따라 SearchBox 또는 DetailView 컴포넌트를 렌더링

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