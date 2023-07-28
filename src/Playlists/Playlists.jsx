/* eslint-disable react/prop-types */
import './Playlists.css'
import Button from './Button.jsx';
import TrackList from '../TrackList/TrackList';
import { useState } from 'react';

function Playlists(props) {
    const [playlist, setPlaylist] = useState();

    return (
        <div className="container">
            <input 
                type="text" 
                placeholder="Playlist Name" 
                className="playlistName"
            />
            <TrackList playlist={props.playlist}/>
            <Button />   
        </div>
    )
}

export default Playlists;