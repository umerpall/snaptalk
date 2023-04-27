import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const AdminNotLoggedInRoutes = () => {
  const admin = Cookies.get("admin");
  return admin ? <Navigate to="/admin/home" /> : <Outlet />;
};

export default AdminNotLoggedInRoutes;
