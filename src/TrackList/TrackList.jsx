/* eslint-disable react/prop-types */
import Track from "../Track/Track";

function TrackList(props) {
  const tracks = props.results || props.playlist;
  console.log(tracks);

  return (
    <div className="tracklist-container">
      {tracks.map((track) => {
        return (
          <Track
            track={track}
            key={track.id}
            addTrack={props.addTrack}
            removeTrack={props.removeTrack}
            isRemove={props.isRemove}
          />
        );
      })}
    </div>
  );
}

export default TrackList;
