import React, { useState } from "react";
import "./RecordPackageCard.css";
import { useNavigate } from "react-router-dom";

function RecordPackageCard({
  id,
  image,
  description,
  totalPrice,
  paymentByPoints,
  variant = "holo",
}) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [mousePos, setMousePos] = useState({ mx: "50%", my: "50%" });
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    if (variant !== "holo") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 2 - 1; // -1 .. 1
    const py = (y / rect.height) * 2 - 1; // -1 .. 1
    const maxDeg = 8;
    const ry = px * maxDeg; // rotateY by horizontal
    const rx = -py * maxDeg; // rotateX by vertical (invert)
    setTilt({ rx, ry });
    setMousePos({ mx: `${(x / rect.width) * 100}%`, my: `${(y / rect.height) * 100}%` });
  };

  const handleMouseLeave = () => {
    if (variant !== "holo") return;
    setTilt({ rx: 0, ry: 0 });
    setMousePos({ mx: "50%", my: "50%" });
  };

  return (
    <div
      className={`recordPackageCard variant-${variant}`}
      title={description}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/TourismCompany/dashboard/records/${id}`)}
      style={
        variant === "holo"
          ? {
              transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              "--mx": mousePos.mx,
              "--my": mousePos.my,
            }
          : undefined
      }
    >
      <div
        className="recordPackageCardImage"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="recordPackageCardBadge">#{id}</div>
        <div className="recordPackageCardOverlay">
          <p className="recordPackageCardDescription">{description}</p>
          <div className="recordPackageCardFooter">
            <span className="price">${totalPrice}</span>
            {paymentByPoints === 1 && (
              <span className="points">{totalPrice} Points</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordPackageCard;

