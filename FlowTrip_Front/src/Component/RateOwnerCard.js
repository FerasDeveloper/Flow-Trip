import React from "react";
import "./RateOwnerCard.css";

export default function RateOwnerCard({ onChange }) {
  return (
    <div className="rateowner-radio">
      <input value="5" name="rateowner-rating" type="radio" id="rateowner-rating-1" onChange={onChange} />
      <label title="5 star" htmlFor="rateowner-rating-1">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
          <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 
          150.3 51.4 171.5c-12 1.8-22 10.2-25.7 
          21.7s-.7 24.2 7.9 32.7L137.8 329 
          113.2 474.7c-2 12 3 24.2 12.9 
          31.3s23 8 33.8 2.3l128.3-68.5 
          128.3 68.5c10.8 5.7 23.9 4.9 
          33.8-2.3s14.9-19.3 12.9-31.3L438.5 
          329 542.7 225.9c8.6-8.5 11.7-21.2 
          7.9-32.7s-13.7-19.9-25.7-21.7L381.2 
          150.3 316.9 18z"></path>
        </svg>
      </label>

      <input value="4" name="rateowner-rating" type="radio" id="rateowner-rating-2" onChange={onChange} />
      <label title="4 stars" htmlFor="rateowner-rating-2">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
          <path d="M316.9 18C311.6 7 300.4 0 288.1 
          0s-23.4 7-28.8 18L195 150.3 51.4 
          171.5c-12 1.8-22 10.2-25.7 
          21.7s-.7 24.2 7.9 32.7L137.8 
          329 113.2 474.7c-2 12 3 24.2 
          12.9 31.3s23 8 33.8 2.3l128.3-68.5 
          128.3 68.5c10.8 5.7 23.9 4.9 
          33.8-2.3s14.9-19.3 12.9-31.3L438.5 
          329 542.7 225.9c8.6-8.5 11.7-21.2 
          7.9-32.7s-13.7-19.9-25.7-21.7L381.2 
          150.3 316.9 18z"></path>
        </svg>
      </label>

      <input value="3" name="rateowner-rating" type="radio" id="rateowner-rating-3" onChange={onChange} />
      <label title="3 stars" htmlFor="rateowner-rating-3">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
          <path d="M316.9 18C311.6 7 300.4 0 288.1 
          0s-23.4 7-28.8 18L195 150.3 51.4 
          171.5c-12 1.8-22 10.2-25.7 
          21.7s-.7 24.2 7.9 32.7L137.8 
          329 113.2 474.7c-2 12 3 24.2 
          12.9 31.3s23 8 33.8 2.3l128.3-68.5 
          128.3 68.5c10.8 5.7 23.9 4.9 
          33.8-2.3s14.9-19.3 12.9-31.3L438.5 
          329 542.7 225.9c8.6-8.5 11.7-21.2 
          7.9-32.7s-13.7-19.9-25.7-21.7L381.2 
          150.3 316.9 18z"></path>
        </svg>
      </label>

      <input value="2" name="rateowner-rating" type="radio" id="rateowner-rating-4" onChange={onChange} />
      <label title="2 stars" htmlFor="rateowner-rating-4">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
          <path d="M316.9 18C311.6 7 300.4 0 288.1 
          0s-23.4 7-28.8 18L195 150.3 51.4 
          171.5c-12 1.8-22 10.2-25.7 
          21.7s-.7 24.2 7.9 32.7L137.8 
          329 113.2 474.7c-2 12 3 24.2 
          12.9 31.3s23 8 33.8 2.3l128.3-68.5 
          128.3 68.5c10.8 5.7 23.9 4.9 
          33.8-2.3s14.9-19.3 12.9-31.3L438.5 
          329 542.7 225.9c8.6-8.5 11.7-21.2 
          7.9-32.7s-13.7-19.9-25.7-21.7L381.2 
          150.3 316.9 18z"></path>
        </svg>
      </label>

      <input value="1" name="rateowner-rating" type="radio" id="rateowner-rating-5" onChange={onChange} />
      <label title="1 stars" htmlFor="rateowner-rating-5">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
          <path d="M316.9 18C311.6 7 300.4 0 288.1 
          0s-23.4 7-28.8 18L195 150.3 51.4 
          171.5c-12 1.8-22 10.2-25.7 
          21.7s-.7 24.2 7.9 32.7L137.8 
          329 113.2 474.7c-2 12 3 24.2 
          12.9 31.3s23 8 33.8 2.3l128.3-68.5 
          128.3 68.5c10.8 5.7 23.9 4.9 
          33.8-2.3s14.9-19.3 12.9-31.3L438.5 
          329 542.7 225.9c8.6-8.5 11.7-21.2 
          7.9-32.7s-13.7-19.9-25.7-21.7L381.2 
          150.3 316.9 18z"></path>
        </svg>
      </label>
    </div>
  );
}