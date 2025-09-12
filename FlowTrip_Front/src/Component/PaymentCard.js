import React, { useState } from 'react';
import styled from 'styled-components';

const PaymentCard = ({ cardData, setCardData }) => {

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date as MM/YY
  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Handle card number input
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardData(prev => ({ ...prev, cardNumber: formatted }));
    }
  };

  // Handle expiry input
  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.replace(/\D/g, '').length <= 4) {
      setCardData(prev => ({ ...prev, expiry: formatted }));
    }
  };

  // Handle CVV input
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCardData(prev => ({ ...prev, cvv: value }));
    }
  };

  // Handle name input
  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setCardData(prev => ({ ...prev, holderName: value.toUpperCase() }));
  };

  return (
    <StyledWrapper style={{display:'flex', justifyContent:'center'}}>
      <div className="visa-card">
        <div className="logoContainer">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={23} height={23} viewBox="0 0 48 48" className="svgLogo">
            <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z" />
            <path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z" />
            <path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z" />
          </svg>
        </div>
        <div className="number-container">
          <label className="input-label" htmlFor="cardNumber">CARD NUMBER</label>
          <input 
            className="inputstyle" 
            id="cardNumber" 
            placeholder="XXXX XXXX XXXX XXXX" 
            name="cardNumber" 
            type="text" 
            value={cardData.cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
          />
        </div>
        <div className="name-date-cvv-container">
          <div className="name-wrapper">
            <label className="input-label" htmlFor="holderName">CARD HOLDER</label>
            <input 
              className="inputstyle" 
              id="holderName" 
              placeholder="NAME" 
              type="text" 
              value={cardData.holderName}
              onChange={handleNameChange}
              maxLength={25}
            />
          </div>
          <div className="expiry-wrapper">
            <label className="input-label" htmlFor="expiry">VALID THRU</label>
            <input 
              className="inputstyle" 
              id="expiry" 
              placeholder="MM/YY" 
              type="text" 
              value={cardData.expiry}
              onChange={handleExpiryChange}
              maxLength={5}
            />
          </div>
          <div className="cvv-wrapper">
            <label className="input-label" htmlFor="cvv">CVV</label>
            <input 
              className="inputstyle" 
              placeholder="***" 
              maxLength={3} 
              id="cvv" 
              type="password" 
              value={cardData.cvv}
              onChange={handleCvvChange}
            />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  
  .visa-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    width: 300px;
    height: 180px;
    background-image: radial-gradient(
      circle 897px at 9% 80.3%,
      var(--color1) 0%,
      var(--color4) 100.2%
    );
    border-radius: 10px;
    padding: 20px;
    font-family: Arial, Helvetica, sans-serif;
    position: relative;
    gap: 15px;
  }
  .logoContainer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: fit-content;
    position: absolute;
    top: 0;
    left: 0;
    padding: 18px;
  }
  .svgLogo {
    height: 40px;
    width: auto;
  }
  .inputstyle::placeholder {
    color: var(--color7);
  }
  .inputstyle {
    background-color: transparent;
    border: none;
    outline: none;
    color: white;
    caret-color: red;
    font-size: 13px;
    height: 25px;
    letter-spacing: 1.5px;
  }
  .number-container {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
  }
  #cardNumber {
    width: 100%;
    height: 25px;
  }
  .name-date-cvv-container {
    width: 100%;
    height: 25px;
    display: flex;
    gap: 10px;
  }
  .name-wrapper {
    width: 60%;
    height: fit-content;
    display: flex;
    flex-direction: column;
  }
  .expiry-wrapper,
  .cvv-wrapper {
    width: 30%;
    height: fit-content;
    display: flex;
    flex-direction: column;
  }
  .cvv-wrapper {
    width: 10%;
  }
  #expiry,
  #cvv {
    width: 100%;
  }
  .input-label {
    font-size: 8px;
    letter-spacing: 1.5px;
    color: var(--color8);
    width: 100%;
  }`;

export default PaymentCard;
