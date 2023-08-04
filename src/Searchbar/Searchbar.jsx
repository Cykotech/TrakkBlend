/* eslint-disable react/prop-types */
import "./Searchbar.css";

function Searchbar(props) {
  return (
    <div className="form">
        <input
          className="song-name"
          type="text"
          value={props.searchName}
          onChange={props.handleChange}
        ></input>
        <button
          className="search"
          value="Search"
          onClick={props.handleClick}
        ></button>
    </div>
  );
}

export default Searchbar;
