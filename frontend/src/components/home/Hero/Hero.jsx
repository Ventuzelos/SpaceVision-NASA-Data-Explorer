import { useState } from "react";
import { Link } from "react-router-dom";
import { Icons } from "../../../constants/icons";
import SearchInput from "../../common/SearchInput/SearchInput";
import heroImage from "../../../assets/hero.webp";
import { searchablePages } from "../../../constants/searchPages";

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
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;