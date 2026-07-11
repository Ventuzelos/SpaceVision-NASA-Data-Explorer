import { useState, useEffect } from 'react';
import './EPIC.css';
import { NASA_API_KEY } from '../../services/api';
import { useEpicPhotos } from '../../hooks/useEpicPhotos';
import EpicPanel from './EpicPanel/EpicPanel';
import EpicDetail from './EpicDetail/EpicDetail';
import EpicDateControls from './EpicDateControls/EpicDateControls';
import EpicHero from '../../components/EPIC/EpicHero/EpicHero';
import EpicTimelineSection from '../../components/EPIC/EpicTimelineSection/EpicTimelineSection';
import EpicPipeline from '../../components/EPIC/EpicPipeline/EpicPipeline';
import EpicSectionHead from '../../components/EPIC/EpicSectionHead/EpicSectionHead';
import EpicLightbox from '../../components/EPIC/EpicLightbox/EpicLightbox';
import EpicBackToTop from '../../components/EPIC/EpicBackToTop/EpicBackToTop';

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
    <main className="epic-page">
      <EpicHero />
      <EpicTimelineSection />
      <EpicPipeline />

      <div className="bottom-glow">
      <section id="viewer">
        <div className="viewer-intro">
          <EpicSectionHead
            eyebrow="Try it live"
            title="Visualizador de imagens"
            sub="Escolhe uma data para ver todas as capturas do disco terrestre desse dia."
          />

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

      <EpicLightbox photo={lightbox} onClose={() => setLightbox(null)} />
      <EpicBackToTop />
    </main>
  );
}
