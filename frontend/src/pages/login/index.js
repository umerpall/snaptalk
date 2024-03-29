import "./style.css";
import { LoginForm } from "../../components/login/LoginForm";
import { RegisterForm } from "../../components/login/RegisterForm";
import { useState } from "react";

export const Login = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="login">
      <div className="login_wrapper">
        <LoginForm setVisible={setVisible} />
        {visible && <RegisterForm setVisible={setVisible} />}
      </div>
    </div>
  );
};
