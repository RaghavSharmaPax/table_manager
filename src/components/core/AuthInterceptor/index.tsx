import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { setupInterceptor } from "../../../api/axiosController";
import { useAppDispatch } from "../../../redux/hooks";

/**
 * sets up the interceptor by sending the navigate function
 * @returns Outlet for the children components to be rendered
 */
const AuthInterceptor = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    setupInterceptor(navigate, dispatch);
  }, [navigate, dispatch]);
  return <Outlet />;
};

export default AuthInterceptor;
