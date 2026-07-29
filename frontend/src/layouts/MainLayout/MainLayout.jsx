import { Outlet } from "react-router";

import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import BackToTop from "../../components/common/BackToTop/BackToTop";
import SpaceVisionAssistant from "../../components/SpaceVisionAssistant/SpaceVisionAssistant";

import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />

      <Outlet />

      <Footer />

      <SpaceVisionAssistant />
      <BackToTop />
    </div>
  );
}

export default MainLayout;