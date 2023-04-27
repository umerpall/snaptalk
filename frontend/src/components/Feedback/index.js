import { useState } from "react";
import axios from "axios";
import "./style.css";

const Feedback = ({ setShowFeedback, user, token }) => {
  const [feedback, setFeedback] = useState("");
  const feedbackHandler = async () => {
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/feedback`,
      {
        feedback,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setShowFeedback(false);
  };
  return (
    <div className="blur">
      <div className="feedback_box">
        <div>
          <div className="feedback_header">Give us feedback</div>
          <i className="exit_icon" onClick={() => setShowFeedback(false)}></i>
        </div>
        <div className="feedback_text">
          Please give us some feedback to improve the SnapTalk better.
        </div>
        <div className="textarea_box">
          <textarea
            onChange={(e) => setFeedback(e.target.value)}
            className="feedback_msg"
          ></textarea>
        </div>
        <div className="feedback_btns">
          <button className="gray_btn" onClick={() => setShowFeedback(false)}>
            Cancel
          </button>
          <button
            type="submit"
            className="yellow_btn"
            onClick={() => feedbackHandler()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
