import { Formik, Form } from "formik";
import { LoginInput } from "../../components/inputs/loginInput";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";

const ChangePassword = ({
  password,
  setPassword,
  conf_password,
  setConf_password,
  error,
  loading,
  setLoading,
  userInfos,
  setError,
}) => {
  const navigate = useNavigate();
  const validatePassword = Yup.object({
    password: Yup.string()
      .required("Enter a new Password")
      .min("6", "Password must be at least 6 characters."),
    conf_password: Yup.string()
      .required("Enter new password again.")
      .min("6", "Password must be at least 6 characters.")
      .oneOf([Yup.ref("password")], "Password must match."),
  });

  const { email } = userInfos;

  const changePassword = async () => {
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/changePassword`, {
        email,
        password,
      });
      setError("");
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="reset_form" style={{ height: "320px" }}>
      <div className="reset_form_header">Change Password</div>
      <div className="reset_form_text">Pick a strong password</div>
      <Formik
        enableReinitialize
        initialValues={{ password, conf_password }}
        validationSchema={validatePassword}
        onSubmit={() => {
          changePassword();
        }}
      >
        {(formik) => (
          <Form>
            <LoginInput
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a New password..."
            />
            <LoginInput
              type="password"
              name="conf_password"
              onChange={(e) => setConf_password(e.target.value)}
              placeholder="Confirm the New password..."
            />
            {error && <div className="error_text">{error}</div>}
            <div className="reset_form_btns">
              <Link to="/login" className="gray_btn">
                <p>Cancel</p>
              </Link>
              <button type="submit" className="yellow_btn">
                Continue
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePassword;
