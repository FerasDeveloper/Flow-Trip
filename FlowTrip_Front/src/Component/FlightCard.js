  import "./FlightCard.css"
  const FlightCard = ({
    id,
    flightNumber,
    price,
    offerPrice,
    from,
    to,
    date,
  }) => {
    const handleClick = () => {
      window.location.href = `/flight/${id}`;
    };

    return (
      <div className="request-card d-flex h-100 row gx-2" onClick={handleClick}>
        <div className="col-lg-12 col-md-12 col-sm-12 col-12">
          <h6 className="mb-3 responsive-heading">
            Flight Number: {flightNumber}
          </h6>

          <p className="responsive-font">From: {from}</p>
          <p className="responsive-font">To: {to}</p>
          <p className="responsive-font">Date: {date}</p>

          <div className="price">
            {offerPrice > 0 ? (
              <>
                <span style={{ textDecoration: "line-through", color: "red" }}>
                  ${price}
                </span>
                <span style={{ fontWeight: "bold", color:"green" }}>${offerPrice}</span>
              </>
            ) : (
              <span style={{ fontWeight: "bold" }}>${price}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default FlightCard;
