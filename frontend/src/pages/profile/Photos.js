import axios from "axios";
import { useEffect, useReducer } from "react";
import { photosReducer } from "../../functions/reducers";

const Photos = ({ username, token, photos }) => {
  return (
    <div className="profile_card">
      <div className="profile_card_header">Photos</div>
      <div className="profile_card_count">
        {photos && photos.total_count === 0
          ? ""
          : photos && photos.total_count === 1
          ? `1 Photo`
          : `${photos.total_count} Photos`}
      </div>
      <div className="profile_card_grid">
        {photos.resources &&
          photos.resources.slice(0, 9).map((photo) => (
            <div className="profile_photo_card" key={photo.public_id}>
              <img src={photo.secure_url} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Photos;
