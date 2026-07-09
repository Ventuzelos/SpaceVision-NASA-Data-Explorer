import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout/MainLayout";

import Home from "./pages/Home/Home";
import APOD from "./pages/APOD/APOD";
import DONKI from "./pages/DONKI/DONKI";
import EPIC from "./pages/EPIC/EPIC";
import Favorites from "./pages/Favorites/Favorites";
import NotFound from "./pages/NotFound/NotFound";
import About from "./pages/About/About";


import NeoWS from "./pages/NEOWATCH/NeoWS";
import Login from "./pages/Login/Login";      
import Register from "./pages/Register/Register"; 
import Admin from "./pages/Admin/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="apod" element={<APOD />} />
          <Route path="donki" element={<DONKI />} />
          <Route path="epic" element={<EPIC />} />
          <Route path="neowatch" element={<NeoWS />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="login" element={<Login />} />   
          <Route path="register" element={<Register />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;