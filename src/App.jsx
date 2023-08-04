import "./App.css";
import Searchbar from "./Searchbar/Searchbar";
import Results from "./Results/Results";
import Playlists from "./Playlists/Playlists/";
import Spotify from "./Spotify/Spotify";
import { useState } from "react";

function App() {
  const [searchName, SetSearchName] = useState("Find a Song");
  const [results, SetResults] = useState([])
  const [playlist, SetPlaylist] = useState([]);
  const [playlistName, SetPlaylistName] = useState("Playlist Name");
  // const testResults = [
  //   {
  //     image: "./src/assets/The_Weeknd_-_After_Hours.png",
  //     artist: "The Weeknd",
  //     title: "Blinding Lights",
  //     id: 1,
  //     uri: "spotify:track:0VjIjW4GlUZAMYd2vXMi3b",
  //   },
  //   {
  //     image: "./src/assets/Thepoison.jpg",
  //     artist: "Bullet for My Valentine",
  //     title: "Tears Don't Fall",
  //     id: 2,
  //     uri: "spotify:track:1kdiiFGX1Htx0aVZYaDwEJ",
  //   },
  // ];

  const addTrack = (track) => {
    if (playlist.some((savedTrack) => savedTrack.id === track.id)) {
      return track;
    }
    SetPlaylist((prevPlaylist) => [...prevPlaylist, track]);
  };

  const removeTrack = (track) => {
    SetPlaylist((prevPlaylist) =>
      prevPlaylist.filter((savedTrack) => savedTrack.id != track.id)
    );
  };

  const handleSearchChange = ({ target }) => {
    SetSearchName(target.value);
  };

  const handlePlaylistChange = ({ target }) => {
    SetPlaylistName(target.value);
  };

  const savePlaylist = () => {
    const trackUris = playlist.map((track) => track.uri);
    SetPlaylist([]);
    SetPlaylistName("Playlist Name");
    console.log(trackUris);
  };

  const submitSearch = (event, term) => {
    console.log("This is working");
    // event.preventDefault();
    SetResults(Spotify.search(term)) 
  }

  return (
    <>
      <div className="header">
        <h1>
          Tra<span className="red">kk</span>Blend
        </h1>
      </div>
      <Searchbar
        searchName={searchName}
        handleChange={handleSearchChange}
        handleClick={submitSearch}
      />
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
    </>
  );
}

export default App;
