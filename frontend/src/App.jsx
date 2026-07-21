import {
  lazy,
  Suspense,
} from "react";

import {
  Routes,
  Route,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import MainLayout from "./layouts/MainLayout/MainLayout";
import LoginLayout from "./layouts/MainLayout/LoginLayout";

const Home = lazy(() => import("./pages/Home/Home"));
const DONKI = lazy(() => import("./pages/DONKI/DONKI"));
const Epic = lazy(() => import("./pages/Epic/Epic"));
const DISCOVR = lazy(
  () => import("./pages/DISCOVR/DISCOVR")
);
const Quiz = lazy(() => import("./pages/Quiz/Quiz"));
const Favorites = lazy(
  () => import("./pages/Favorites/Favorites")
);
const NotFound = lazy(
  () => import("./pages/NotFound/NotFound")
);
const About = lazy(() => import("./pages/About/About"));
const FAQ = lazy(() => import("./pages/FAQ/FAQ"));
const Cookies = lazy(
  () => import("./pages/Cookies/Cookies")
);
const NeoWS = lazy(
  () => import("./pages/NEOWATCH/NeoWS")
);
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(
  () => import("./pages/Register/Register")
);
const ForgotPassword = lazy(
  () =>
    import("./pages/ForgotPassword/ForgotPassword")
);
const ResetPassword = lazy(
  () =>
    import("./pages/ResetPassword/ResetPassword")
);
const Profile = lazy(
  () => import("./pages/Profile/Profile")
);
const Admin = lazy(() => import("./pages/Admin/Admin"));
const Unauthorized = lazy(
  () => import("./pages/Unauthorized/Unauthorized")
);
const Terms = lazy(
  () => import("./pages/Legal/Terms/Terms")
);
const Privacy = lazy(
  () => import("./pages/Legal/Privacy/Privacy")
);
const Accessibility = lazy(
  () =>
    import("./pages/Accessibility/Accessibility")
);

function PageLoader() {
  return (
    <main
      className="page-loader"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="page-loader__spinner"
        aria-hidden="true"
      />

      <p>A carregar página...</p>
    </main>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />

          <Route
            path="donki"
            element={<DONKI />}
          />

          <Route
            path="epic"
            element={<Epic />}
          />

          <Route
            path="discover"
            element={<DISCOVR />}
          />

          <Route
            path="quiz"
            element={<Quiz />}
          />

          <Route
            path="neowatch"
            element={<NeoWS />}
          />

          <Route
            path="nao-autorizado"
            element={<Unauthorized />}
          />

          <Route
            path="about"
            element={<About />}
          />

          <Route
            path="faq"
            element={<FAQ />}
          />

          <Route
            path="termos"
            element={<Terms />}
          />

          <Route
            path="privacidade"
            element={<Privacy />}
          />

          <Route
            path="cookies"
            element={<Cookies />}
          />

          <Route
            path="accessibility"
            element={<Accessibility />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="profile"
              element={<Profile />}
            />

            <Route
              path="favorites"
              element={<Favorites />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute adminOnly />
            }
          >
            <Route
              path="admin"
              element={<Admin />}
            />
          </Route>

          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>

        <Route element={<LoginLayout />}>
          <Route
            path="login"
            element={<Login />}
          />

          <Route
            path="register"
            element={<Register />}
          />

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
    </Suspense>
  );
}

export default App;