import { useRef } from "react";
import { useSelector } from "react-redux";
import useClickOutside from "../../helpers/clickOutside";

const OldCovers = ({ photos, setCoverPicture, setShow }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const selectPhotoRef = useRef(null);
  useClickOutside(selectPhotoRef, () => setShow(false));
  return (
    <div className="blur">
      <div className="post_box select_cover_box" ref={selectPhotoRef}>
        <div className="box_header">
          <div className="small_circle" onClick={() => setShow(false)}>
            <i className="exit_icon"></i>
          </div>
          <span>Select photo</span>
        </div>
        <div className="old_pictures_wrap scrollbar">
          <div className="old_pictures">
            {photos &&
              photos
                .filter((img) => img.folder === `${user.username}/cover`)
                .map((photo) => (
                  <img
                    src={photo.secure_url}
                    alt="Old Photos"
                    key={photo.public_id}
                    onClick={() => {
                      setCoverPicture(photo.secure_url);
                      setShow(false);
                    }}
                  />
                ))}
          </div>
          <div className="old_pictures">
            {photos &&
              photos
                .filter((img) => img.folder !== `${user.username}/post_images`)
                .map((photo) => (
                  <img
                    src={photo.secure_url}
                    alt="Old Photos"
                    key={photo.public_id}
                    onClick={() => {
                      setCoverPicture(photo.secure_url);
                      setShow(false);
                    }}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OldCovers;
