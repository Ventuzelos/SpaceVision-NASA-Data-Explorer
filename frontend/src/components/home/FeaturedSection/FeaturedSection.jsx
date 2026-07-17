import FeaturedCard from "./FeaturedCard/FeaturedCard";
import featuredImage from "../../../assets/hero2.jpg";

import "./FeaturedSection.css";

function FeaturedSection() {
  return (
    <section className="featured-section">
      <div className="container featured-section__container">
        <h2 className="featured-section__title">
          Destaque do dia
        </h2>

        <FeaturedCard
          image={featuredImage}
          title="Astronomy Picture of the Day"
          description="Descobre uma imagem selecionada pela NASA e conhece a história por detrás desta observação do Universo."
          date="05 Jul 2026"
          link="/"
        />
      </div>
    </section>
  );
}

export default FeaturedSection;