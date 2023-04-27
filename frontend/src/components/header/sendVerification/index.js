import { useState } from "react";
import axios from "axios";
import "./style.css";

const SendVerification = ({ user }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendVerificationLink = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/sendVerification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSuccess(data.message);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="send_verification">
      <span>
        Your account is not verified. Verify your account before it gets deleted
        after a month from creating.
      </span>
      <p
        onClick={() => {
          sendVerificationLink();
        }}
      >
        Click here to resend verification link.
      </p>
      {success && <div className="success_text">{success}</div>}
      {error && <div className="error_text">{error}</div>}
    </div>
  );
};

export default SendVerification;
