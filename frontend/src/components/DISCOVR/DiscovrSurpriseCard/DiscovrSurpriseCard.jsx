import { useState } from "react";

import Icon from "../../common/Icon/Icon";
import Button from "../../common/Button/Button";

import "./DiscovrSurpriseCard.css";

const SPACE_FACTS = [
  "Um dia em Vénus é mais longo do que um ano em Vénus.",
  "A Voyager 1 é o objeto feito pelo Homem mais distante da Terra, viajando pelo espaço interestelar desde 2012.",
  "O Monte Olimpo, em Marte, é o maior vulcão do Sistema Solar, com quase 22 km de altura.",
  "A Estação Espacial Internacional viaja a cerca de 28 000 km/h, dando a volta à Terra a cada 90 minutos.",
  "Existem mais estrelas no universo observável do que grãos de areia em todas as praias da Terra.",
  "O Telescópio Espacial James Webb consegue detetar luz de galáxias formadas há mais de 13 mil milhões de anos.",
  "Um ano em Neptuno equivale a cerca de 165 anos terrestres.",
  "A sonda New Horizons demorou mais de 9 anos a chegar a Plutão.",
  "O Sol representa 99,8% da massa total do Sistema Solar.",
  "As pegadas dos astronautas na Lua podem durar milhões de anos, porque não há vento nem água para as apagar.",
  "Saturno é tão pouco denso que, teoricamente, flutuaria num oceano de água.",
  "A luz do Sol demora cerca de 8 minutos e 20 segundos a chegar à Terra.",
];

function pickRandomFactIndex(currentIndex) {
  if (SPACE_FACTS.length <= 1) return 0;

  let nextIndex = Math.floor(Math.random() * SPACE_FACTS.length);

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * SPACE_FACTS.length);
  }

  return nextIndex;
}

function DiscovrSurpriseCard() {
  const [factIndex, setFactIndex] = useState(0);
  const [hasRevealedFact, setHasRevealedFact] = useState(false);

  function handleSurpriseMe() {
    setFactIndex((current) => pickRandomFactIndex(current));
    setHasRevealedFact(true);
  }

  return (
    <div className="discovr-surprise__card discovr-surprise__card--glass">
      <Icon name="Sparkles" size={28} className="discovr-surprise__icon" />

      <h2>Surpreenda-me!</h2>

      <p className="discovr-surprise__fact" key={factIndex}>
        {hasRevealedFact
          ? SPACE_FACTS[factIndex]
          : "Carrega no botão para descobrires um facto espacial aleatório."}
      </p>

      <Button onClick={handleSurpriseMe}>
        {hasRevealedFact ? "Outro facto" : "Surpreenda-me!"}
      </Button>
    </div>
  );
}

export default DiscovrSurpriseCard;
