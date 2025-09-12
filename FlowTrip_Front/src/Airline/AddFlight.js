import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import FlightForm from "../Component/FlightForm";
import { ADD_FLIGHT, baseURL, GET_ALL_PLANES, TOKEN } from "../Api/Api";
import Loader from "../Component/Loader";
import dayjs from "dayjs";

const AddFlight = () => {
  const token = TOKEN;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    price: "",
    flight_number: "",
    starting_point_location: "",
    landing_point_location: "",
    starting_airport: "",
    landing_airport: "",
    estimated_time: "",
    date: "",
    start_time: null,
    land_time: null,
    plane_id: null,
  });
  const [selected, setSelected] = useState("");
  const [planes, setPlanes] = useState([]);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchPlanes = () => {
    setLoading(true);

    axios
      .get(`${baseURL}/${GET_ALL_PLANES}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetched = response.data.planes.map((plane) => ({
          id: plane.plane.id,
          name: plane.plane_type,
        }));
        setPlanes(fetched);
      })
      .catch((error) => {
        console.error("Error fetching planes:", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlanes();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (plane) => {
    setSelected(plane.name);
    setFormData((prev) => ({ ...prev, plane_id: plane.id }));
    clearErrorForField("plane_id");
    setOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const isEmptyOrSpaces = (str) => !str || str.trim() === "";

    let newErrors = {};

    if (isEmptyOrSpaces(formData.price)) newErrors.price = "Price is required.";
    if (isEmptyOrSpaces(formData.flight_number))
      newErrors.flight_number = "Flight number is required.";
    if (isEmptyOrSpaces(formData.starting_point_location))
      newErrors.starting_point_location =
        "Starting point location is required.";
    if (isEmptyOrSpaces(formData.landing_point_location))
      newErrors.landing_point_location = "Landing point location is required.";
    if (isEmptyOrSpaces(formData.starting_airport))
      newErrors.starting_airport = "Starting airport is required.";
    if (isEmptyOrSpaces(formData.landing_airport))
      newErrors.landing_airport = "Landing airport is required.";
    if (isEmptyOrSpaces(formData.estimated_time))
      newErrors.estimated_time = "Estimated time is required.";
    if (isEmptyOrSpaces(formData.date)) newErrors.date = "Date is required.";

    if (!formData.plane_id) newErrors.plane_id = "Please select a plane.";
    if (!formData.start_time) newErrors.start_time = "Start time is required.";
    if (!formData.land_time) newErrors.land_time = "Land time is required.";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setLoading(true);
   axios
      .post(`${baseURL}/${ADD_FLIGHT}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        Cookies.set("flight_id", response.data.flight_id);
        toast.success("Flight has been added successfully");
        setTimeout(() => {
          navigate("/editSeats");
        }, 3000);
      })
      .catch(() => {toast.error("Somthing went wrong")}
    
    )
      .finally(() => {
        setLoading(false);
      });
  };

  const clearErrorForField = (field) => {
    setErrors((prevErrors) => {
      const { [field]: removed, ...rest } = prevErrors;
      return rest;
    });
  };
  if (loading) return <Loader />;

  return (
    <>
      <FlightForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        planes={planes}
        clearErrorForField={clearErrorForField}
        dropdownRef={dropdownRef}
        handleSelect={handleSelect}
        open={open}
        selected={selected}
        setOpen={setOpen}
        btnText="Add a flight"
        handleSubmit={handleSubmit}
      />
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
    </>
  );
};
export default AddFlight;
