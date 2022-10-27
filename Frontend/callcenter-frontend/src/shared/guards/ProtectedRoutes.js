import { Login } from "@mui/icons-material";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const user = {loggedIn: true};
  return user && user.loggedIn;
}

const ProtectedRoutes = () => {
  const isAuth = localStorage.getItem('loggedIn');
  return isAuth ? <Outlet /> : <Navigate to="/" />; 

}

export default ProtectedRoutes;