import './EpicPipeline.css';
import EpicSectionHead from '../EpicSectionHead/EpicSectionHead';

const PIPELINE_STEPS = [
  {
    n: '01',
    title: 'Captura',
    text: 'A EPIC regista o disco solar da Terra em 10 bandas espectrais, do ultravioleta ao infravermelho próximo.',
  },
  {
    n: '02',
    title: 'Downlink',
    text: 'Os dados são transmitidos do L1 para estações terrestres da NOAA, a cerca de 1,5 milhões de quilómetros de distância.',
  },
  {
    n: '03',
    title: 'Processamento',
    text: 'Os canais são calibrados e combinados num composto de cor natural, com coordenadas e hora associadas.',
  },
  {
    n: '04',
    title: 'Publicação',
    text: 'A EPIC API expõe cada captura como registo JSON, com ligação direta à imagem em alta resolução.',
  },
];

export default function EpicPipeline() {
  return (
    <section id="pipeline-wrap">
      <EpicSectionHead
        eyebrow="Do espaço ao ecrã"
        title="Como uma imagem chega até aqui"
        sub="Quatro etapas reais entre a captura em órbita e o pixel que vês no visualizador abaixo."
        style={{ paddingTop: 10 }}
      />
      <div className="pipeline">
        {PIPELINE_STEPS.map((step) => (
          <div className="step" key={step.n}>
            <div className="n">{step.n}</div>
            <h4>{step.title}</h4>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
