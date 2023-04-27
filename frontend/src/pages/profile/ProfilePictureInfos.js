import { useRef, useState } from "react";
import ProfilePicture from "../../components/profilePicture";
import Friendship from "./Friendship";
import "./style.css";

const ProfilePictureInfos = ({ profile, visitor, photos }) => {
  const [show, setShow] = useState(false);
  const picRef = useRef(null);
  return (
    <div className="profile_img_wrap">
      {show && (
        <ProfilePicture setShow={setShow} picRef={picRef} photos={photos} />
      )}
      <div className="profile_w_left">
        <div className="profile_w_img">
          <div
            className="profile_w_bg"
            ref={picRef}
            style={{
              backgroundImage: `url(${profile.picture})`,
            }}
          ></div>
          {!visitor && (
            <div
              className="profile_circle hover1"
              onClick={() => setShow(true)}
            >
              <i className="camera_filled_icon"></i>
            </div>
          )}
        </div>
        <div className="profile_w_col">
          <div className="profile_name">
            {profile.first_name} {profile.last_name}
          </div>
        </div>
      </div>
      {visitor && (
        <Friendship
          friendshipp={profile?.friendship}
          profileId={profile?._id}
        />
      )}
    </div>
  );
};

export default ProfilePictureInfos;
