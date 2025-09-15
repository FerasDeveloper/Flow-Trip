import axios from "axios";
import { useEffect, useState } from "react";
import OwnerCard from "../Component/OwnerCard";
import OwnerCardSkeleton from "../Component/OwnerCardSkeleton";
import "./OwnerSearch.css";
import { useNavigate } from "react-router-dom";
import { ADMIN_SEARCH, baseURL, GET_ALL_COUNTRIES, GET_ALL_OWNER_CATEGORIES, GET_ALL_OWNERS, TOKEN } from "../Api/Api";

export default function Owner() {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");


  const token = TOKEN;

  useEffect(() => {
    const loadInfo = async () => {
      await axios
        .get("http://127.0.0.1:8000/api/GetAllOwners", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setOwners(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });

      await axios
        .get("http://127.0.0.1:8000/api/GetAllCountries", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setCountries(res.data.countries || []);
        })
        .catch(() => {
          setCountries([]);
        });

      await axios
        .get("http://127.0.0.1:8000/api/GetAllOwnerCategories")
        .then((res) => {
          setCategories(res.data.owners_categories || []);
        })
        .catch(() => {
          setCategories([]);
        });
    };
    loadInfo();
  }, []);

  const handleSearch = async (e, categoryIdParam = null) => {
    e.preventDefault();
    const categoryIdToUse = categoryIdParam !== null ? categoryIdParam : selectedCategoryId;
    if (!search && !selectedCountry && !categoryIdToUse) {
      setOwners([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const body = {};
      if (search) body.name = search;
      if (selectedCountry) body.country = selectedCountry;
      if (categoryIdToUse) body.category_id = categoryIdToUse;

      const res = await axios.post(
        "http://127.0.0.1:8000/api/AdminSearch",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data && res.data.data) {
        setOwners(res.data.data);
      } else {
        setOwners([]);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const reloadAllOwners = async (clearCountry = false, clearCategory = false) => {
    setLoading(true);
    setError(null);
    try {
      if (search || (selectedCountry && !clearCountry) || (selectedCategory && !clearCategory)) {
        const body = {};
        if (search) body.name = search;
        if (selectedCountry && !clearCountry) body.country = selectedCountry;
        if (selectedCategory && !clearCategory) body.category_id = selectedCategoryId;
        
        const res = await axios.post(
          "http://127.0.0.1:8000/api/AdminSearch",
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOwners(res.data.data || []);
      } else {
        const res = await axios.get("http://127.0.0.1:8000/api/GetAllOwners", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOwners(res.data.data);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fs owner">
        <div className="search-flex">
          <div className="search-bar-modern">
            <div className="owner-input-container">
              <input
                placeholder="Enter name"
                type="text"
                disabled
              />
            </div>
            <div className="owner-menu country-menu">
              <div className="owner-item">
                <a href="#" className="link">
                  <span>All Countries</span>
                  <svg viewBox="0 0 360 360" xml="space" className="dropdown-arrow">
                    <g id="SVGRepo_iconCarrier">
                      <path
                        id="XMLID_225_"
                        d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                      />
                    </g>
                  </svg>
                </a>
              </div>
            </div>
            <button className="owner-search-button" disabled>
              <svg viewBox="0 0 512 512" className="svgIcon">
                <path d="M505 442.7L405.3 343c28.4-34.9 45.5-79 45.5-127C450.8 96.5 354.3 0 225.4 0S0 96.5 0 216.1s96.5 216.1 216.1 216.1c48 0 92.1-17.1 127-45.5l99.7 99.7c4.5 4.5 10.6 7 17 7s12.5-2.5 17-7c9.4-9.4 9.4-24.6 0-34zM216.1 392.2c-97.2 0-176.1-78.9-176.1-176.1S118.9 39.9 216.1 39.9s176.1 78.9 176.1 176.1-78.9 176.1-176.1 176.1z" />
              </svg>
            </button>
          </div>
          <div className="owner-menu country-menu">
            <div className="owner-item">
              <a href="#" className="link">
                <span>All Category</span>
                <svg viewBox="0 0 360 360" xml="space" className="dropdown-arrow">
                  <g id="SVGRepo_iconCarrier">
                    <path
                      id="XMLID_225_"
                      d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                    />
                  </g>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="owner-list-container">
          {Array.from({ length: 8 }).map((_, index) => (
            <OwnerCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="owner-error">{error}</div>;
  }

  const filteredOwners = owners;

  return (
    <div className="fs owner">
      <div className="search-flex">
        <div className="search-bar-modern">
          <div className="owner-input-container">
            <input
              placeholder="Enter name"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="owner-menu country-menu">
            <div className="owner-item">
              <a
                href="#"
                className="link"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <span>{selectedCountry || "All Countries"}</span>
                <svg
                  viewBox="0 0 360 360"
                  xml="space"
                  className="dropdown-arrow"
                >
                  <g id="SVGRepo_iconCarrier">
                    <path
                      id="XMLID_225_"
                      d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                    />
                  </g>
                </svg>
              </a>
              <div className="owner-submenu">
                <div className="owner-submenu-item">
                  <a
                    href="#"
                    className="owner-submenu-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCountry("");
                      reloadAllOwners(true, false);
                    }}
                  >
                    All Countries
                  </a>
                </div>
                {countries.map((country) => (
                  <div className="owner-submenu-item" key={country.id}>
                    <a
                      href="#"
                      className="owner-submenu-link"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCountry(country.name);
                      }}
                    >
                      {country.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button className="owner-search-button" onClick={handleSearch}>
            <svg viewBox="0 0 512 512" className="svgIcon">
              <path d="M505 442.7L405.3 343c28.4-34.9 45.5-79 45.5-127C450.8 96.5 354.3 0 225.4 0S0 96.5 0 216.1s96.5 216.1 216.1 216.1c48 0 92.1-17.1 127-45.5l99.7 99.7c4.5 4.5 10.6 7 17 7s12.5-2.5 17-7c9.4-9.4 9.4-24.6 0-34zM216.1 392.2c-97.2 0-176.1-78.9-176.1-176.1S118.9 39.9 216.1 39.9s176.1 78.9 176.1 176.1-78.9 176.1-176.1 176.1z" />
            </svg>
          </button>
        </div>

        <div className="owner-menu country-menu">
          <div className="owner-item">
            <a
              href="#"
              className="link"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <span>{selectedCategory || "All Category"}</span>
              <svg viewBox="0 0 360 360" xml="space" className="dropdown-arrow">
                <g id="SVGRepo_iconCarrier">
                  <path
                    id="XMLID_225_"
                    d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                  />
                </g>
              </svg>
            </a>
            <div className="owner-submenu">
              <div className="owner-submenu-item">
                <a
                  href="#"
                  className="owner-submenu-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategory("");
                    setSelectedCategoryId("");
                    reloadAllOwners(false, true);
                  }}
                >
                  All Category
                </a>
              </div>
              {categories.map((category) => (
                <div className="owner-submenu-item" key={category.id}>
                  <a
                    href="#"
                    className="owner-submenu-link"
                    onClick={async (e) => {
                      e.preventDefault();
                      setSelectedCategory(category.name);
                      setSelectedCategoryId(category.id);
                      await handleSearch(e, category.id);
                    }}
                  >
                    {category.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="owner-list-container">
        {filteredOwners.map((item, idx) => (
          <OwnerCard
            key={item.owner.id}
            name={item.user.name}
            location={item.owner.location}
            phoneNumber={item.user.phone_number}
            category={item.category}
            isUserView={true}
            style={{ animationDelay: `${(idx + 1) * 0.1}s` }}
            onClick={() => navigate(`/owner_details/${item.owner.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
