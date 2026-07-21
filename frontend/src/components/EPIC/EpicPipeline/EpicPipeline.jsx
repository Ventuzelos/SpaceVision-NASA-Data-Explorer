import "./EpicPipeline.css";
import EpicSectionHead from "../EpicSectionHead/EpicSectionHead";

const PIPELINE_STEPS = [
  {
    number: "01",
    title: "Captura",
    text: "A EPIC regista o disco solar da Terra em 10 bandas espectrais, do ultravioleta ao infravermelho próximo.",
  },
  {
    number: "02",
    title: "Downlink",
    text: "Os dados são transmitidos do L1 para estações terrestres da NOAA, a cerca de 1,5 milhões de quilómetros de distância.",
  },
  {
    number: "03",
    title: "Processamento",
    text: "Os canais são calibrados e combinados num composto de cor natural, com coordenadas e hora associadas.",
  },
  {
    number: "04",
    title: "Publicação",
    text: "A EPIC API expõe cada captura como registo JSON, com ligação direta à imagem em alta resolução.",
  },
];

export default function EpicPipeline() {
  return (
    <section
      id="pipeline"
      className="epic-pipeline-section"
      aria-labelledby="epic-pipeline-title"
    >
      <EpicSectionHead
        id="epic-pipeline-title"
        title="Como uma imagem chega até aqui"
        sub="Quatro etapas reais entre a captura em órbita e o pixel que vês no visualizador abaixo."
      />

      <ol className="epic-pipeline">
        {PIPELINE_STEPS.map((step) => (
          <li
            className="epic-pipeline__step"
            key={step.number}
          >
            <span
              className="epic-pipeline__number"
              aria-hidden="true"
            >
              {step.number}
            </span>

            <h3 className="epic-pipeline__title">
              {step.title}
            </h3>

            <p className="epic-pipeline__description">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}