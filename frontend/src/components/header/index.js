import "./style.css";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  Chat,
  ChatFilled,
  Friends,
  FriendsActive,
  Home,
  HomeActive,
  Search,
} from "../../svg";
import { useSelector } from "react-redux";
import SearchMenu from "./SearchMenu";
import { useEffect, useRef, useState } from "react";
import UserMenu from "./UserMenu";
import useClickOutside from "../../helpers/clickOutside";
import { getFriendsPageInfos } from "../../functions/user";

export const Header = ({ page, getAllPosts, setShowFeedback }) => {
  const { user } = useSelector((user) => ({ ...user }));
  const color = "#65676b";
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [friendsRequestsCount, setFriendsRequestsCount] = useState(0);
  const userMenu = useRef(null);
  useClickOutside(userMenu, () => {
    setShowUserMenu(false);
  });
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const data = await getFriendsPageInfos(user.token);
    setFriendsRequestsCount(data.data.requests.length);
  };
  return (
    <div className="header">
      <div className="header_left">
        <Link to="/" className="header_logo">
          <div className="circle">
            <img src={require("../../svg/icon.png")} alt="logo" />
          </div>
        </Link>
        <div className="search search1" onClick={() => setShowSearchMenu(true)}>
          <Search color={color} />
          <input type="text" placeholder="Search..." className="hide_input" />
        </div>
      </div>
      {showSearchMenu && (
        <SearchMenu
          color={color}
          setShowSearchMenu={setShowSearchMenu}
          token={user.token}
        />
      )}
      <div className="header_middle">
        <Link
          to="/"
          className={`middle_icon  ${page === "home" ? "active" : "hover1"}`}
          onClick={() => getAllPosts()}
        >
          {page === "home" ? <HomeActive /> : <Home color={color} />}
        </Link>
        <Link
          to="/friends"
          className={`middle_icon  ${page === "friends" ? "active" : "hover1"}`}
        >
          {page === "friends" ? <FriendsActive /> : <Friends color={color} />}
          {!(friendsRequestsCount === 0) && (
            <div className="middle_notification ">
              {friendsRequestsCount < 9 ? friendsRequestsCount : `9+`}
            </div>
          )}
        </Link>
        <Link to="/chat" className={`middle_icon hover1`}>
          {page === "chat" ? <ChatFilled /> : <Chat />}
          <div className="middle_notification ">8+</div>
        </Link>
      </div>
      <div className="header_right">
        <Link
          to="/profile"
          className={`profile_link hover1 ${
            page === "profile" ? "active_link" : ""
          }`}
        >
          <img src={user?.picture} alt="" />
          <span>{user?.first_name}</span>
        </Link>
        <div className="circle_icon hover1" ref={userMenu}>
          <div onClick={() => setShowUserMenu((prev) => !prev)}>
            <ArrowDown />
          </div>
          {showUserMenu && (
            <UserMenu setShowFeedback={setShowFeedback} user={user} />
          )}
        </div>
      </div>
    </div>
  );
};
