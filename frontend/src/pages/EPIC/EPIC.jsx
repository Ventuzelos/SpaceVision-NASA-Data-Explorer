import { useEffect, useRef, useState } from "react";

import { useEpicPhotos } from "../../hooks/useEpicPhotos";
import EpicPanel from "./EpicPanel";
import EpicDetail from "./EpicDetail";
import EpicDateControls from "./EpicDateControls";
import EpicHeroVideo from "../../components/EPIC/EpicHeroVideo";
import EpicTimeline from "../../components/EPIC/EpicTimeline";

import "./EPIC.css";

export default function EPIC() {
  const [lightbox, setLightbox] = useState(null);
  const [pendingDate, setPendingDate] = useState("");

  const lightboxRef = useRef(null);
  const previousFocusRef = useRef(null);

  const {
    photos,
    date,
    selected,
    setSelected,
    loading,
    error,
    loadLatest,
    loadByDate,
  } = useEpicPhotos();

  useEffect(() => {
    setPendingDate(date || "");
  }, [date]);

  useEffect(() => {
    loadLatest();
  }, [loadLatest]);

  useEffect(() => {
    if (!lightbox) {
      return undefined;
    }

    previousFocusRef.current = document.activeElement;
    lightboxRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setLightbox(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [lightbox]);

  return (
    <main className="epic-page">
      <section className="hero" id="hero">
        <div>
          <div className="eyebrow">
            EPIC · Earth Polychromatic Imaging Camera
          </div>

          <h1 className="headline">
            O nosso planeta. Visto de longe, em tempo real.
          </h1>

          <p className="lede">
            Descubra a Terra como nunca a viu. Através dos olhos da câmara
            EPIC, a bordo do satélite DSCOVR no ponto de Lagrange L1, aceda a
            imagens atualizadas a cada duas horas que capturam a totalidade do
            disco terrestre totalmente iluminado pelo Sol.
          </p>

          <div className="hero-cta">
            <a href="#viewer" className="btn btn-primary">
              Ver imagens do dia →
            </a>
          </div>

          <div className="readout">
            <div>
              <div className="val">1.5M km</div>
              <div className="lab">Distância à Terra</div>
            </div>

            <div>
              <div className="val">10</div>
              <div className="lab">Canais espectrais</div>
            </div>

            <div>
              <div className="val">2015→</div>
              <div className="lab">Em operação desde</div>
            </div>
          </div>
        </div>

        <div className="hero-video-panel">
          <EpicHeroVideo />
        </div>
      </section>

      <section id="timeline">
        <div className="section-head" style={{ paddingTop: 16 }}>
          <div className="section-eyebrow">Da órbita até hoje</div>

          <div className="section-title">
            Mais de uma década a fotografar o nosso planeta
          </div>

          <p className="section-sub">
            Os marcos principais da missão DSCOVR e da câmara EPIC, desde o
            lançamento até à atualidade.
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

          <div className="section-title">
            Como uma imagem chega até aqui
          </div>

          <p className="section-sub">
            Quatro etapas reais entre a captura em órbita e o pixel que vês no
            visualizador abaixo.
          </p>
        </div>

        <div className="pipeline">
          <div className="step">
            <div className="n">01</div>
            <h4>Captura</h4>
            <p>
              A EPIC regista o disco solar da Terra em 10 bandas espectrais, do
              ultravioleta ao infravermelho próximo.
            </p>
          </div>

          <div className="step">
            <div className="n">02</div>
            <h4>Downlink</h4>
            <p>
              Os dados são transmitidos do L1 para estações terrestres da
              NOAA, a cerca de 1,5 milhões de quilómetros de distância.
            </p>
          </div>

          <div className="step">
            <div className="n">03</div>
            <h4>Processamento</h4>
            <p>
              Os canais são calibrados e combinados num composto de cor
              natural, com coordenadas e hora associadas.
            </p>
          </div>

          <div className="step">
            <div className="n">04</div>
            <h4>Publicação</h4>
            <p>
              A EPIC API expõe cada captura como registo JSON, com ligação
              direta à imagem em alta resolução.
            </p>
          </div>
        </div>
      </section>

      <div className="bottom-glow">
        <section id="viewer">
          <div className="viewer-intro">
            <div className="section-head">
              <div className="section-eyebrow">Experimenta agora</div>

              <div className="section-title">
                Visualizador de imagens
              </div>

              <p className="section-sub">
                Escolhe uma data para ver todas as capturas do disco terrestre
                desse dia.
              </p>
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
      </div>

      {lightbox && (
        <div
          className="epic-lightbox"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.caption || "Imagem EPIC ampliada"}
          tabIndex={-1}
          ref={lightboxRef}
        >
          <img
            src={lightbox.url}
            alt={lightbox.caption || ""}
          />
        </div>
      )}
    </main>
  );
}