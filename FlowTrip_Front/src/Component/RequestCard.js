import React from "react";
import "./RequestCard.css";

const RequestCard = ({ id, businessName, ownerCategory, description }) => {
  const handleClick = () => {
    window.location.href = `/request/${id}`;
  };

  return (
    <div className="request-card" onClick={handleClick}>
      <h2 className="business-name">{businessName}</h2>
      <p className="owner-category">Owner category: {ownerCategory}</p>
      <p className="description">{description}</p>
    </div>
  );
};

export default RequestCard;
