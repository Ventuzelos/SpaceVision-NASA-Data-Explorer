import { useState } from "react";
import { Link } from "react-router-dom";
import { Icons } from "../../../constants/icons";
import SearchInput from "../../common/SearchInput/SearchInput";
import heroImage from "../../../assets/astronaut_nasa.jpg";
import { searchablePages } from "../../../constants/searchPages";

import "../../common/Button/Button.css";
import "./Hero.css";

const searchIcons = {
  image: Icons.Image,
  sun: Icons.Sun,
  earth: Icons.Globe,
  meteor: Icons.Satellite,
};

function Hero() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPages = searchablePages.filter((page) => {
    const searchValue = searchTerm.toLowerCase().trim();

    if (!searchValue) return false;

    return (
      page.title.toLowerCase().includes(searchValue) ||
      page.subtitle.toLowerCase().includes(searchValue) ||
      page.keywords.some((keyword) => keyword.includes(searchValue))
    );
  });

  return (
    <section
      className="hero"
      style={{ "--hero-image": `url(${heroImage})` }}
    >
      <div className="hero__overlay">
        <div className="container hero__container">
          <div className="hero__content">
            {/* Linha 1 */}
            <span className="hero__welcome-text">Bem-vindo ao</span>
            
            {/* Linha 2 - H1 com texto em maiúsculas */}
            <h1 className="hero__title">SPACE VISION</h1>
            
            {/* Linha 3 - Descrição */}
            <p className="hero__description">
              Imagens, missões e descobertas do espaço, tudo num só lugar.
              Uma forma interativa e educativa de explorar o Universo.
            </p>

            {/* Secção de Pesquisa */}
            <div className="hero__search">
              <SearchInput
                placeholder="Pesquisar imagens, missões ou planetas..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />

              {filteredPages.length > 0 && (
                <div className="hero__search-results">
                  {filteredPages.map((page) => {
                    const Icon = searchIcons[page.icon];

                    return (
                      <Link
                        key={page.path}
                        to={page.path}
                        className="hero__search-result"
                      >
                        <div className="hero__search-result-header">
                          {Icon && (
                            <Icon
                              className="hero__search-result-icon"
                              size={18}
                            />
                          )}
                          <strong>{page.title}</strong>
                        </div>

                        <span>{page.subtitle}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Nova Secção de Estatísticas (Posicionada corretamente) */}
            <div className="hero__stats">
              <div className="hero__stat-item">
                <span className="hero__stat-number">4</span>
                <span className="hero__stat-label">APIS DA NASA</span>
              </div>
              
              <div className="hero__stat-item">
                <span className="hero__stat-number">&infin;</span>
                <span className="hero__stat-label">OBJETOS CÓSMICOS</span>
              </div>
              
              <div className="hero__stat-item">
                <span className="hero__stat-number">24/7</span>
                <span className="hero__stat-label">DADOS AO VIVO</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
