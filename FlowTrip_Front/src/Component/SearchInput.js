import React, { useState } from "react";
import "./SearchInput.css";

const SearchInput = ({ value, onChange, onSearch, placeholder = "search.." }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(value);
    }
  };

  return (
    <div className={`input-wrapper ${(isFocused || value.trim()) ? 'has-content' : ''}`}>
      <button
        className="icon"
        type="button"
        onClick={() => onSearch(value)}
        tabIndex={-1}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25px" width="25px">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" stroke="#fff" d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"></path>
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" stroke="#fff" d="M22 22L20 20"></path>
        </svg>
      </button>
      <input
        placeholder={placeholder}
        className="input"
        name="text"
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default SearchInput; 