import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../utils/axios";

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const ProtectedRoutesApi = async () => {
    try {
      await instance.get("/auth/me", {
        withCredentials: true,
      });

      setLoading(false);
    } catch (error) {
      console.error(error);
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    ProtectedRoutesApi();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoutes;
