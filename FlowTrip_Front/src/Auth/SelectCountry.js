import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { baseURL, GET_ALL_COUNTRIES } from "../Api/Api";

countries.registerLocale(enLocale);

const SelectCountry = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const categoryId = location.state?.categoryId;

  useEffect(() => {
    axios
      .get(`${baseURL}/${GET_ALL_COUNTRIES}`)
      .then((res) => {
        setCountriesData(res.data.countries || []);
      })
      .catch((err) => {
        console.error("Error fetching countries:", err);
      });
  }, []);

  const getCountryCode = (name) => {
    return countries.getAlpha2Code(name, "en")?.toLowerCase();
  };

  const filteredCountries = countriesData.filter((country) =>
    country.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleCountryClick = (countryId) => {
    navigate("/create-owner/step-3", {
      state: {
        categoryId: categoryId,
        countryId: countryId,
      },
    });
  };

  return (
    <div className="owner-country-wrapper-search" style={{ padding: "20px" }}>
      <form className="form-search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="search">Search</label>
        <input
          required
          pattern=".*\\S.*"
          type="search"
          className="input-search"
          id="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <span className="caret-search"></span>
      </form>

      <div className="category-grid-search">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => {
            const code = getCountryCode(country.name);
            const flagUrl = code
              ? `https://flagcdn.com/w80/${code}.png`
              : null;

            return (
              <div
                key={country.id}
                className="country-card"
                onClick={() => handleCountryClick(country.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "var(--color4)",
                }}
              >
                {flagUrl && (
                  <img
                    src={flagUrl}
                    alt={`${country.name} flag`}
                    style={{
                      width: "40px",
                      height: "30px",
                      borderRadius: "4px",
                      objectFit: "cover",
                    }}
                  />
                )}
                <span>{country.name}</span>
              </div>
            );
          })
        ) : (
          <p>No countries found.</p>
        )}
      </div>
    </div>
  );
};

export default SelectCountry;
