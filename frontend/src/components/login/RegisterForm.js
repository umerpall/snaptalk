import { Form, Formik } from "formik";
import { useState } from "react";
import { RegisterInput } from "../inputs/registerInput";
import * as Yup from "yup";
import { DateOfBirthSelect } from "./DateOfBirthSelect";
import { GenderSelect } from "./GenderSelect";
import SyncLoader from "react-spinners/SyncLoader";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const RegisterForm = ({ setVisible }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userInfos = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    bYear: new Date().getFullYear(),
    bMonth: new Date().getMonth() + 1,
    bDay: new Date().getDate(),
    gender: "",
  };
  const [user, setUser] = useState(userInfos);
  const {
    first_name,
    last_name,
    email,
    password,
    bYear,
    bMonth,
    bDay,
    gender,
  } = user;
  const tempYear = new Date().getFullYear();
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const years = Array.from(new Array(108), (val, index) => tempYear - index);
  const months = Array.from(new Array(12), (val, index) => 1 + index);
  const getDays = () => {
    return new Date(bYear, bMonth, 0).getDate();
  };
  const days = Array.from(new Array(getDays()), (val, index) => 1 + index);

  const registerValidation = Yup.object({
    first_name: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters.")
      .matches(/^[aA-zZ\s]+$/, "Numbers & Special characters are not allowed."),
    last_name: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters.")
      .matches(/^[aA-zZ\s]+$/, "Numbers & Special characters are not allowed."),
    email: Yup.string()
      .required("Email address is required.")
      .email("Enter a valid email address."),
    password: Yup.string()
      .required(
        "Enter a combination of at least 6 characters including numbers, letters & special characters."
      )
      .min(6, "Password should be at least 6 characters."),
  });

  const [dateError, setDateError] = useState("");
  const [genderError, setGenderError] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const registerSubmit = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/register`,
        {
          first_name,
          last_name,
          email,
          password,
          bYear,
          bMonth,
          bDay,
          gender,
        }
      );
      setError("");
      setSuccess(data.message);
      const { message, ...rest } = data;
      setTimeout(() => {
        dispatch({ type: "LOGIN", payload: rest });
        Cookies.set("user", JSON.stringify(rest));
        navigate("/");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setSuccess("");
      setError(error.response.data.message);
    }
  };

  return (
    <div className="blur">
      <div className="register">
        <div className="register_header">
          <i className="exit_icon" onClick={() => setVisible(false)}></i>
          <span>Sign Up</span>
          <span>Its quick & easy</span>
        </div>
        <Formik
          enableReinitialize
          initialValues={{
            first_name,
            last_name,
            email,
            password,
            bYear,
            bMonth,
            bDay,
            gender,
          }}
          validationSchema={registerValidation}
          onSubmit={() => {
            let current_date = new Date();
            let picket_date = new Date(bYear, bMonth - 1, bDay);
            let atleast14 = new Date(1970 + 14, 0, 1);

            if (current_date - picket_date < atleast14) {
              setDateError(
                "Looks like you are under 14. Minimum age requirement for creating account is 14."
              );
            } else if (gender === "") {
              setDateError("");
              setGenderError("Please choose a gender.");
            } else {
              setDateError("");
              setGenderError("");
              registerSubmit();
            }
          }}
        >
          {(formik) => (
            <Form className="register_form">
              <div className="reg_line">
                <RegisterInput
                  type="text"
                  placeholder="First Name"
                  name="first_name"
                  onChange={handleRegisterChange}
                />
                <RegisterInput
                  type="text"
                  placeholder="Last Name"
                  name="last_name"
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="reg_line">
                <RegisterInput
                  type="email"
                  placeholder="Email address"
                  name="email"
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="reg_line">
                <RegisterInput
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="reg_col">
                <div className="reg_line_header">
                  Date of Birth <i className="info_icon"></i>
                </div>
                <DateOfBirthSelect
                  bDay={bDay}
                  bMonth={bMonth}
                  bYear={bYear}
                  days={days}
                  months={months}
                  years={years}
                  handleRegisterChange={handleRegisterChange}
                  dateError={dateError}
                />
              </div>
              <div className="reg_col">
                <div className="reg_line_header">
                  Gender <i className="info_icon"></i>
                </div>
                <GenderSelect
                  handleRegisterChange={handleRegisterChange}
                  genderError={genderError}
                />
              </div>
              <div className="reg_infos">
                By clicking Sign Up, you agree to our <span>Terms</span> &{" "}
                <span>Conditions</span>
              </div>
              {error && <div className="error_text">{error}</div>}
              {success && <div className="success_text">{success}</div>}
              <div className="reg_btn_wrapper">
                <button type="submit" className="yellow_btn open_signup">
                  Sign Up
                </button>
              </div>
              <SyncLoader color="#1876f2" loading={loading} size={7} />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
