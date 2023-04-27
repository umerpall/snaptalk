import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import useClickOutside from "../../helpers/clickOutside";
import "./style.css";
import UpdateProfilePicture from "./UpdateProfilePicture";

const ProfilePicture = ({ setShow, picRef, photos }) => {
  const refInput = useRef(null);
  const popupProfileRef = useRef(null);
  const { user } = useSelector((state) => ({ ...state }));
  useClickOutside(popupProfileRef, () => setShow(false));
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const handleImage = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp" &&
      file.type !== "image/gif"
    ) {
      setError(`${file.name} format is not supported.`);
      return;
    } else if (file.size > 1024 * 1024 * 3) {
      setError(`${file.name} size is too large. Max 3MB is allowed.`);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setImage(event.target.result);
    };
  };
  return (
    <div className="blur">
      <input
        type="file"
        ref={refInput}
        hidden
        onChange={handleImage}
        accept="image/jpeg, image/png, image/webp, image/gif"
      />
      <div className="post_box picture_box" ref={popupProfileRef}>
        <div className="box_header">
          <div className="small_circle" onClick={() => setShow(false)}>
            <i className="exit_icon"></i>
          </div>
          <span>Update Profile Picture</span>
        </div>
        <div className="update_picture_wrap">
          <button
            className="light_yellow_btn"
            onClick={() => refInput.current.click()}
          >
            <i className="plus_icon filter_yellow"></i>
            Upload Photo
          </button>
        </div>
        {error && (
          <div className="comment_error">
            <div className="postError_error">{error}</div>
            <button className="yellow_btn" onClick={() => setError("")}>
              Try again
            </button>
          </div>
        )}
        <div className="old_pictures_wrap scrollbar">
          <h4>Your profile photos</h4>
          <div className="old_pictures">
            {photos &&
              photos
                .filter(
                  (img) => img.folder === `${user.username}/profile_pictures`
                )
                .map((photo) => (
                  <img
                    src={photo.secure_url}
                    alt="Old Photos"
                    key={photo.public_id}
                    onClick={() => setImage(photo.secure_url)}
                  />
                ))}
          </div>
          <h4>Other photos</h4>
          <div className="old_pictures">
            {photos
              .filter(
                (img) => img.folder !== `${user.username}/profile_pictures`
              )
              .map((photo) => (
                <img
                  src={photo.secure_url}
                  alt="Old Photos"
                  key={photo.public_id}
                  onClick={() => setImage(photo.secure_url)}
                />
              ))}
          </div>
        </div>
      </div>
      {image && (
        <UpdateProfilePicture
          setImage={setImage}
          image={image}
          setError={setError}
          setShow={setShow}
          picRef={picRef}
          popupProfileRef={popupProfileRef}
        />
      )}
    </div>
  );
};

export default ProfilePicture;
