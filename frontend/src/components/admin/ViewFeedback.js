import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const ViewFeedback = ({ setSingleUserRecord, setShowSingleFeedback }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  useEffect(() => {
    getFeedback();
  }, []);
  const getFeedback = async () => {
    let token = Cookies.get("admin");
    let adminToken = token.substring(1, token.length - 1);
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/viewFeedback`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    setFeedbacks(data);
  };

  const feedbackHandler = (feedbackUserId) => {
    const newFeedback = feedbacks.find(
      (feedback) => feedback.user._id === feedbackUserId
    );
    setSingleUserRecord({
      feedbacks: newFeedback.feedbacks,
      user: newFeedback.user,
      type: "feedback",
    });
    setShowSingleFeedback(1);
  };

  const logHandler = (logUserId) => {
    const newFeedback = feedbacks.find(
      (feedback) => feedback.user._id === logUserId
    );
    setSingleUserRecord({
      feedbacks: newFeedback.logs,
      user: newFeedback.user,
      type: "log",
    });
    setShowSingleFeedback(1);
  };
  console.log(feedbacks);
  return (
    <div className="feedback_users_list">
      <div className="users_list">
        {feedbacks.map((feedback, i) => (
          <div className="single_user" key={i}>
            <div>
              <img src={feedback.user.picture} alt="feedback" />
            </div>
            <div className="admin_home_layout">
              <div>
                {feedback.user.first_name} {feedback.user.last_name}
              </div>
              <div className="admin_btn">
                {feedback.feedbacks.length ? (
                  <button
                    className="yellow_btn"
                    onClick={() => feedbackHandler(feedback.user._id)}
                  >
                    Feedback ({feedback.feedbacks.length})
                  </button>
                ) : (
                  ""
                )}
                <button
                  className="yellow_btn"
                  onClick={() => logHandler(feedback.user._id)}
                >
                  Log
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewFeedback;
