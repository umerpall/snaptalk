import { Formik, Form } from "formik";
import * as Yup from "yup";
import { LoginInput } from "../../components/inputs/loginInput";
import { useState } from "react";
import { Link } from "react-router-dom";
import SyncLoader from "react-spinners/SyncLoader";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const loginInfos = {
  email: "",
  password: "",
};

export const LoginForm = ({ setVisible }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, setLogin] = useState(loginInfos);
  const { email, password } = login;

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const loginValidation = Yup.object({
    email: Yup.string()
      .required("Email address is required")
      .email("Must be a valid email"),
    password: Yup.string().required("Password is required"),
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const loginSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          email,
          password,
        }
      );
      const { message, ...rest } = data;
      dispatch({ type: "LOGIN", payload: rest });
      Cookies.set("user", JSON.stringify(rest));
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="login_wrap">
      <div className="login_1">
        <img src="../../icons/snaptalk.svg" alt="SnapTalk" />
        <span>Sharing Your Vision</span>
      </div>
      <div className="login_2">
        <div className="login_2_wrap">
          <Formik
            enableReinitialize
            initialValues={{
              email,
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
                  name="email"
                  placeholder="Email address"
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
          <Link to="/reset" className="forgot_password">
            Forgotten Password?
          </Link>
          <SyncLoader color="#1876f2" loading={loading} size={7} />
          {error && <div className="error_text">{error}</div>}
          <div className="sign_splitter"></div>
          <button
            className="yellow_btn open_signup"
            onClick={() => setVisible(true)}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};
