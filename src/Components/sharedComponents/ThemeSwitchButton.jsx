import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

const DarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const LightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const sizeStyles = {
  sm: {
    button: "w-14 h-7",
    toggle: "w-8 h-8",
  },
  md: {
    button: "w-16 h-8",
    toggle: "w-10 h-10",
  },
  lg: {
    button: "w-20 h-10",
    toggle: "w-12 h-12",
  },
  xl: {
    button: "w-24 h-12",
    toggle: "w-14 h-14",
  },
};

const ThemeSwitchButton = ({ size = "md" }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      className={`
        ${currentSize.button}
        rounded-full 
        bg-white 
        flex 
        items-center 
        transition 
        duration-300 
        focus:outline-none 
        shadow
      `}
      onClick={toggleTheme}
    >
      <div
        className={`
          ${currentSize.toggle}
          relative 
          rounded-full 
          transition 
          duration-500 
          transform 
          p-1 
          text-white
          ${
            isDarkMode
              ? "bg-gray-700 translate-x-full"
              : "bg-sky-300 -translate-x-2"
          }
        `}
      >
        {isDarkMode ? <DarkIcon /> : <LightIcon />}
      </div>
    </button>
  );
};

export default ThemeSwitchButton;
