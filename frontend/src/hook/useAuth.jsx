import { useDispatch } from "react-redux";
import { logoutApi } from "../api/Auth";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/reducer/authSlice";
import { persistor } from "../redux/store";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await logoutApi();
      dispatch(setUser(null));
      persistor.purge();
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return { logout };
};
