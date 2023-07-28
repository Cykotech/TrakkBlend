/* eslint-disable react/prop-types */
import './Track.css'

function Track(props) {
    return (
                <div key={props.track.id} className="track-container">
                    <img src={props.track.image} />
                    <div className="text-container">
                        <p className="title">{props.track.title}</p>
                        <p className="artist">{props.track.artist}</p>
                    </div>
                    <button>{props.removeTrack()}</button>
                </div>
    )
}

export default Track;