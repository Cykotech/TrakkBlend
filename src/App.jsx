import "./App.css";
import Searchbar from "./Searchbar/Searchbar";
import Results from "./Results/Results";
import Playlists from "./Playlists/Playlists/";
import Spotify from "./Spotify/Spotify";
import { useState } from "react";
import background from "./assets/dj-background.png";

function App() {
  const [results, SetResults] = useState([]);
  const [playlist, SetPlaylist] = useState([]);
  const [playlistName, SetPlaylistName] = useState("");

  function addTrack(track) {
    if (playlist.some((savedTrack) => savedTrack.id === track.id)) {
      return track;
    }
    SetPlaylist((prevPlaylist) => [...prevPlaylist, track]);
  }

  const removeTrack = (track) => {
    SetPlaylist((prevPlaylist) =>
      prevPlaylist.filter((savedTrack) => savedTrack.id != track.id)
    );
  };

  const handlePlaylistChange = ({ target }) => {
    SetPlaylistName(target.value);
  };

  const savePlaylist = () => {
    const trackUris = playlist.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackUris);
    SetPlaylist([]);
    SetPlaylistName("");
  };

  const submitSearch = (term) => {
    Spotify.search(term).then(SetResults);
  };

  return (
    <>
      
      <img className="background" src={background}></img>
        <div className="header">
          <h1>
            Tra<span className="red">kk</span>Blend
          </h1>
        </div>
        
        <div className="app">
        <Searchbar onSearch={submitSearch} />
        <div className="editor">
          <Results
            results={results}
            addTrack={addTrack}
          />
          <Playlists
            handleChange={handlePlaylistChange}
            playlist={playlist}
            removeTrack={removeTrack}
            playlistName={playlistName}
            handleClick={savePlaylist}
          />
        </div>
      </div>
    </>
  );
}

export default App;
