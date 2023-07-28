/* eslint-disable react/prop-types */
import TrackList from '../TrackList/TrackList';
import './Results.css';

function Results(props) {
    return(
        <div className="container">
            <h2>Search Results</h2>
            <TrackList results={props.results} />
        </div>
    )
}

export default Results;