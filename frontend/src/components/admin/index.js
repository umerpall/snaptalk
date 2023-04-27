import "./style.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { LoginInput } from "../../components/inputs/loginInput";
import { useState } from "react";
import { Link } from "react-router-dom";
import SyncLoader from "react-spinners/SyncLoader";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const { username, password } = login;

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const loginValidation = Yup.object({
    username: Yup.string().required("Admin username is required"),
    password: Yup.string().required("Password is required"),
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/admin/login`,
        {
          username,
          password,
        }
      );
      Cookies.set("admin", JSON.stringify(data));
      navigate("/admin/home");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="login_wrap admin_login">
      <div className="login_1">
        <span>Admin Panel</span>
      </div>
      <div className="login_2">
        <div className="login_2_wrap">
          <Formik
            enableReinitialize
            initialValues={{
              username,
              password,
            }}
            validationSchema={loginValidation}
            onSubmit={() => {
              loginSubmit();
            }}
          >
            {(formik) => (
              <Form>
                <LoginInput
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleLoginChange}
                />
                <LoginInput
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  onChange={handleLoginChange}
                  bottom
                />
                <button type="submit" className="yellow_btn">
                  Log In
                </button>
              </Form>
            )}
          </Formik>
          <SyncLoader color="#1876f2" loading={loading} size={7} />
          {error && <div className="error_text">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Admin;
