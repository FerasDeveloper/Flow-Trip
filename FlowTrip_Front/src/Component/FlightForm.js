import React from "react";
import "./FlightForm.css";
import { Container, Row } from "react-bootstrap";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import Button from "./AddButton";
import dayjs from "dayjs";

const FlightForm = ({
  formData,
  setFormData,
  errors,
  planes,
  selected,
  open,
  setOpen,
  dropdownRef,
  handleSelect,
  clearErrorForField,
  btnText,
  handleSubmit,
}) => {
  return (
    <Container className="add-flight-container">
      <Row className="py-5">
        <div className="col-12 text-center">
          {btnText === "Update Flight" ? (
            <h1>Update your Flight</h1>
          ) : (
            <h1>Make your Flight</h1>
          )}{" "}
        </div>
      </Row>

      <Row className="align-items-center justify-content-center mx-5">
        <div className="col-lg-4 col-md-6 mb-4 d-flex flex-column justify-content-center align-items-center">
          <div className="custom-dropdown" ref={dropdownRef}>
            <div
              style={
                open
                  ? {
                      borderRadius: "0",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    }
                  : {}
              }
              className="custom-dropdown-toggle"
              onClick={() => setOpen(!open)}
            >
              {selected || "Select a plane"}
              <i className="fa-solid fa-caret-down dropdown-arrow"></i>
            </div>
            {open && (
              <div className="custom-dropdown-menu">
                {planes.map((plane, index) => (
                  <div
                    style={
                      index === planes.length - 1
                        ? {
                            borderBottomLeftRadius: "8px",
                            borderBottomRightRadius: "8px",
                          }
                        : {}
                    }
                    key={index}
                    className={`custom-dropdown-item text-center ${
                      selected === plane.name ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(plane)}
                  >
                    {plane.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className="text-danger mt-1 w-100 px-xxl-5 px-xl-3 px-lg-3 px-md-0 px-sm-5"
            style={{
              minHeight: "1.2em",
              visibility: errors.plane_id ? "visible" : "hidden",
            }}
          >
            {errors.plane_id || ""}
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-4 d-flex flex-column justify-content-center align-items-center custom-input-wrapper">
          <div className="d-flex justify-content-center w-100 custom-inner-wrapper">
            <label
              className={`custom-label ${formData.price ? "has-text" : ""}`}
            >
              Price
            </label>
            <div
              className="input-group custom-input-group shadow-sm rounded-3 overflow-hidden"
              style={{ maxWidth: "300px" }}
            >
              <input
                type="number"
                className="form-control border-0 custom-input"
                style={{ boxShadow: "none" }}
                required
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: e.target.value });
                  clearErrorForField("price");
                }}
              />
              <span className="input-group-text bg-light border-0 custom-span">
                <i className="fa-solid fa-dollar-sign text-secondary"></i>
              </span>
            </div>
          </div>
          <div
            className="text-danger mt-1 w-100 px-xxl-5 px-xl-3 px-lg-3 px-md-0 px-sm-5"
            style={{
              minHeight: "1.2em",
              visibility: errors.price ? "visible" : "hidden",
            }}
          >
            {errors.price || ""}
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-4 d-flex flex-column justify-content-center align-items-center custom-input-wrapper">
          <div className="d-flex justify-content-center w-100 custom-inner-wrapper">
            <label
              className={`custom-label ${
                formData.flight_number ? "has-text" : ""
              }`}
            >
              Flight number
            </label>
            <div
              className="input-group custom-input-group shadow-sm rounded-3 overflow-hidden"
              style={{ maxWidth: "300px" }}
            >
              <input
                type="text"
                className="form-control border-0 custom-input"
                style={{ boxShadow: "none" }}
                required
                value={formData.flight_number}
                onChange={(e) => {
                  setFormData({ ...formData, flight_number: e.target.value });
                  clearErrorForField("flight_number");
                }}
              />
            </div>
          </div>
          <div
            className="text-danger mt-1 w-100 px-xxl-5 px-xl-3 px-lg-3 px-md-0 px-sm-5"
            style={{
              minHeight: "1.2em",
              visibility: errors.flight_number ? "visible" : "hidden",
            }}
          >
            {errors.flight_number || ""}
          </div>
        </div>
      </Row>

      <Row className="align-items-center justify-content-center mx-5">
        <div className="col-lg-4 col-md-6 my-4 d-flex flex-column justify-content-center align-items-center custom-input-wrapper">
          <div className="d-flex justify-content-center w-100 custom-inner-wrapper">
            <label
              className={`custom-label ${
                formData.starting_point_location ? "has-text" : ""
              }`}
            >
              Flight starting point location
            </label>
            <div
              className="input-group custom-input-group shadow-sm rounded-3 overflow-hidden"
              style={{ maxWidth: "300px" }}
            >
              <input
                type="text"
                className="form-control border-0 custom-input"
                style={{ boxShadow: "none" }}
                required
                value={formData.starting_point_location}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    starting_point_location: e.target.value,
                  });
                  clearErrorForField("starting_point_location");
                }}
              />
            </div>
          </div>
          <div
            className="text-danger mt-1 w-100 px-xxl-5 px-xl-3 px-lg-3 px-md-0 px-sm-5"
            style={{
              minHeight: "1.2em",
              visibility: errors.starting_point_location ? "visible" : "hidden",
            }}
          >
            {errors.starting_point_location || ""}
          </div>
        </div>

        <div className="col-lg-4 col-md-6 my-4 d-flex flex-column justify-content-center align-items-center custom-input-wrapper">
          <div className="d-flex justify-content-center w-100 custom-inner-wrapper">
            <label
              className={`custom-label ${
                formData.landing_point_location ? "has-text" : ""
              }`}
            >
              Flight landing point location
            </label>
            <div
              className="input-group custom-input-group shadow-sm rounded-3 overflow-hidden"
              style={{ maxWidth: "300px" }}
            >
              <input
                type="text"
                className="form-control border-0 custom-input"
                style={{ boxShadow: "none" }}
                required
                value={formData.landing_point_location}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    landing_point_location: e.target.value,
                  });
                  clearErrorForField("landing_point_location");
                }}
              />
            </div>
          </div>
          <div
            className="text-danger mt-1 w-100 px-xxl-5 px-xl-3 px-lg-3 px-md-0 px-sm-5"
            style={{
              minHeight: "1.2em",
              visibility: errors.landing_point_location ? "visible" : "hidden",
            }}
          >
            {errors.landing_point_location || ""}
          </div>
        </div>

        <div className="col-lg-4 col-md-6 my-4 d-flex flex-column justify-content-center align-items-center custom-input-wrapper">
          <div className="d-flex justify-content-center w-100 custom-inner-wrapper">
            <label
              className={`custom-label ${
                formData.starting_airport ? "has-text" : ""
              }`}
            >
              Starting airport
            </label>
            <div
              className="input-group custom-input-group shadow-sm rounded-3 overflow-hidden"
              style={{ maxWidth: "300px" }}
            >
              <input
                type="text"
                className="form-control border-0 custom-input"
                style={{ boxShadow: "none" }}
                required
                value={formData.starting_airport}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    starting_airport: e.target.value,
                  });
                  clearErrorForField("starting_airport");
                }}
              />
            </div>
          </div>
          <div
            className="text-danger mt-1 w-100 px-xxl-5 px-xl-3 px-lg-3 px-md-0 px-sm-5"
            style={{
              minHeight: "1.2em",
              visibility: errors.starting_airport ? "visible" : "hidden",
            }}
          >
            {errors.starting_airport || ""}
          </div>
        </div>
      </Row>

      <Row className="align-items-center justify-content-center mx-5">
        <div className="col-lg-4 col-md-6 my-4 d-flex flex-column justify-content-center align-items-center custom-input-wrapper">
          <div className="d-flex justify-content-center w-100 custom-inner-wrapper">
            <label
              className={`custom-label ${
                formData.landing_airport ? "has-text" : ""
              }`}
            >
              Landing airport
            </label>
            <div
              className="input-group custom-input-group shadow-sm rounded-3 overflow-hidden"
              style={{ maxWidth: "300px" }}
            >
              <input
                type="text"
                className="form-control border-0 custom-input"
                style={{ boxShadow: "none" }}
                required
                value={formData.landing_airport}
                onChange={(e) => {
                  setFormData({ ...formData, landing_airport: e.target.value });
                  clearErrorForField("landing_airport");
                }}
              />
            </div>
          </div>
          <div
            className="text-danger mt-1 w-100 px-xxl-5 px-xl-3 px-lg-3 px-md-0 px-sm-5"
            style={{
              minHeight: "1.2em",
              visibility: errors.landing_airport ? "visible" : "hidden",
            }}
          >
            {errors.landing_airport || ""}
          </div>
        </div>

        <div className="col-lg-4 col-md-6 my-4 d-flex flex-column justify-content-center align-items-center custom-input-wrapper">
          <div className="d-flex justify-content-center w-100 custom-inner-wrapper">
            <label
              className={`custom-label ${
                formData.estimated_time ? "has-text" : ""
              }`}
            >
              Estimated time
            </label>
            <div
              className="input-group custom-input-group shadow-sm rounded-3 overflow-hidden"
              style={{ maxWidth: "300px" }}
            >
              <input
                type="text"
                className="form-control border-0 custom-input"
                style={{ boxShadow: "none" }}
                required
                value={formData.estimated_time}
                onChange={(e) => {
                  setFormData({ ...formData, estimated_time: e.target.value });
                  clearErrorForField("estimated_time");
                }}
              />
            </div>
          </div>
          <div
            className="text-danger mt-1 w-100 px-xxl-5 px-xl-3 px-lg-3 px-md-0 px-sm-5"
            style={{
              minHeight: "1.2em",
              visibility: errors.estimated_time ? "visible" : "hidden",
            }}
          >
            {errors.estimated_time || ""}
          </div>
        </div>

        <div className="col-lg-4 col-md-6 d-flex flex-column justify-content-center align-items-center my-4 custom-input-wrapper">
          <div className="d-flex justify-content-center w-100 custom-inner-wrapper">
            <label className="custom-date-label">Date</label>
            <div
              className="input-group custom-input-group shadow-sm rounded-3 overflow-hidden"
              style={{ maxWidth: "300px" }}
            >
              <input
                type="date"
                className="form-control border-0 custom-input"
                style={{ boxShadow: "none" }}
                required
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  clearErrorForField("date");
                }}
              />
            </div>
          </div>
          <div
            className="text-danger mt-1 w-100 px-xxl-5 px-xl-3 px-lg-3 px-md-0 px-sm-5"
            style={{
              minHeight: "1.2em",
              visibility: errors.date ? "visible" : "hidden",
            }}
          >
            {errors.date || ""}
          </div>
        </div>
      </Row>

      <Row className="align-items-center justify-content-center mx-5">
        <div className="col-lg-6 col-md-6 my-4 d-flex justify-content-center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ width: "100%", maxWidth: "300px" }}>
              <TimePicker
                label="Start time"
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                value={
                  formData.start_time
                    ? dayjs(formData.start_time, "HH:mm")
                    : null
                }
                onChange={(newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    start_time: newValue ? newValue.format("HH:mm") : "",
                  }));
                  clearErrorForField("start_time");
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      sx: {
                        height: 40,
                        "& .MuiInputBase-input": {
                          padding: "0 14px",
                          display: "flex",
                          alignItems: "center",
                          height: "100%",
                          lineHeight: 1,
                        },
                      },
                    },
                    sx: {
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      borderRadius: "8px",
                      "& .MuiInputBase-root": { height: 40 },
                      "& label": {
                        fontSize: { xs: "10px", sm: "16px" },
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translate(0, -50%)",
                        transition:
                          "all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        "&.Mui-focused, &.MuiInputLabel-shrink": {
                          top: "0",
                          transform: "translate(0px, -8px) scale(0.75)",
                        },
                      },
                    },
                  },
                }}
              />
              <div
                className="text-danger mt-1 w-100"
                style={{
                  minHeight: "1.2em",
                  visibility: errors.start_time ? "visible" : "hidden",
                }}
              >
                {errors.start_time || ""}
              </div>
            </div>
          </LocalizationProvider>
        </div>

        <div className="col-lg-6 col-md-6 d-flex justify-content-center my-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div
              className="custom-inner-wrapper"
              style={{ width: "100%", maxWidth: "300px" }}
            >
              <TimePicker
                label="Land time"
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                value={
                  formData.land_time ? dayjs(formData.land_time, "HH:mm") : null
                }
                onChange={(newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    land_time: newValue ? newValue.format("HH:mm") : "",
                  }));
                  clearErrorForField("land_time");
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      sx: {
                        height: 40,
                        "& .MuiInputBase-input": {
                          padding: "0 14px",
                          display: "flex",
                          alignItems: "center",
                          height: "100%",
                          lineHeight: 1,
                        },
                      },
                    },
                    sx: {
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      borderRadius: "8px",
                      "& .MuiInputBase-root": { height: 40 },
                      "& label": {
                        fontSize: { xs: "10px", sm: "16px" },
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translate(0, -50%)",
                        transition:
                          "all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        "&.Mui-focused, &.MuiInputLabel-shrink": {
                          top: "0",
                          transform: "translate(0px, -8px) scale(0.75)",
                        },
                      },
                    },
                  },
                }}
              />
              <div
                className="text-danger mt-1 w-100"
                style={{
                  minHeight: "1.2em",
                  visibility: errors.land_time ? "visible" : "hidden",
                }}
              >
                {errors.land_time || ""}
              </div>
            </div>
          </LocalizationProvider>
        </div>
        {formData.hasOwnProperty("offer_price") && (
          <div className="col-lg-4 col-md-6 mb-4 d-flex flex-column justify-content-center align-items-center custom-input-wrapper">
            <div className="d-flex justify-content-center w-100 custom-inner-wrapper">
              <label
                className={`custom-label ${
                  formData.offer_price || formData.offer_price===0 ? "has-text" : ""
                }`}
              >
                Offer price
              </label>
              <div
                className="input-group custom-input-group shadow-sm rounded-3 overflow-hidden"
                style={{ maxWidth: "300px" }}
              >
                <input
                  type="number"
                  className="form-control border-0 custom-input"
                  style={{ boxShadow: "none" }}
                  required
                  value={formData.offer_price}
                  onChange={(e) => {
                    setFormData({ ...formData, offer_price: e.target.value });
                  }}
                />
                <span className="input-group-text bg-light border-0 custom-span">
                  <i className="fa-solid fa-dollar-sign text-secondary"></i>
                </span>
              </div>
            </div>
          </div>
        )}
      </Row>
      <Row>
        <div className="col-12 d-flex justify-content-center align-items-center mt-3">
          <Button text={btnText} onClick={handleSubmit}></Button>
        </div>
      </Row>
    </Container>
  );
};
export default FlightForm;
