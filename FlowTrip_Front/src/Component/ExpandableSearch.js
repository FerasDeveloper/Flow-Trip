import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { GoSearch } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import "./ExpandableSearch.css";

const ExpandableSearch = ({ handleSearch, onReset, reservationsRef }) => {
  const [expSearch, setExpSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [showIcon, setShowIcon] = useState(false);

  const toggleExpSearch = () => {
    if (expSearch) {
      setExpSearch(false);
      setQuery("");
      onReset && onReset();
    } else {
      setExpSearch(true);
    }
  };

  const handleSubmit = () => {
    if (query.trim()) {
      handleSearch(query);
    }
  };

  useEffect(() => {
    if (expSearch && query.trim() === "") {
      onReset && onReset();
    }
  }, [query, expSearch, onReset]);
  useEffect(() => {
    let timer;
    if (expSearch) {
      timer = setTimeout(() => setShowIcon(true), 200);
    } else {
      setShowIcon(false);
    }
    return () => clearTimeout(timer);
  }, [expSearch]);

  return (
    <div className="s-container">
      <button
        className="s-button"
        type="button"
        onClick={toggleExpSearch}
        aria-label="Toggle search"
      >
        {expSearch ? <IoMdClose /> : <GoSearch />}
      </button>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className={clsx(expSearch && "exp-search-show")}
        placeholder="Search..."
      />
      {showIcon && (
        <i
          className="fa-solid fa-arrow-right arrow-right-search"
          onClick={handleSubmit}
        ></i>
      )}
    </div>
  );
};

export default ExpandableSearch;
