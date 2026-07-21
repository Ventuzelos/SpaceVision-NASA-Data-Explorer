import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import MainLayout from "./layouts/MainLayout/MainLayout";
import LoginLayout from "./layouts/MainLayout/LoginLayout";

import Home from "./pages/Home/Home";
import DONKI from "./pages/DONKI/DONKI";
import Epic from "./pages/Epic/Epic";
import DISCOVR from "./pages/DISCOVR/DISCOVR";
import Quiz from "./pages/Quiz/Quiz";
import Favorites from "./pages/Favorites/Favorites";
import NotFound from "./pages/NotFound/NotFound";
import About from "./pages/About/About";
import FAQ from "./pages/FAQ/FAQ";
import Cookies from "./pages/Cookies/Cookies";

import NeoWS from "./pages/NEOWATCH/NeoWS";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

import Profile from "./pages/Profile/Profile";
import Admin from "./pages/Admin/Admin";
import Unauthorized from "./pages/Unauthorized/Unauthorized";


import CookieConsent from "./components/common/CookieConsent/CookieConsent";

import Terms from "./pages/Legal/Terms/Terms";
import Privacy from "./pages/Legal/Privacy/Privacy";
import Accessibility from "./pages/Accessibility/Accessibility";

function App() {
  return (
    <>
      <CookieConsent />

    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="donki" element={<DONKI />} />
        <Route path="epic" element={<Epic />} />
        <Route path="discover" element={<DISCOVR />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="neowatch" element={<NeoWS />} />
        <Route
          path="nao-autorizado"
          element={<Unauthorized />}
        />

        <Route path="about" element={<About />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="termos" element={<Terms />} />
        <Route
          path="privacidade"
          element={<Privacy />}
        />
        <Route path="cookies" element={<Cookies />} />
        <Route
          path="accessibility"
          element={<Accessibility />}
        />

        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<Profile />} />
          <Route path="favorites" element={<Favorites />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<LoginLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="reset-password"
          element={<ResetPassword />}
        />
      </Route>
    </Routes>

    </>
  );
}

export default App;
