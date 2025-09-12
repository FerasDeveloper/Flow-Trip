import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast, Bounce } from "react-toastify";
import FlightForm from "../Component/FlightForm";
import customParseFormat from "dayjs/plugin/customParseFormat";

import {
  baseURL,
  EDIT_FLIGHT,
  GET_ALL_PLANES,
  GET_FLIGHT_DETAILS,
  TOKEN,
} from "../Api/Api";
import Loader from "../Component/Loader";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);
const EditFlight = () => {
  const id = Cookies.get("flight_id");
  const token = TOKEN;
  const [loading, setLoading] = useState(true);
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
    offer_price: "",
  });

  const [selected, setSelected] = useState("");
  const [planes, setPlanes] = useState([]);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const res = await axios.get(`${baseURL}/${GET_ALL_PLANES}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const planeOptions = res.data.planes.map((p) => ({
          id: p.plane.id,
          name: p.plane_type,
        }));
        setPlanes(planeOptions);
      } catch (err) {
        console.error("Error fetching planes:", err);
      }
    };
    fetchPlanes();
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (!planes.length) return; 

    setLoading(true);
    axios
      .get(`${baseURL}/${GET_FLIGHT_DETAILS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (isMounted) {
          const data = res.data.flight;

          setFormData({
            price: data.price,
            flight_number: data.flight_number,
            starting_point_location: data.starting_point_location,
            landing_point_location: data.landing_point_location,
            starting_airport: data.starting_airport,
            landing_airport: data.landing_airport,
            estimated_time: data.estimated_time,
            date: data.date,
            start_time: dayjs(data.start_time, "HH:mm"),
            land_time: dayjs(data.land_time, "HH:mm"),
            plane_id: data.plane_id,
            offer_price: data.offer_price,
          });

          const selectedPlane = planes.find((p) => p.id === data.plane_id);
          if (selectedPlane) {
            setSelected(selectedPlane.name);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch flight details", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [planes]); 

  const handleSelect = (plane) => {
    setSelected(plane.name);
    setFormData((prev) => ({ ...prev, plane_id: plane.id }));
    clearErrorForField("plane_id");
    setOpen(false);
  };

  const clearErrorForField = (field) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    const isEmptyOrSpaces = (str) => !str || str.trim?.() === "";

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
      toast.error("Please fix form errors");
      return;
    }
    setLoading(true);
    axios
      .post(`${baseURL}/${EDIT_FLIGHT}/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Flight updated successfully!");
        Cookies.remove("flight_id");
        setTimeout(() => {
          window.location.pathname = "Airline/dashboard/flights";
        }, 3000);
      })
      .catch(() => {
        toast.error("Failed to update flight");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (loading) {
    return <Loader />;
  }
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
        btnText="Update Flight"
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

export default EditFlight;
