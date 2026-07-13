import { useEffect, useState } from "react";

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
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";

import "./EPIC.css";

export default function EPIC() {
  const [lightbox, setLightbox] = useState(null);
  const [pendingDate, setPendingDate] = useState("");
  const [dateError, setDateError] = useState("");

  const {
    photos,
    date,
    selected,
    setSelected,
    loading,
    error,
    loadLatest,
    loadByDate,
    emptyMessage,
    retryLastRequest,
  } = useEpicPhotos();

  const displayedDate = pendingDate || date || "";

  useEffect(() => {

    loadLatest();
  }, [loadLatest]);

  function handleDateChange(value) {
    setPendingDate(value);
    setDateError("");
  }

  function handleLoadByDate() {
    const today = new Date().toISOString().split("T")[0];

    if (!displayedDate) {
      setDateError("Seleciona uma data.");
      return;
    }

    if (displayedDate > today) {
      setDateError(
        "Não é possível consultar uma data futura."
      );
      return;
    }

    setDateError("");
    setPendingDate(displayedDate);
    loadByDate(displayedDate);
  }

  function handleLoadLatest() {
    setDateError("");

    setPendingDate("");
    loadLatest();
  }

  return (
    <main className="epic-page">

      <EpicHero />

      <EpicTimelineSection />

      <EpicPipeline />

      <div className="bottom-glow">
        <section id="viewer">
          <div className="viewer-intro">
            <EpicSectionHead
              eyebrow="Experimenta agora"
              title="Visualizador de imagens"
              sub="Escolhe uma data para ver todas as capturas do disco terrestre desse dia."
            />

            <EpicDateControls
              date={displayedDate}
              onDateChange={handleDateChange}
              onLoad={handleLoadByDate}
              onLatest={handleLoadLatest}
              loading={loading}
              validationError={dateError}
            />
          </div>

          <div className="viewer-layout">
            <EpicDetail
              photo={selected}
              onOpenLightbox={setLightbox}
            />

            <EpicPanel
              photos={photos}
              loading={loading}
              error={error}
              emptyMessage={emptyMessage}
              date={date}
              onSelect={setSelected}
              onRetry={retryLastRequest}
            />
          </div>
        </section>
      </div>

      <EpicLightbox
        photo={lightbox}
        onClose={() => setLightbox(null)}
      />

      <EpicBackToTop />
    </main>
  );
}