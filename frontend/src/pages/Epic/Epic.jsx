import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useEpicPhotos } from "../../hooks/useEpicPhotos";

import EpicPanel from "./EpicPanel/EpicPanel";
import EpicDetail from "./EpicDetail/EpicDetail";
import EpicDateControls from "./EpicDateControls/EpicDateControls";

import EpicHero from "../../components/EPIC/EpicHero/EpicHero";
import EpicTimelineSection from "../../components/EPIC/EpicTimelineSection/EpicTimelineSection";
import EpicPipeline from "../../components/EPIC/EpicPipeline/EpicPipeline";
import EpicSectionHead from "../../components/EPIC/EpicSectionHead/EpicSectionHead";
import EpicLightbox from "../../components/EPIC/EpicLightbox/EpicLightbox";

import Toast from "../../components/common/Toast/Toast";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import "./Epic.css";

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function getLocalToday() {
  const today = new Date();

  const year = today.getFullYear();

  const month = padDatePart(
    today.getMonth() + 1
  );

  const day = padDatePart(
    today.getDate()
  );

  return `${year}-${month}-${day}`;
}

export default function Epic() {
  const { t } = useTranslation();

  const [lightbox, setLightbox] =
    useState(null);

  const [pendingDate, setPendingDate] =
    useState("");

  const [dateError, setDateError] =
    useState("");

  const [toastMessage, setToastMessage] =
    useState("");

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

  const displayedDate =
    pendingDate || date || "";

  useEffect(() => {
    loadLatest();
  }, [loadLatest]);

  useEffect(() => {
    function showToast(message) {
      if (toastTimeoutRef.current) {
        window.clearTimeout(
          toastTimeoutRef.current
        );
      }

      setToastMessage(message);

      toastTimeoutRef.current =
        window.setTimeout(() => {
          setToastMessage("");
          toastTimeoutRef.current = null;
        }, 2500);
    }

    function handleFavoriteUpdated(event) {
      showToast(
        event.detail?.isFavorite
          ? t("epic.favorites.added")
          : t("epic.favorites.removed")
      );
    }

    function handleFavoriteError(event) {
      showToast(
        event.detail?.status === 401
          ? t(
              "epic.favorites.loginRequired"
            )
          : t(
              "epic.favorites.updateError"
            )
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
        window.clearTimeout(
          toastTimeoutRef.current
        );
      }
    };
  }, [t]);

  function handleDateChange(value) {
    setPendingDate(value);
    setDateError("");
  }

  function handleLoadByDate() {
    const today = getLocalToday();

    if (!displayedDate) {
      setDateError(
        t("epic.validation.requiredDate")
      );

      return;
    }

    if (displayedDate > today) {
      setDateError(
        t("epic.validation.futureDate")
      );

      return;
    }

    setDateError("");
    setPendingDate(displayedDate);
    setLightbox(null);

    loadByDate(displayedDate);
  }

  function handleLoadLatest() {
    setDateError("");
    setPendingDate("");
    setLightbox(null);

    loadLatest();
  }

  function handleOpenLightbox(photo) {
    if (!photo) {
      return;
    }

    setLightbox(photo);
  }

  function handleCloseLightbox() {
    setLightbox(null);
  }

  return (
    <>
      <PageMeta
        title={t("epic.meta.title")}
        description={t(
          "epic.meta.description"
        )}
      />

      <main className="epic-page">
        <EpicHero />

        <section
          id="viewer"
          aria-labelledby="epic-viewer-title"
        >
          <div className="viewer-intro">
            <EpicSectionHead
              title={t(
                "epic.viewer.title"
              )}
              sub={t(
                "epic.viewer.description"
              )}
              titleId="epic-viewer-title"
            />

            <EpicDateControls
              date={displayedDate}
              onDateChange={
                handleDateChange
              }
              onLoad={
                handleLoadByDate
              }
              onLatest={
                handleLoadLatest
              }
              loading={loading}
              validationError={
                dateError
              }
            />
          </div>

          <div className="viewer-layout">
            <EpicDetail
              photo={selected}
              onOpenLightbox={
                handleOpenLightbox
              }
            />

            <EpicPanel
              photos={photos}
              loading={loading}
              error={error}
              emptyMessage={
                emptyMessage
              }
              date={date}
              onSelect={setSelected}
              onRetry={
                retryLastRequest
              }
            />
          </div>
        </section>

        <EpicPipeline />

        <div className="bottom-glow">
          <EpicTimelineSection />
        </div>

        <EpicLightbox
          photo={lightbox}
          onClose={
            handleCloseLightbox
          }
        />

        <Toast message={toastMessage} />
      </main>
    </>
  );
}