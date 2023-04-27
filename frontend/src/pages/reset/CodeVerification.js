import { Formik, Form } from "formik";
import { LoginInput } from "../../components/inputs/loginInput";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";

const CodeVerification = ({
  code,
  setCode,
  error,
  setError,
  loading,
  setLoading,
  setVisible,
  userInfos,
}) => {
  const validateCode = Yup.object({
    code: Yup.string()
      .required("Code is required")
      .min("5", "Code must be 5 characters.")
      .max("5", "Code must be 5 characters."),
  });
  const verifyCode = async () => {
    try {
      setLoading(true);
      const { email } = userInfos;
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/validateResetCode`,
        {
          email,
          code,
        }
      );
      setError("");
      setLoading(false);
      setVisible(3);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="reset_form">
      <div className="reset_form_header">Code Verification</div>
      <div className="reset_form_text">
        Please enter the code that has been sent to you email.
      </div>
      <Formik
        enableReinitialize
        initialValues={{ code }}
        validationSchema={validateCode}
        onSubmit={() => {
          verifyCode();
        }}
      >
        {(formik) => (
          <Form>
            <LoginInput
              type="text"
              name="code"
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code..."
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

export default CodeVerification;
