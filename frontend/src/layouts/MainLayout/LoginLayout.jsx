import { Outlet } from "react-router";
import Navbar from "../../components/layout/Navbar/Navbar";
import BackToTop from "../../components/common/BackToTop/BackToTop";

import "./LoginLayout.css";

function LoginLayout() {
  return (
    <div className="login-layout">
      <Navbar />
      <Outlet />
      <BackToTop />
    </div>
  );
}

export default LoginLayout;