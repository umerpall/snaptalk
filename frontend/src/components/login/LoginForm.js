import { Formik, Form } from "formik";
import * as Yup from "yup";
import { LoginInput } from "../../components/inputs/loginInput";
import { useState } from "react";
import { Link } from "react-router-dom";

const loginInfos = {
  email: "",
  password: "",
};

export const LoginForm = () => {
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
          <Link to="/forgot" className="forgot_password">
            Forgotten Password?
          </Link>
          <div className="sign_splitter"></div>
          <button className="yellow_btn open_signup">Create Account</button>
        </div>
        <Link to="/" className="sign_extra">
          <b>Create a page </b>
          for a celebrity, brand or business.
        </Link>
      </div>
    </div>
  );
};
