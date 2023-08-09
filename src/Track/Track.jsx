/* eslint-disable react/prop-types */
import "./Track.css";

function Track(props) {
  const handleAdd = () => {
    props.addTrack(props.track);
  };

  const handleRemove = () => {
    props.removeTrack(props.track);
  };

  const renderButton = () => {
    if (props.isRemove) {
      return <button className="remove" onClick={handleRemove}>-</button>;
    } else {
      return <button className="add" onClick={handleAdd}>+</button>;
    }
  };

  return (
    <div
      key={props.track.id}
      className="track-container"
    >
      <img src={props.track.image} />
      <div className="text-container">
        <p className="title">{props.track.name}</p>
        <p className="artist">{props.track.artist}</p>
      </div>
      {renderButton()}
    </div>
  );
}

export default Track;
