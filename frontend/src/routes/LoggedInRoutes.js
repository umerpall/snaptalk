import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Login } from "../pages/login";

const LoggedInRoutes = () => {
  const { user } = useSelector((state) => ({ ...state }));
  return user ? <Outlet /> : <Login />;
};

export default LoggedInRoutes;
