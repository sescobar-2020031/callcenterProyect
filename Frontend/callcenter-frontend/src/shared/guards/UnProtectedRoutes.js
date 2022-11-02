import { Navigate, Outlet } from "react-router-dom";

const UnProtectedRoutes = () => {
  const isAuth = localStorage.getItem('loggedIn');
  return isAuth ?  <Navigate to="/homePage" /> : <Outlet />;
};

export default UnProtectedRoutes;