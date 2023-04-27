import axios from "axios";
import { Link } from "react-router-dom";

const SendEmail = ({
  email,
  error,
  setError,
  setVisible,
  setUserInfos,
  userInfos,
  loading,
  setLoading,
}) => {
  const sendEmail = async (req, res) => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/sendResetPasswordCode`,
        {
          email,
        }
      );
      setError("");
      setVisible(2);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="reset_form dynamic_height">
      <div className="reset_form_header">Reset your password</div>
      <div className="reset_grid">
        <div className="reset_left">
          <div className="reset_form_text">
            Do you want to receive the code to reset your password?
          </div>
          <label htmlFor="email" className="hover1">
            <input type="radio" name="email" id="email" checked readOnly />
            <div className="label_col">
              <span>Send code via email</span>
              <span>{userInfos.email}</span>
            </div>
          </label>
        </div>
        <div className="reset_right">
          <img src={userInfos.picture} alt="Profile" />
          <span>{userInfos.email}</span>
          <span>SnapTalk User</span>
        </div>
      </div>
      {error && (
        <div className="error_text" style={{ padding: "10px" }}>
          {error}
        </div>
      )}
      <div className="reset_form_btns">
        <Link to="/login" className="gray_btn">
          <p>Not you?</p>
        </Link>
        <button
          onClick={() => {
            sendEmail();
          }}
          className="yellow_btn"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SendEmail;
