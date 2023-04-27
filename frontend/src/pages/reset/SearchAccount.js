import { Formik, Form } from "formik";
import { LoginInput } from "../../components/inputs/loginInput";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";

const SearchAccount = ({
  email,
  setEmail,
  error,
  setError,
  setLoading,
  setVisible,
  setUserInfos,
}) => {
  const validateEmail = Yup.object({
    email: Yup.string().required("Email address is required."),
  });

  const handleSearch = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/findUser`,
        {
          email,
        }
      );
      setUserInfos(data);
      setVisible(1);
      setError("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="reset_form">
      <div className="reset_form_header">Find Your Account</div>
      <div className="reset_form_text">
        Please enter your email address to search for your Account.
      </div>
      <Formik
        enableReinitialize
        initialValues={{ email }}
        validationSchema={validateEmail}
        onSubmit={() => {
          handleSearch();
        }}
      >
        {(formik) => (
          <Form>
            <LoginInput
              type="text"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address..."
            />
            {error && <div className="error_text">{error}</div>}
            <div className="reset_form_btns">
              <Link to="/login" className="gray_btn">
                <p>Cancel</p>
              </Link>
              <button type="submit" className="yellow_btn">
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SearchAccount;
