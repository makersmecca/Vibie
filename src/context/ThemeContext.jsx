import { doc } from "firebase/firestore";
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("isDarkmode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Update meta tags for PWA
  const themeColor = isDarkMode ? "#000000" : "#ffffff";
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", themeColor);
  document
    .querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    .setAttribute("content", themeColor);

  useEffect(() => {
    localStorage.setItem("isDarkmode", JSON.stringify(isDarkMode));
    //data-theme attribute to the document root
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#000";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#fff";
    }

    // Update meta tags for PWA
    const themeColor = isDarkMode ? "#000000" : "#ffffff";
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", themeColor);
    document
      .querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
      .setAttribute("content", themeColor);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook for using the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
