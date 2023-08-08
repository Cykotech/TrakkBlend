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
    <form>
      <input
        className="song-name"
        type="text"
        value={term}
        onChange={handleChange}
      ></input>
      <input
        type="submit"
        className="search"
        value="Search"
        onClick={search}
      ></input>
    </form>
  );
}

export default Searchbar;
