import { Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import Admin from "../components/admin";

const AdminLoggedInRoutes = () => {
  const admin = Cookies.get("admin");
  return admin ? <Outlet /> : <Admin />;
};

export default AdminLoggedInRoutes;
