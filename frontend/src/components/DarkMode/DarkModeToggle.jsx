// import
import React, { useEffect, useState } from "react"; // React 라이브러리 및 Hook

// 다크 모드 토글 컴포넌트 : 다크 모드와 라이트 모드를 토글할 수 있는 버튼
const DarkModeToggle = () => {

  // useState Hook
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  }); // 다크 모드 상태 (매 실행 시마다 로컬 스토리지에서 자동으로 불러옴)

  // useEffect Hook
  // useEffect 1) 다크 모드 상태가 변경될 때마다 body 클래스 및 로컬 스토리지 업데이트
  useEffect(() => {
    if (darkMode) { // 다크 모드
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else { // 라이트 모드
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // return : 컴포넌트 HTML 렌더링
  return (
    <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? "☀️ 라이트 모드" : "🌙 다크 모드"}
    </button>
  );
};

export default DarkModeToggle;