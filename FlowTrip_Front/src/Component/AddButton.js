import React from "react";
import "./AddButton.css";

const Button = ({ text = "Add Item", onClick }) => {
  return (
    <div>
      <button type="button" className="addbuttoncomponent" onClick={onClick}>
        <span className="addbuttoncomponent__text">{text}</span>
        <span className="addbuttoncomponent__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            className="addbuttoncomponent__svg"
          >
            <line y1="5" y2="19" x1="12" x2="12" />
            <line y1="12" y2="12" x1="5" x2="19" />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default Button;
