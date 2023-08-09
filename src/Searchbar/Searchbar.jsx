/* eslint-disable react/prop-types */
import { useState } from "react";
import "./Searchbar.css";

function Searchbar(props) {
  const [term, setTerm] = useState("Find a Song");

  const handleChange = (event) => {
    setTerm(event.target.value);
  };

  const search = (event) => {
    event.preventDefault();
    props.onSearch(term);
  };

  return (
    <div className="searchBar">
      <input
        className="song-name"
        type="text"
        value={term}
        onChange={handleChange}
      ></input>
      <button
        className="search"
        value="Search"
        onClick={search}
      >
        Search
      </button>
    </div>
  );
}

export default Searchbar;
