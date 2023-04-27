import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import DigitalAccessibility from "./DigitalAccessibility";
import Cookies from "js-cookie";
import axios from "axios";

const UserMenu = ({ user, setShowFeedback }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(0);
  const logout = async () => {
    Cookies.set("user", "");
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
    try {
      await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/logoutLog/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="menu">
      {visible === 0 && (
        <div>
          <Link to="/profile" className="menu_header hover3">
            <img src={user?.picture} alt="profile" />
            <div className="menu_col">
              <span>
                {user?.first_name} {user?.last_name}
              </span>
              <span>See your profile</span>
            </div>
          </Link>
          <div className="menu_splitter"></div>
          <div
            className="menu_item hover3"
            onClick={() => setShowFeedback(true)}
          >
            <div className="small_circle">
              <i className="help_filled_icon"></i>
            </div>
            <span>Feedback</span>
          </div>
          <div className="menu_item hover3" onClick={() => setVisible(1)}>
            <div className="small_circle">
              <i className="dark_filled_icon"></i>
            </div>
            <span>Dark Mode</span>
            <div className="rArrow">
              <i className="right_icon"></i>
            </div>
          </div>
          <div
            className="menu_item hover3"
            onClick={() => {
              logout();
            }}
          >
            <div className="small_circle">
              <i className="logout_filled_icon"></i>
            </div>
            <span>Logout</span>
          </div>
        </div>
      )}
      {visible === 1 && <DigitalAccessibility setVisible={setVisible} />}
    </div>
  );
};

export default UserMenu;
