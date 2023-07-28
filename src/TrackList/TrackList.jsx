/* eslint-disable react/prop-types */
import Track from "../Track/Track";

function TrackList(props) {
    const tracks = props.results || props.playlist;

    const removeTrack = () => {
        if (props.playlist) {
            return "-";
        } else {
            return "+";
        }
    }

    return (
        <div className="tracklist-container" >
            {tracks.map((track) => {
                return (<Track 
                            track={track} 
                            key={track.id} 
                            removeTrack={removeTrack} 
                        />)
            })}            
        </div>
    )
}

export default TrackList;