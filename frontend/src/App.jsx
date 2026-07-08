import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout/MainLayout";

import Home from "./pages/Home/Home";
import APOD from "./pages/APOD/APOD";
import DONKI from "./pages/DONKI/DONKI";
import EPIC from "./pages/EPIC/EPIC";
import Favorites from "./pages/Favorites/Favorites";
import NotFound from "./pages/NotFound/NotFound";
import About from "./pages/About/About";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="apod" element={<APOD />} />
          <Route path="donki" element={<DONKI />} />
          <Route path="epic" element={<EPIC />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;