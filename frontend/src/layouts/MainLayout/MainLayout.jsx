import { Outlet } from "react-router-dom";

import Navbar from "../../components/layout/NavBar/Navbar";
import Footer from "../../components/layout/Footer/Footer";

import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default MainLayout;