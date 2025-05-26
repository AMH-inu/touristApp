import React, { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  }); // 다크 모드 상태를 로컬 스토리지에서 가져옴

  useEffect(() => {
    if (darkMode) { // 다크 모드
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else { // 라이트 모드
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]); // 다크/라이트 모드 상태를 변경하려고 하는 경우마다 재설정

  return (
    <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? "☀️ 라이트 모드" : "🌙 다크 모드"}
    </button>
  );
};

export default DarkModeToggle;