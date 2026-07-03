import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/NavBar/Navbar";
import Footer from "../components/layout/Footer/Footer";

function MainLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default MainLayout;