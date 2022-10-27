import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuth = localStorage.getItem('loggedIn');
  return isAuth ? <Outlet /> : <Navigate to="/" />; 

}

export default ProtectedRoutes;