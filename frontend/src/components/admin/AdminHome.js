import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ViewFeedback from "./ViewFeedback";
import ViewSingleUser from "./ViewSingleUser";

const AdminHome = () => {
  const navigate = useNavigate();
  const [singleUserRecord, setSingleUserRecord] = useState([]);
  const [showSingleFeedback, setShowSingleFeedback] = useState(0);

  const logouthandler = () => {
    Cookies.set("admin", "");
    navigate("/admin");
  };
  return (
    <div className="admin_home">
      <header>
        <div className="left_admin">
          <h2>Admin Panel</h2>
        </div>
        <div className="right_admin">
          <button className="yellow_btn" onClick={() => logouthandler()}>
            Logout
          </button>
        </div>
      </header>
      {showSingleFeedback === 0 && (
        <ViewFeedback
          setShowSingleFeedback={setShowSingleFeedback}
          setSingleUserRecord={setSingleUserRecord}
        />
      )}
      {showSingleFeedback === 1 && (
        <ViewSingleUser
          setShowSingleFeedback={setShowSingleFeedback}
          singleUserRecord_feedbacks={singleUserRecord.feedbacks}
          user={singleUserRecord.user}
          type={singleUserRecord.type}
        />
      )}
    </div>
  );
};

export default AdminHome;
