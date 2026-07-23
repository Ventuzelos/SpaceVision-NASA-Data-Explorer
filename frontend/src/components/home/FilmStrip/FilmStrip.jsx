import { useMemo } from "react";

import "./FilmStrip.css";

const FRAMES = [
  "https://images.unsplash.com/photo-1465101162946-4377e57745c3?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  "https://images.pexels.com/photos/37761980/pexels-photo-37761980.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.unsplash.com/photo-1477005264461-b0e201668d92?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  "https://images.unsplash.com/photo-1464802686167-b939a6910659?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  "https://images.pexels.com/photos/20881655/pexels-photo-20881655.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.unsplash.com/photo-1495239423169-a795244fddcc?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  "https://images.pexels.com/photos/4233216/pexels-photo-4233216.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.unsplash.com/photo-1459909633680-206dc5c67abb?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
];

function FilmStrip() {
  const reelFrames = useMemo(() => [...FRAMES, ...FRAMES], []);

  return (
    <section className="film-strip">
      <div className="container film-strip__header">
        <p className="film-strip__eyebrow">Arquivo visual</p>
        <h2 className="film-strip__title">O cosmos, fotograma a fotograma.</h2>
      </div>

      <div className="film-strip__reel" aria-hidden="true">
        <div className="film-strip__track">
          {reelFrames.map((src, index) => (
            <div className="film-strip__frame" key={`${src}-${index}`}>
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FilmStrip;
