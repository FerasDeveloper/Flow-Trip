import React from "react";
import styled from "styled-components";

const PaymentButton = ({
  onPayment,
  formData,
  cardData,
  checkInDate,
  checkOutDate,
  accommodation,
  type,
}) => {
  const handlePaymentClick = () => {
    if (onPayment) {
      if (
        !cardData ||
        !cardData.cardNumber ||
        !cardData.cvv ||
        !cardData.expiry
      ) {
        alert("Please fill in all card details");
        return;
      }

      const paymentData = {
        stripeToken: "tok_visa",
        amount: accommodation?.price || 100,
        bookingData: {
          ...formData,
          checkInDate: checkInDate
            ? checkInDate.toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          checkOutDate: checkOutDate
            ? checkOutDate.toISOString().split("T")[0]
            : new Date(Date.now() + 86400000).toISOString().split("T")[0],
        },
        cardInfo: {
          lastFour: cardData.cardNumber.replace(/\s/g, "").slice(-4),
          holderName: cardData.holderName,
        },
        timestamp: new Date().toISOString(),
      };
      const paymentData2 = {
        stripeToken: "tok_visa",
        ...formData,
      };
      type === "room" || type === "other"
        ? onPayment(paymentData)
        : onPayment(paymentData2);
    }
  };
  return (
    <StyledWrapper>
      <div className="pay-btn-container" onClick={handlePaymentClick}>
        <div className="pay-btn-left-side">
          <div className="pay-btn-card">
            <div className="pay-btn-card-line" />
            <div className="pay-btn-buttons" />
          </div>
          <div className="pay-btn-post">
            <div className="pay-btn-post-line" />
            <div className="pay-btn-screen">
              <div className="pay-btn-dollar">$</div>
            </div>
            <div className="pay-btn-numbers" />
            <div className="pay-btn-numbers-line2" />
          </div>
        </div>
        <div className="pay-btn-right-side">
          <div className="pay-btn-new">Book Now</div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .pay-btn-container {
    background-color: #ffffff;
    display: flex;
    width: 260px;
    height: 120px;
    position: relative;
    border-radius: 6px;
    transition: 0.3s ease-in-out;
    transform: scale(0.71, 0.6);
  }

  .pay-btn-container:hover {
    transform: scale(0.8, 0.7);
  }

  .pay-btn-container:hover .pay-btn-left-side {
    width: 100%;
  }

  .pay-btn-left-side {
    background-color: #5de2a3;
    width: 130px;
    height: 120px;
    border-radius: 4px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.3s;
    flex-shrink: 0;
    overflow: hidden;
  }

  .pay-btn-right-side {
    display: flex;
    align-items: center;
    overflow: hidden;
    cursor: pointer;
    justify-content: space-between;
    white-space: nowrap;
    transition: 0.3s;
  }

  .pay-btn-right-side:hover {
    background-color: #f9f7f9;
  }

  .pay-btn-arrow {
    width: 20px;
    height: 20px;
    margin-right: 20px;
  }

  .pay-btn-new {
    font-size: 23px;
    font-family: "Lexend Deca", sans-serif;
    margin-left: 20px;
  }

  .pay-btn-card {
    width: 70px;
    height: 46px;
    background-color: #c7ffbc;
    border-radius: 6px;
    position: absolute;
    display: flex;
    z-index: 10;
    flex-direction: column;
    align-items: center;
    -webkit-box-shadow: 9px 9px 9px -2px rgba(77, 200, 143, 0.72);
    -moz-box-shadow: 9px 9px 9px -2px rgba(77, 200, 143, 0.72);
    -webkit-box-shadow: 9px 9px 9px -2px rgba(77, 200, 143, 0.72);
  }

  .pay-btn-card-line {
    width: 65px;
    height: 13px;
    background-color: #80ea69;
    border-radius: 2px;
    margin-top: 7px;
  }

  @media only screen and (max-width: 480px) {
    .pay-btn-container {
      transform: scale(0.7);
    }

    .pay-btn-container:hover {
      transform: scale(0.74);
    }

    .pay-btn-new {
      font-size: 18px;
    }
  }

  .pay-btn-buttons {
    width: 8px;
    height: 8px;
    background-color: #379e1f;
    box-shadow: 0 -10px 0 0 #26850e, 0 10px 0 0 #56be3e;
    border-radius: 50%;
    margin-top: 5px;
    transform: rotate(90deg);
    margin: 10px 0 0 -30px;
  }

  .pay-btn-container:hover .pay-btn-card {
    animation: slide-top 1.2s cubic-bezier(0.645, 0.045, 0.355, 1) both;
  }

  .pay-btn-container:hover .pay-btn-post {
    animation: slide-post 1s cubic-bezier(0.165, 0.84, 0.44, 1) both;
  }

  @keyframes slide-top {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }

    50% {
      -webkit-transform: translateY(-70px) rotate(90deg);
      transform: translateY(-70px) rotate(90deg);
    }

    60% {
      -webkit-transform: translateY(-70px) rotate(90deg);
      transform: translateY(-70px) rotate(90deg);
    }

    100% {
      -webkit-transform: translateY(-8px) rotate(90deg);
      transform: translateY(-8px) rotate(90deg);
    }
  }

  .pay-btn-post {
    width: 63px;
    height: 75px;
    background-color: #dddde0;
    position: absolute;
    z-index: 11;
    bottom: 10px;
    top: 120px;
    border-radius: 6px;
    overflow: hidden;
  }

  .pay-btn-post-line {
    width: 47px;
    height: 9px;
    background-color: #545354;
    position: absolute;
    border-radius: 0px 0px 3px 3px;
    right: 8px;
    top: 8px;
  }

  .pay-btn-post-line:before {
    content: "";
    position: absolute;
    width: 47px;
    height: 9px;
    background-color: #757375;
    top: -8px;
  }

  .pay-btn-screen {
    width: 47px;
    height: 23px;
    background-color: #ffffff;
    position: absolute;
    top: 22px;
    right: 8px;
    border-radius: 3px;
  }

  .pay-btn-numbers {
    width: 12px;
    height: 12px;
    background-color: #838183;
    box-shadow: 0 -18px 0 0 #838183, 0 18px 0 0 #838183;
    border-radius: 2px;
    position: absolute;
    transform: rotate(90deg);
    left: 25px;
    top: 52px;
  }

  .pay-btn-numbers-line2 {
    width: 12px;
    height: 12px;
    background-color: #aaa9ab;
    box-shadow: 0 -18px 0 0 #aaa9ab, 0 18px 0 0 #aaa9ab;
    border-radius: 2px;
    position: absolute;
    transform: rotate(90deg);
    left: 25px;
    top: 68px;
  }

  @keyframes slide-post {
    50% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }

    100% {
      -webkit-transform: translateY(-70px);
      transform: translateY(-70px);
    }
  }

  .pay-btn-dollar {
    position: absolute;
    font-size: 16px;
    font-family: "Lexend Deca", sans-serif;
    width: 100%;
    left: 0;
    top: 0;
    color: #4b953b;
    text-align: center;
  }

  .pay-btn-container:hover .pay-btn-dollar {
    animation: fade-in-fwd 0.3s 1s backwards;
  }

  @keyframes fade-in-fwd {
    0% {
      opacity: 0;
      transform: translateY(-5px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default PaymentButton;
