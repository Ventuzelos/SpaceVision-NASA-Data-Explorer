import { Link } from "react-router-dom";
import Button from "../../common/Button/Button";
import heroImage from "../../../assets/hero2.jpg";
import SearchInput from "../../common/SearchInput/SearchInput";

import "./Hero.css";

function Hero() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero__overlay">
        <div className="container hero__container">

          <div className="hero__content">

            <h1 className="hero__title">
              Explora o Universo com dados reais da NASA
            </h1>

            <p className="hero__description">
              Imagens, missões e descobertas do espaço, tudo num só lugar.
              Uma forma interativa e educativa de explorar o Universo.
            </p>
            
             <SearchInput placeholder="Pesquisar imagens, missões ou planetas..." />

            <div className="hero__actions">
              <Link to="/apod">
                <Button>
                  Explorar APOD
                </Button>
              </Link>

              <Link to="/donki">
                <Button variant="secondary">
                  DONKI
                </Button>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;