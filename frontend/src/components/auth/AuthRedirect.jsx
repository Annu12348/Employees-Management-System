import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../utils/axios";

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await instance.get("/auth/me", {
          withCredentials: true,
        });

        navigate("/dashboard", {
          replace: true,
        });
      } catch (error) {
        navigate("/login", {
          replace: true,
        });
      }
    };

    checkAuth();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default AuthRedirect;
