import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import SearchAccount from "./SearchAccount";
import { useState } from "react";
import SendEmail from "./SendEmail";
import CodeVerification from "./CodeVerification.js";
import ChangePassword from "./ChangePassword";

const Reset = () => {
  const dispatch = useDispatch;
  const navigate = useNavigate;
  const [visible, setVisible] = useState(0);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [conf_password, setConf_password] = useState("");
  const [error, setError] = useState("");
  const [userInfos, setUserInfos] = useState("");
  const logout = () => {
    Cookies.set("user", "");
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
  };
  const { user } = useSelector((state) => ({ ...state }));
  return (
    <div className="reset">
      <div className="reset_header">
        <Link to="/">
          <img src="../../../icons/snaptalk.svg" alt="Logo" />
        </Link>
        {user ? (
          <div className="right_reset">
            <Link to="/profile">
              <img src={user.picture} alt="Profile" />
            </Link>
            <button
              onClick={() => {
                logout();
              }}
              className="yellow_btn"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="right_reset">
            <button className="yellow_btn">Login</button>
          </Link>
        )}
      </div>
      <div className="reset_wrap">
        {visible === 0 && (
          <SearchAccount
            email={email}
            setEmail={setEmail}
            error={error}
            setError={setError}
            setLoading={setLoading}
            setVisible={setVisible}
            setUserInfos={setUserInfos}
          />
        )}
        {visible === 1 && userInfos && (
          <SendEmail
            email={email}
            userInfos={userInfos}
            error={error}
            setError={setError}
            setLoading={setLoading}
            setVisible={setVisible}
            setUserInfos={setUserInfos}
            loading={loading}
          />
        )}
        {visible === 2 && (
          <CodeVerification
            user={user}
            error={error}
            code={code}
            setCode={setCode}
            setError={setError}
            setLoading={setLoading}
            setVisible={setVisible}
            loading={loading}
            userInfos={userInfos}
          />
        )}
        {visible === 3 && (
          <ChangePassword
            password={password}
            conf_password={conf_password}
            setPassword={setPassword}
            setConf_password={setConf_password}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
            userInfos={userInfos}
          />
        )}
      </div>
    </div>
  );
};

export default Reset;
