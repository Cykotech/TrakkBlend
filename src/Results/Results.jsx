/* eslint-disable react/prop-types */
import TrackList from "../TrackList/TrackList";
import "./Results.css";

function Results(props) {
  return (
    <div className="container">
      <h2>Search Results</h2>
      <TrackList
        results={props.results}
        addTrack={props.addTrack}
      />
    </div>
  );
}

export default Results;
