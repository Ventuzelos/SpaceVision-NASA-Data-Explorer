import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home/Home";
import APOD from "./pages/APOD/APOD";
import MarsRover from "./pages/MarsRover/MarsRover";
import EPIC from "./pages/EPIC/EPIC";
import Favorites from "./pages/Favorites/Favorites";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/apod" element={<APOD />} />
          <Route path="/mars-rover" element={<MarsRover />} />
          <Route path="/epic" element={<EPIC />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;