import { useState, useEffect } from 'react';
import './EPIC.css';
import { NASA_API_KEY } from '../../services/api';
import { useEpicPhotos } from '../../hooks/useEpicPhotos';
import EpicPanel from './EpicPanel';
import EpicDetail from './EpicDetail';
import EpicDateControls from './EpicDateControls';
import EpicHeroVideo from '../../components/EPIC/EpicHeroVideo';
import EpicTimeline from '../../components/EPIC/EpicTimeline';

export default function EPIC() {
  // Chave da NASA usada pelos pedidos EPIC. Por agora usa a chave interna
  // do projeto (services/api.js); no futuro isto pode vir de um input do
  // utilizador / contexto de definições — basta trocar este estado inicial.
  const [apiKey] = useState(NASA_API_KEY);
  const [lightbox, setLightbox] = useState(null);

  const {
    photos, date, selected, setSelected,
    loading, error, loadLatest, loadByDate,
  } = useEpicPhotos(apiKey);

  const [pendingDate, setPendingDate] = useState(date);
  useEffect(() => {
    setPendingDate(date);
  }, [date]);

  useEffect(() => {
    loadLatest();
  }, [loadLatest]);

  return (
    <div className="epic-page">
      <section className="hero" id="hero">
        <div>
          <div className="eyebrow">EPIC · Earth Polychromatic Imaging Camera</div>
          <h1 className="headline">
            A daily portrait of our pale blue dot
          </h1>
          <p className="lede">
            A bordo do satélite DSCOVR, no ponto de Lagrange L1, a EPIC é um espectroradiómetro
            de 10 canais que captura o disco inteiro do lado iluminado da Terra a cada duas horas.
            A EPIC API da NASA disponibiliza essas imagens — e os metadados de
            cada captura — prontos a consultar por data.
          </p>
          <div className="hero-cta">
            <a href="#viewer" className="btn btn-primary">Ver imagens do dia →</a>
          </div>
          <div className="readout">
            <div><div className="val">1.5M km</div><div className="lab">Distância à Terra</div></div>
            <div><div className="val">10</div><div className="lab">Canais espectrais</div></div>
            <div><div className="val">2015→</div><div className="lab">Em operação desde</div></div>
          </div>
        </div>

        <div className="hero-video-panel">
          <EpicHeroVideo />
        </div>
      </section>

      <section id="timeline">
        <div className="section-head" style={{ paddingTop: 16 }}>
          <div className="section-eyebrow">Da órbita até hoje</div>
          <div className="section-title">Mais de uma década a fotografar o nosso planeta</div>
          <p className="section-sub">
            Os marcos principais da missão DSCOVR e da câmara EPIC, desde o lançamento até à atualidade.
          </p>
        </div>
        <div className="timeline-spacer" />
        <div className="timeline-card">
          <EpicTimeline />
        </div>
      </section>

      <section id="pipeline-wrap">
        <div className="section-head" style={{ paddingTop: 10 }}>
          <div className="section-eyebrow">Do espaço ao ecrã</div>
          <div className="section-title">Como uma imagem chega até aqui</div>
          <p className="section-sub">
            Quatro etapas reais entre a captura em órbita e o pixel que vês no visualizador abaixo.
          </p>
        </div>
        <div className="pipeline">
          <div className="step">
            <div className="n">01</div>
            <h4>Captura</h4>
            <p>A EPIC regista o disco solar da Terra em 10 bandas espectrais, do ultravioleta ao infravermelho próximo.</p>
          </div>
          <div className="step">
            <div className="n">02</div>
            <h4>Downlink</h4>
            <p>Os dados são transmitidos do L1 para estações terrestres da NOAA, a ~1,5 milhões de km de distância.</p>
          </div>
          <div className="step">
            <div className="n">03</div>
            <h4>Processamento</h4>
            <p>Os canais são calibrados e combinados num composto de cor natural, com coordenadas e hora associadas.</p>
          </div>
          <div className="step">
            <div className="n">04</div>
            <h4>Publicação</h4>
            <p>A EPIC API expõe cada captura como registo JSON, com ligação direta à imagem em alta resolução.</p>
          </div>
        </div>
      </section>

      <div className="bottom-glow">
      <section id="viewer">
        <div className="viewer-intro">
          <div className="section-head">
            <div className="section-eyebrow">Try it live</div>
            <div className="section-title">Visualizador de imagens</div>
            <p className="section-sub">Escolhe uma data para ver todas as capturas do disco terrestre desse dia.</p>
          </div>

          <EpicDateControls
            date={pendingDate}
            onDateChange={setPendingDate}
            onLoad={() => loadByDate(pendingDate)}
            onLatest={loadLatest}
          />
        </div>

        <div className="viewer-layout">
          <EpicDetail
            photo={selected}
            date={date}
            onOpenLightbox={setLightbox}
          />

          <EpicPanel
            photos={photos}
            loading={loading}
            loadingMsg="A carregar imagens..."
            error={error}
            date={date}
            onSelect={setSelected}
            onRetry={loadLatest}
          />
        </div>
      </section>

      <footer>
        <span>EPIC · NASA Open APIs · DSCOVR / NOAA</span>
        <span>Dados disponibilizados por api.nasa.gov</span>
      </footer>
      </div>

      {lightbox && (
        <div className="epic-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox.url} alt={lightbox.caption || ''} />
        </div>
      )}
    </div>
  );
}