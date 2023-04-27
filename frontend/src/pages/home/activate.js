import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../../components/CreatePost";
import { Header } from "../../components/header";
import ActivateForm from "./ActivateForm";
import axios from "axios";
import "./style.css";
import Cookies from "js-cookie";

export const Activate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((user) => ({ ...user }));
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useParams();

  const activateAccount = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/activate`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSuccess(data.message);
      dispatch({ type: "VERIFY", payload: true });
      Cookies.set("user", JSON.stringify({ ...user, verified: true }));
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  useEffect(() => {
    activateAccount();
  }, []);

  return (
    <div>
      {success && (
        <ActivateForm
          type="success"
          header="Account Verification successfull"
          text={success}
          loading={loading}
        />
      )}
      {error && (
        <ActivateForm
          type="error"
          header="Account Verification failed"
          text={error}
          loading={loading}
        />
      )}
      <Header />
      <div className="main_home_area">
        <div className="left_home">
          <CreatePost user={user} />
        </div>
        <div className="right_home"></div>
      </div>
    </div>
  );
};
