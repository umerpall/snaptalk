import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  acceptRequest,
  cancelRequest,
  deleteRequest,
} from "../../functions/user";

const Card = ({ userr, type, getData }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const cancelRequestHandler = async (userId) => {
    const res = await cancelRequest(userId, user.token);
    if (res === "Success") {
      getData();
    }
  };
  const confirmHandler = async (userId) => {
    const res = await acceptRequest(userId, user.token);
    if (res === "Success") {
      getData();
    }
  };
  const deleteHandler = async (userId) => {
    const res = await deleteRequest(userId, user.token);
    if (res === "Success") {
      getData();
    }
  };
  return (
    <div className="req_card">
      <Link to={`/profile/${userr.username}`}>
        <img src={userr.picture} alt="" />
        <div className="req_name">
          {userr.first_name} {userr.last_name}
        </div>
      </Link>
      {type === "sent" ? (
        <button
          className="yellow_btn"
          onClick={() => cancelRequestHandler(userr._id)}
        >
          Cancel Request
        </button>
      ) : type === "request" ? (
        <>
          <button
            className="yellow_btn"
            onClick={() => confirmHandler(userr._id)}
          >
            Confirm
          </button>
          <button className="gray_btn" onClick={() => deleteHandler(userr._id)}>
            Delete{" "}
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Card;
