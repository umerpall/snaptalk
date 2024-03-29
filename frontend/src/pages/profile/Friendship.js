import { useEffect, useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";
import { useSelector } from "react-redux";
import {
  acceptRequest,
  addFriend,
  cancelRequest,
  deleteRequest,
  follow,
  unfollow,
  unfriend,
} from "../../functions/user";

const Friendship = ({ friendshipp, profileId }) => {
  const [friendsMenu, setFriendsMenu] = useState(false);
  const [respondMenu, setRespondMenu] = useState(false);
  const [friendship, setFriendship] = useState(friendshipp);
  useEffect(() => {
    setFriendship(friendshipp);
  }, [friendshipp]);
  const friendMenuRef = useRef(null);
  const respondMenuRef = useRef(null);
  useClickOutside(friendMenuRef, () => setFriendsMenu(false));
  useClickOutside(respondMenuRef, () => setRespondMenu(false));
  const { user } = useSelector((state) => ({ ...state }));

  const addFriendHandler = async () => {
    setFriendship({ ...friendship, requestSent: true, following: true });
    await addFriend(profileId, user.token);
  };

  const cancelRequestHandler = async () => {
    setFriendship({ ...friendship, requestSent: false, following: false });
    await cancelRequest(profileId, user.token);
  };

  const followHandler = async () => {
    setFriendship({ ...friendship, following: true });
    await follow(profileId, user.token);
  };

  const unfollowHandler = async () => {
    setFriendship({ ...friendship, following: false });
    await unfollow(profileId, user.token);
  };

  const acceptRequestHandler = async () => {
    setFriendship({
      ...friendship,
      following: true,
      friends: true,
      requestSent: false,
      requestReceived: false,
    });
    await acceptRequest(profileId, user.token);
  };

  const unfriendHandler = async () => {
    setFriendship({
      ...friendship,
      following: false,
      friends: false,
      requestSent: false,
      requestReceived: false,
    });
    await unfriend(profileId, user.token);
  };

  const deleteRequestHandler = async () => {
    setFriendship({
      ...friendship,
      following: false,
      friends: false,
      requestSent: false,
      requestReceived: false,
    });
    await deleteRequest(profileId, user.token);
  };

  return (
    <div className="friendship">
      {friendship?.friends ? (
        <div className="friends_menu_wrap">
          <button
            className="gray_btn"
            onClick={() => setFriendsMenu((prev) => !prev)}
          >
            <img src="../../../icons/friends.png" alt="" />
            <span>Friends</span>
          </button>
          {friendsMenu && (
            <div className="open_cover_menu" ref={friendMenuRef}>
              <div className="open_cover_menu_item hover1">
                <img src="../../../icons/editFriends.png" alt="" />
                Edit Friends List
              </div>
              {friendship?.following ? (
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => unfollowHandler()}
                >
                  <img src="../../../icons/unfollowoutlined.png" alt="" />
                  Unfollow
                </div>
              ) : (
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => followHandler()}
                >
                  <img src="../../../icons/unfollowoutlined.png" alt="" />
                  Follow
                </div>
              )}
              <div
                className="open_cover_menu_item hover1"
                onClick={() => unfriendHandler()}
              >
                <i className="unfriend_outlined_icon"></i>
                Unfriend
              </div>
            </div>
          )}
        </div>
      ) : (
        !friendship?.requestSent &&
        !friendship?.requestReceived && (
          <button className="yellow_btn" onClick={() => addFriendHandler()}>
            <img src="../../../icons/addFriend.png" alt="" className="invert" />
            <span>Add Friend</span>
          </button>
        )
      )}
      {friendship?.requestSent ? (
        <button className="yellow_btn" onClick={() => cancelRequestHandler()}>
          <img
            src="../../../icons/cancelrequest.png"
            alt=""
            className="invert"
          />
          <span>Cancel Request</span>
        </button>
      ) : (
        friendship?.requestReceived && (
          <div className="friends_menu_wrap">
            <button className="gray_btn" onClick={() => setRespondMenu(true)}>
              <img src="../../../icons/friends.png" alt="" />
              <span>Respond</span>
            </button>
            {respondMenu && (
              <div className="open_cover_menu" ref={respondMenuRef}>
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => acceptRequestHandler()}
                >
                  Confirm
                </div>
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => deleteRequestHandler()}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        )
      )}
      {friendship?.following ? (
        <button className="gray_btn" onClick={() => unfollowHandler()}>
          <img src="../../../icons/follow.png" alt="" />
          <span>Following</span>
        </button>
      ) : (
        <button className="yellow_btn" onClick={() => followHandler()}>
          <img src="../../../icons/follow.png" alt="" className="invert" />
          <span>Follow</span>
        </button>
      )}
    </div>
  );
};

export default Friendship;
