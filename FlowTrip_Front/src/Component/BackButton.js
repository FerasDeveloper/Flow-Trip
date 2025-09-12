import React from "react";
import './BackButton.css'

const BackButton = ({ onClick}) => {
  return (
    <button className="cta" onClick={onClick}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 12H5M12 19L5 12L12 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="hover-underline-animation">Back</span>
    </button>
  );
};

export default BackButton;
