/* eslint-disable react/prop-types */
import "./Playlists.css";
import TrackList from "../TrackList/TrackList";

function Playlists(props) {
  return (
    <div className="container">
      <input
        type="text"
        placeholder="Playlist Name"
        value={props.playlistName}
        className="playlistName"
        onChange={props.handleChange}
      />
      <TrackList
        playlist={props.playlist}
        isRemove="true"
        removeTrack={props.removeTrack}
      />
      <button onClick={props.handleClick}>Save to Spotify</button>
    </div>
  );
}

export default Playlists;
