import React from 'react';
import styled from 'styled-components';

const closeButton = () => {
  return (
    <StyledWrapper>
      <button className="closeButton">
        <span className="X" />
        <span className="Y" />
        <div className="close">Close</div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .closeButton {
    position: absolute;
    width: 3em;
    height: 3em;
    border: none;
    background: rgba(180, 83, 107, 0.11);
    border-radius: 5px;
    transition: background 0.5s;
    transform: translateY(-13px)
  }

  .X {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2em;
    height: 1.5px;
    background-color: rgb(255, 255, 255);
    transform: translateX(-50%) rotate(45deg);
  }

  .Y {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2em;
    height: 1.5px;
    background-color: #fff;
    transform: translateX(-50%) rotate(-45deg);
  }

  .close {
    position: absolute;
    display: flex;
    padding: 0.8rem 1.5rem;
    align-items: center;
    justify-content: center;
    transform: translateX(-50%);
    top: -70%;
    left: 50%;
    width: 3em;
    height: 1.7em;
    font-size: 12px;
    background-color: rgb(19, 22, 24);
    color: rgb(187, 229, 236);
    border: none;
    border-radius: 3px;
    pointer-events: none;
    opacity: 0;
  }

  .closeButton:hover {
    background-color: rgb(211, 21, 21);
  }

  .closeButton:active {
    background-color: rgb(130, 0, 0);
  }

  .closeButton:hover > .close {
    animation: close 0.2s forwards 0.25s;
  }

  @keyframes close {
    100% {
      opacity: 1;
    }
  }`;

export default closeButton;
