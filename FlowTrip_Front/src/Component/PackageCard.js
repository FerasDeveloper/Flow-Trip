import React from "react";
import { Link } from "react-router-dom";
import "./PackageCard.css";

const PackageCard = ({ id, image, title, description, price, isPointPayment }) => {
  return (
    <Link to={`/package/${id}`} className="packageComponentLink">
      <div
        className="packageComponentCard"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="packageComponentOverlay">
          <h3 className="packageComponentTitle">{title}</h3>
          <p className="packageComponentDescription">{description}</p>

          <div className="price-buttons">
            <span className="packageComponentPrice">${price}</span>
            {isPointPayment && (
              <span className="packageComponentPrice points">{price*50} Points</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
