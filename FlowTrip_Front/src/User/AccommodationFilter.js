import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../Admin/OwnerSearch.css";
import "./AccommodationFilter.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SaveButton from "../Component/SaveButton";
import fallbackImage from "../Assets/AccommodationImagejpg.jpg";
import {
  baseURL,
  FILTER_ACCOMMODATION,
  GET_ALL_COUNTRIES,
  GET_ALL_ACCOMMODATION_TYPES,
  GET_ALL_ACCOMMODATION,
} from "../Api/Api";
import { useNavigate } from "react-router-dom";
import Loader from "../Component/Loader";

export default function AccommodationFilter() {
  const [countries, setCountries] = useState([]);
  const [types, setTypes] = useState([]);
  const [placeName, setPlaceName] = useState("");
  const [region, setRegion] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedTypeName, setSelectedTypeName] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [guests, setGuests] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [dateSelected, setDateSelected] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempDateRange, setTempDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [tempDateSelected, setTempDateSelected] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastSearchTypeName, setLastSearchTypeName] = useState(null);
  const navigate = useNavigate();

  const getImageUrl = (path) => {
    const apiHost = baseURL.replace(/\/api\/?$/, "");
    if (!path) return fallbackImage;
    if (/^https?:\/\//i.test(path)) return path;
    return `${apiHost}/${path}`;
  };

  // Price renderer with offer handling
  const Price = ({ price, offer }) => {
    const hasOffer = offer !== "" && Number(offer) !== 0;
    return (
      <div className="acc-price">
        {hasOffer ? (
          <>
            <span className="acc-price-old">{price}$</span>
            <span className="acc-price-new">{offer}$</span>
          </>
        ) : (
          <span className="acc-price-new">{price ?? "-"}$</span>
        )}
      </div>
    );
  };

  const RoomCard = ({ room, hotelName, hotelLocation, onClick }) => {
    const imgSrc = getImageUrl(room.picture);
    return (
      <div className="acc-card" onClick={onClick}>
        <img
          className="acc-card-img"
          src={imgSrc}
          alt={hotelName}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
        <div className="acc-card-body">
          <h4 className="acc-card-title">{hotelName}</h4>
          <Price price={room.price} offer={room.offer_price} />
          <div className="acc-card-meta">
            Area: {room.area ?? "-"} m² / Guests: {room.people_count ?? "-"}
          </div>
          <div className="acc-card-meta">Location: {hotelLocation ?? "-"}</div>
        </div>
      </div>
    );
  };

  const OtherCard = ({ item, onClick }) => {
    const imgSrc = getImageUrl(item.picture);
    return (
      <div className="acc-card" onClick={onClick}>
        <img
          className="acc-card-img"
          src={imgSrc}
          alt={item.accommodation_name || "Accommodation"}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
        <div className="acc-card-body">
          <h4 className="acc-card-title">
            {item.accommodation_name || item.name}
          </h4>
          <Price price={item.price} offer={item.offer_price} />
          <div className="acc-card-meta">
            Area: {item.area ?? "-"} m² / Type: {item.type ?? "-"}
          </div>
          <div className="acc-card-meta">Location: {item.location ?? "-"}</div>
        </div>
      </div>
    );
  };

  const formatDateForStore = (d) => {
    if (!d) return null;
    const date = new Date(d);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() is zero-based
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  const shouldShowGuests =
    selectedTypeName === "Hotel" || selectedTypeName === "";

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        const [countriesRes, typesRes, accommodatonRes] = await Promise.all([
          axios.get(`${baseURL}/${GET_ALL_COUNTRIES}`),
          axios.get(`${baseURL}/${GET_ALL_ACCOMMODATION_TYPES}`),
          axios.get(`${baseURL}/${GET_ALL_ACCOMMODATION}`),
        ]);
        setCountries(countriesRes.data.countries || []);
        setTypes(typesRes.data.accommodation_types || []);
        setResults(accommodatonRes.data);
      } catch (e) {
        setCountries([]);
        setTypes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const doSearch = useCallback(() => {
    const payload = {
      type_id: selectedTypeId || "",
      country_id: selectedCountryId || "",
      name: placeName || "",
      destination: region || "",
      start_date: formatDateForStore(dateRange[0]?.startDate),
      end_date: formatDateForStore(dateRange[0]?.endDate),
      people_count: guests !== "" ? guests : "",
    };

    setLoading(true);
    axios
      .post(`${baseURL}/${FILTER_ACCOMMODATION}`, payload)
      .then((res) => {
        setResults(res.data);
      })
      .catch((err) => {
        console.log(err);
        setResults(null);
      })
      .finally(() => setLoading(false));
  }, [selectedTypeId, selectedCountryId, placeName, region, dateRange, guests]);

  const handleSearch = () => {
    const hasDates = Boolean(dateRange[0]?.startDate && dateRange[0]?.endDate);
    if (!hasDates) {
      toast.error("Please select dates first");
      setShowDateModal(true);
      return;
    }
    setLastSearchTypeName(selectedTypeName);
    doSearch();
  };

  const handleClick = (id, type) => {
    navigate(`/accommodation-preview/${id}`, { state: { type } });
  };

  const Arrow = (
    <svg viewBox="0 0 360 360" xml="space" className="dropdown-arrow">
      <g id="SVGRepo_iconCarrier">
        <path
          id="XMLID_225_"
          d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
        />
      </g>
    </svg>
  );

  return loading ? (
    <Loader />
  ) : (
    <div className="fs" style={{ paddingTop: 0, margin: "0 20px" }}>
      <ToastContainer />
      <div
        className="accommodation-filter-details-container"
        style={{ padding: "24px 0" }}
      >
        <div
          className="accommodation-filter-details-card"
          style={{ maxWidth: 980, width: "100%" }}
        >
          <h2
            className="accommodation-filter-details-title"
            style={{ marginBottom: 10 }}
          >
            Book Your Stay
          </h2>
          <div
            style={{
              textAlign: "center",
              color: "var(--color3)",
              marginBottom: 24,
              direction: "ltr",
              fontSize: "calc(.3rem + .8vw)",
            }}
          >
            Find the perfect accommodation by selecting your destination, dates,
            and preferences.
          </div>

          <div
            className="search-bar-modern"
            style={{ flexWrap: "wrap", justifyContent: "center" }}
          >
            <div
              className="accommodation-filter-details-inputbox"
              style={{ maxWidth: 260 }}
            >
              <input
                required="required"
                placeholder=" "
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
              />
              <span>Place name</span>
              <i></i>
            </div>
            <div
              className="accommodation-filter-details-inputbox"
              style={{ maxWidth: 260 }}
            >
              <input
                required="required"
                placeholder=" "
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
              <span>Region</span>
              <i></i>
            </div>

            <div
              className="owner-menu country-menu"
              style={{ margin: "0 6px" }}
            >
              <div className="owner-item">
                <a
                  href="#"
                  className="link"
                  onClick={(e) => e.preventDefault()}
                >
                  <span>{selectedCountry || "All Countries"}</span>
                  {Arrow}
                </a>
                <div className="owner-submenu" style={{ zIndex: "1000" }}>
                  <div className="owner-submenu-item">
                    <a
                      href="#"
                      className="owner-submenu-link"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCountry("");
                        setSelectedCountryId("");
                      }}
                    >
                      All Countries
                    </a>
                  </div>
                  {countries.map((c) => (
                    <div className="owner-submenu-item" key={c.id}>
                      <a
                        href="#"
                        className="owner-submenu-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCountry(c.name);
                          setSelectedCountryId(c.id);
                        }}
                      >
                        {c.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="owner-menu country-menu"
              style={{ margin: "0 6px" }}
            >
              <div className="owner-item">
                <a
                  href="#"
                  className="link"
                  onClick={(e) => e.preventDefault()}
                >
                  <span>{selectedTypeName || "All Types"}</span>
                  {Arrow}
                </a>
                <div className="owner-submenu">
                  <div className="owner-submenu-item">
                    <a
                      href="#"
                      className="owner-submenu-link"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedTypeName("");
                        setSelectedTypeId("");
                      }}
                    >
                      All Types
                    </a>
                  </div>
                  {types.map((t) => (
                    <div className="owner-submenu-item" key={t.id}>
                      <a
                        href="#"
                        className="owner-submenu-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedTypeName(t.name);
                          setSelectedTypeId(t.id);
                        }}
                      >
                        {t.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="owner-menu country-menu"
              style={{ margin: "0 6px" }}
            >
              <div className="owner-item dd ">
                <a
                  href="#"
                  className="link"
                  onClick={(e) => {
                    e.preventDefault();
                    const currentStart = dateRange[0]?.startDate || new Date();
                    const currentEnd = dateRange[0]?.endDate || new Date();
                    setTempDateRange([
                      {
                        startDate: currentStart,
                        endDate: currentEnd,
                        key: "selection",
                      },
                    ]);
                    setTempDateSelected(
                      Boolean(dateRange[0]?.startDate && dateRange[0]?.endDate)
                    );
                    setShowDateModal(true);
                  }}
                >
                  <span style={{ direction: "ltr", textAlign: "center" }}>
                    {dateSelected &&
                    dateRange[0]?.startDate &&
                    dateRange[0]?.endDate
                      ? `${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`
                      : "Select Dates"}
                  </span>
                </a>
              </div>
            </div>

            {shouldShowGuests && (
              <div
                className="accommodation-filter-details-inputbox"
                style={{ maxWidth: 260 }}
              >
                <input
                  placeholder=" "
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
                <span>Guests</span>
                <i></i>
              </div>
            )}
          </div>

          {/* Date modal */}
          {showDateModal && (
            <div
              onClick={() => setShowDateModal(false)}
            >
              <div
                className="col-lg-9 col-md-12 col-sm-11 col-12 date-container"
                onClick={(e) => e.stopPropagation()}
              >
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowDateModal(false)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "var(--color2)",
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                  aria-label="Close"
                  title="Close"
                >
                  ×
                </button>
              </div>
              <DateRange
                className="w-100"
                months={2}
                direction="horizontal"
                moveRangeOnFirstSelection={false}
                ranges={[
                  {
                    startDate: tempDateRange[0]?.startDate || new Date(),
                    endDate: tempDateRange[0]?.endDate || new Date(),
                    key: "selection",
                  },
                ]}
                rangeColors="transparent"
                onChange={({ selection }) => {
                  setTempDateRange([selection]);
                  setTempDateSelected(
                    Boolean(selection?.startDate && selection?.endDate)
                  );
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 12,
                }}
              >
                <SaveButton
                  onClick={() => {
                    setDateRange(tempDateRange);
                    setDateSelected(
                      Boolean(
                        tempDateRange[0]?.startDate && tempDateRange[0]?.endDate
                      ) || tempDateSelected
                    );
                    setShowDateModal(false);
                  }}
                />
              </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: 14,
            }}
          >
            <button
              className="owner-search-button users"
              onClick={handleSearch}
            >
              <svg viewBox="0 0 512 512" className="svgIcon">
                <path d="M505 442.7L405.3 343c28.4-34.9 45.5-79 45.5-127C450.8 96.5 354.3 0 225.4 0S0 96.5 0 216.1s96.5 216.1 216.1 216.1c48 0 92.1-17.1 127-45.5l99.7 99.7c4.5 4.5 10.6 7 17 7s12.5-2.5 17-7c9.4-9.4 9.4-24.6 0-34zM216.1 392.2c-97.2 0-176.1-78.9-176.1-176.1S118.9 39.9 216.1 39.9s176.1 78.9 176.1 176.1-78.9 176.1-176.1 176.1z" />
              </svg>
            </button>
          </div>

          <div style={{ maxWidth: 1100, margin: "20px auto", width: "100%" }}>
            {loading && (
              <div style={{ textAlign: "center", color: "var(--color2)" }}>
                Loading...
              </div>
            )}
            {!loading && results && (
              <div className="accommodation-results">
                {(lastSearchTypeName === "" || lastSearchTypeName === null) &&
                !Array.isArray(results) ? (
                  <>
                    {Array.isArray(results.hotels) &&
                      results.hotels.length > 0 && (
                        <>
                          <h3 className="result-section-title">Hotels</h3>
                          {results.hotels.flatMap((hotel) =>
                            Array.isArray(hotel.rooms) && hotel.rooms.length > 0
                              ? hotel.rooms.map((room) => (
                                  <RoomCard
                                    key={`room-${room.id}`}
                                    room={room}
                                    hotelName={hotel.accommodation_name}
                                    hotelLocation={hotel.location}
                                    onClick={() => {
                                      handleClick(room.id, "room");
                                    }}
                                  />
                                ))
                              : []
                          )}
                        </>
                      )}
                    {Array.isArray(results.others) &&
                      results.others.length > 0 && (
                        <>
                          <h3 className="result-section-title">
                            Other Accommodations
                          </h3>
                          {results.others.map((item) => (
                            <OtherCard
                              key={`other-${item.id}`}
                              item={item}
                              onClick={() => {
                                handleClick(item.id, "other");
                              }}
                            />
                          ))}
                        </>
                      )}
                  </>
                ) : lastSearchTypeName === "Hotel" ? (
                  <>
                    <h3 className="result-section-title">Hotel Rooms</h3>
                    {Array.isArray(results) && results.length > 0 ? (
                      results.flatMap((hotel) =>
                        Array.isArray(hotel.rooms) && hotel.rooms.length > 0
                          ? hotel.rooms.map((room) => (
                              <RoomCard
                                key={`room-${room.id}`}
                                room={room}
                                hotelName={hotel.accommodation_name}
                                hotelLocation={hotel.location}
                                onClick={() => {
                                  handleClick(room.id, "room");
                                }}
                              />
                            ))
                          : []
                      )
                    ) : (
                      <div style={{ color: "#777" }}>No results</div>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="result-section-title">Accommodations</h3>
                    {Array.isArray(results) && results.length > 0 ? (
                      results.map((item) => (
                        <OtherCard
                          key={`other-${item.id}`}
                          item={item}
                          onClick={() => {
                            handleClick(item.id, "other");
                          }}
                        />
                      ))
                    ) : (
                      <div style={{ color: "#777" }}>No results</div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
