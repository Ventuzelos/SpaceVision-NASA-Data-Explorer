import { useEffect, useRef, useState } from "react";

import { useEpicPhotos } from "../../hooks/useEpicPhotos";
import EpicPanel from "./EpicPanel/EpicPanel";
import EpicDetail from "./EpicDetail/EpicDetail";
import EpicDateControls from "./EpicDateControls/EpicDateControls";
import EpicHero from "../../components/epic/EpicHero/EpicHero";
import EpicTimelineSection from "../../components/epic/EpicTimelineSection/EpicTimelineSection";
import EpicPipeline from "../../components/epic/EpicPipeline/EpicPipeline";
import EpicSectionHead from "../../components/epic/EpicSectionHead/EpicSectionHead";
import EpicLightbox from "../../components/epic/EpicLightbox/EpicLightbox";
import Toast from "../../components/common/Toast/Toast";

import "./Epic.css";

export default function Epic() {
  const [lightbox, setLightbox] = useState(null);
  const [pendingDate, setPendingDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const toastTimeoutRef = useRef(null);

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

  useEffect(() => {
    function showToast(message) {
      setToastMessage(message);

      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }

      toastTimeoutRef.current = window.setTimeout(() => {
        setToastMessage("");
      }, 2500);
    }

    function handleFavoriteUpdated(event) {
      showToast(
        event.detail?.isFavorite
          ? "Adicionado aos favoritos"
          : "Removido dos favoritos"
      );
    }

    function handleFavoriteError(event) {
      showToast(
        event.detail?.status === 401
          ? "Precisas de iniciar sessão para guardar favoritos"
          : "Não foi possível atualizar o favorito"
      );
    }

    window.addEventListener(
      "epicFavoriteUpdated",
      handleFavoriteUpdated
    );

    window.addEventListener(
      "epicFavoriteError",
      handleFavoriteError
    );

    return () => {
      window.removeEventListener(
        "epicFavoriteUpdated",
        handleFavoriteUpdated
      );

      window.removeEventListener(
        "epicFavoriteError",
        handleFavoriteError
      );

      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

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

      <Toast message={toastMessage} />
    </main>
  );
}