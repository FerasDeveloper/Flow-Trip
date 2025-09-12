import { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import "./EditSeatsPrice.css";
import { useNavigate } from "react-router-dom";
import {
  baseURL,
  EDIT_SEATS,
  GET_FLIGHT_DETAILS,
  GET_SINGLE_PLANE,
  TOKEN,
} from "../Api/Api";
import Loader from "../Component/Loader";

const EditSeatsPrice = () => {
  const [planeImage, setPlaneImage] = useState();
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [newPrice, setNewPrice] = useState("");
  const token = TOKEN;
  const fetchFlightAndPlaneDetails = async () => {
    setLoading(true);
    try {
      const flightId = Cookies.get("flight_id");

      const flightResponse = await axios.get(
        `${baseURL}/${GET_FLIGHT_DETAILS}/${flightId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const planeIdFetched = flightResponse.data.flight.plane_id;
      setSeats(flightResponse.data.seats);

      const planeResponse = await axios.get(
        `${baseURL}/${GET_SINGLE_PLANE}/${planeIdFetched}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPlaneImage(planeResponse.data.image_url);
    } catch (error) {
      console.error("Error fetching details:", error);
      toast.error("Failed to load flight details");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdatePrice = async () => {
    const selectedSeatIds = seats
      .filter((seat) => selectedSeats.includes(seat.seat_number))
      .map((seat) => seat.id);

    try {
      await axios.post(
        `${baseURL}/${EDIT_SEATS}`,
        {
          seat_ids: selectedSeatIds,
          new_price: Number(newPrice),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Seats price have been updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFlightAndPlaneDetails();
  }, []);

  const [lastSelectedSeat, setLastSelectedSeat] = useState(null);

  const handleSeatClick = (seat_number, index, event) => {
    if (event.shiftKey && lastSelectedSeat !== null) {
      const startIndex = Math.min(lastSelectedSeat, index);
      const endIndex = Math.max(lastSelectedSeat, index);

      const rangeSeats = seats
        .slice(startIndex, endIndex + 1)
        .map((seat) => seat.seat_number);

      setSelectedSeats((prev) => {
        const allSelected = rangeSeats.every((s) => prev.includes(s));
        if (allSelected) {
          return prev.filter((s) => !rangeSeats.includes(s));
        } else {
          return [...new Set([...prev, ...rangeSeats])];
        }
      });
    } else {
      setSelectedSeats((prev) =>
        prev.includes(seat_number)
          ? prev.filter((number) => number !== seat_number)
          : [...prev, seat_number]
      );
      setLastSelectedSeat(index);
    }
  };
  const handleDone = () => {
    Cookies.remove("flight_id");
    window.location.pathname = "Airline/dashboard/flights";
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="seats-container">
      <div className="p-5">
        <h4 className="mb-5 mt-3">Select seats to edit their price</h4>
        <div className="row align-items-stretch">
          <div className="col-lg-7 col-md-8">
            <div className="row g-5">
              {seats &&
                seats.map((seat, index) => (
                  <div
                    key={index}
                    className="col-2 d-flex flex-column justify-content-center align-items-center"
                  >
                    <div
                      className={`seat d-flex align-items-center justify-content-center ${
                        selectedSeats.includes(seat.seat_number)
                          ? "selected"
                          : ""
                      }`}
                      onClick={(e) =>
                        handleSeatClick(seat.seat_number, index, e)
                      }
                    >
                      {seat.seat_number}
                    </div>
                    <div className="seat-price mt-2">${seat.price}</div>
                  </div>
                ))}
            </div>
          </div>
          <div className="col-lg-5 col-md-4 d-flex justify-content-center">
            {planeImage && (
              <img
                src={planeImage}
                alt="Plane"
                className="img-fluid rounded shadow plane-image"
              />
            )}
          </div>
        </div>

        <div className="mt-5">
          <strong>Selected Seats: </strong>
          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
        </div>
        <div>
          <div className="mt-3 d-flex flex-column justify-content-center align-items-center">
            <input
              type="number"
              name="price"
              className="price-input mb-3"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Enter new price"
            />
            <button
              className="update-price-button mb-3 "
              onClick={handleUpdatePrice}
              disabled={selectedSeats.length === 0 || !newPrice}
            >
              Update Price
            </button>
          </div>
          <div className="done-div">
            <button className="confirm-button" onClick={handleDone}>
              Done
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};
export default EditSeatsPrice;
