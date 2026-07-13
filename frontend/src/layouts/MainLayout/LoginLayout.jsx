import { Outlet } from "react-router-dom";
import Navbar from "../../components/layout/Navbar/Navbar";

import "./LoginLayout.css";

function LoginLayout() {
  return (
    <div className="login-layout">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default LoginLayout;