import React from "react";
import "./ConfirmDialog.css";

const ConfirmDialog = ({ message, onConfirm, onCancel, color }) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <h2 className="confirm-title">Confirm Action</h2>
        <p className="confirm-message">{message}</p>
        <div className="confirm-buttons">
          <button
            className="confirm-ok"
            style={{ backgroundColor: color === "true" ? "var(--color2)" : "red" }}
            onClick={onConfirm}
          >
            Yes
          </button>
          <button className="confirm-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
