import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Icon from "../../common/Icon/Icon";
import ErrorState from "../../common/ErrorState/ErrorState";

import { useParallax } from "../../../hooks/useParallax";
import { getApodByDate } from "../../../services/apodService";
import getApiErrorMessage from "../../../utils/getApiErrorMessage";

import "./DiscovrGallery.css";

const APOD_START_DATE = new Date("1995-06-16");
const CAROUSEL_SIZE = 5;
const MAX_APOD_ATTEMPTS = 6;
const APOD_REQUEST_DELAY = 1000;
const GALLERY_CACHE_KEY = "spacevision_discovr_gallery";

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function randomApodDate() {
  const today = new Date();
  const span = today.getTime() - APOD_START_DATE.getTime();
  const randomTime = APOD_START_DATE.getTime() + Math.random() * span;

  return new Date(randomTime).toISOString().split("T")[0];
}

function formatApodEyebrow(dateStr) {
  const parsed = new Date(`${dateStr}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return dateStr;

  return parsed
    .toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
}

function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text || "";

  return `${text.slice(0, maxLength).trim()}…`;
}

function buildApodPageUrl(dateStr) {
  const [year, month, day] = dateStr.split("-");

  return `https://apod.nasa.gov/apod/ap${year.slice(2)}${month}${day}.html`;
}

function DiscovrGallery() {
  const [carouselPhotos, setCarouselPhotos] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [carouselError, setCarouselError] = useState("");

  const parallaxRef = useParallax(0.15);

  useEffect(() => {
    let isMounted = true;

    async function initializeGallery() {
      const cachedGallery = sessionStorage.getItem(
        GALLERY_CACHE_KEY
      );

      if (cachedGallery) {
        try {
          const parsedGallery = JSON.parse(cachedGallery);

          if (
            Array.isArray(parsedGallery) &&
            parsedGallery.length > 0
          ) {
            setCarouselPhotos(parsedGallery);
            setCarouselLoading(false);
            return;
          }
        } catch {
          sessionStorage.removeItem(
            GALLERY_CACHE_KEY
          );
        }
      }

      await loadCarouselPhotos(isMounted);
    }

    initializeGallery();

    return () => {
      isMounted = false;
    };
  }, []);

  async function loadCarouselPhotos(
    isMounted = true
  ) {
    setCarouselLoading(true);
    setCarouselError("");
    setCarouselIndex(0);

    const photos = [];
    const attemptedDates = new Set();

    try {
      while (
        photos.length < CAROUSEL_SIZE &&
        attemptedDates.size < MAX_APOD_ATTEMPTS
      ) {
        const date = randomApodDate();

        if (attemptedDates.has(date)) {
          continue;
        }

        attemptedDates.add(date);

        try {
          const result = await getApodByDate(date);

          if (
            result?.media_type === "image" &&
            result.url
          ) {
            photos.push({
              url: result.hdurl || result.url,
              previewUrl: result.url,
              title: result.title,
              date: result.date,
              explanation: result.explanation,
            });
          }
        } catch (requestError) {
          if (requestError.response?.status === 429) {
            if (photos.length === 0) {
              setCarouselError(
                "Foram efetuados demasiados pedidos à NASA. Aguarda um momento e tenta novamente."
              );
            }

            break;
          } else {
            console.warn(
              `Não foi possível carregar o APOD de ${date}:`,
              requestError
            );
          }
        }

        if (photos.length < CAROUSEL_SIZE) {
          await wait(APOD_REQUEST_DELAY);
        }
      }

      if (!isMounted) {
        return;
      }

      if (photos.length > 0) {
        setCarouselPhotos(photos);

        sessionStorage.setItem(
          GALLERY_CACHE_KEY,
          JSON.stringify(photos)
        );

        setCarouselError("");
        return;
      }

      setCarouselError(
        "Não foi possível carregar imagens da NASA neste momento."
      );

      setCarouselPhotos([]);

      sessionStorage.setItem(
        GALLERY_CACHE_KEY,
        JSON.stringify(photos)
      );
    } catch (requestError) {
      if (!isMounted) {
        return;
      }

      console.error(
        "Erro ao carregar carrossel de imagens:",
        requestError
      );

      setCarouselError(
        getApiErrorMessage(
          requestError,
          "Não foi possível carregar imagens da NASA."
        )
      );

      setCarouselPhotos([]);
    } finally {
      if (isMounted) {
        setCarouselLoading(false);
      }
    }
  }

  function handlePrevSlide() {
    setCarouselIndex((current) =>
      current === 0 ? carouselPhotos.length - 1 : current - 1
    );
  }

  function handleNextSlide() {
    setCarouselIndex((current) =>
      current === carouselPhotos.length - 1 ? 0 : current + 1
    );
  }

  const currentPhoto = carouselPhotos[carouselIndex];

  return (
    <section id="galeria" className="discovr-section">
      <h2 className="discovr-section__title">
        <Icon name="Image" size={22} />
        Galeria aleatória da NASA
      </h2>

      <p className="discovr-section__subtitle">
        Cinco imagens escolhidas ao acaso do arquivo do Astronomy Picture of
        the Day.
      </p>

      {carouselLoading && (
        <div className="discovr-carousel">
          <div className="discovr-carousel__card discovr-carousel__card--skeleton">
            <div className="discovr-carousel__text">
              <div className="discovr-skeleton-line discovr-skeleton-line--eyebrow" />
              <div className="discovr-skeleton-line discovr-skeleton-line--title" />
              <div className="discovr-skeleton-line" />
              <div className="discovr-skeleton-line" />
              <div className="discovr-skeleton-line discovr-skeleton-line--short" />
              <div className="discovr-skeleton-line discovr-skeleton-line--link" />
            </div>

            <div className="discovr-skeleton discovr-carousel__media" />
          </div>

          <div className="discovr-carousel__nav">
            <div className="discovr-skeleton discovr-skeleton--control" />
            <div className="discovr-carousel__dots">
              {Array.from({ length: CAROUSEL_SIZE }).map((_, index) => (
                <span key={index} className="discovr-carousel__dot" />
              ))}
            </div>
            <div className="discovr-skeleton discovr-skeleton--control" />
          </div>
        </div>
      )}

      {!carouselLoading && carouselError && (
        <ErrorState
          title="Sinal perdido"
          message={carouselError}
          onRetry={() =>
            loadCarouselPhotos(true)
          }
        />
      )}

      {!carouselLoading && !carouselError && currentPhoto && (
        <div className="discovr-carousel">
          <div className="discovr-carousel__card">
            <div className="discovr-carousel__text">
              <span className="discovr-carousel__eyebrow">
                {formatApodEyebrow(currentPhoto.date)}
              </span>

              <h3>{currentPhoto.title}</h3>

              <p>{truncateText(currentPhoto.explanation, 220)}</p>

              <Link to="/apod" className="discovr-link">
                Ver arquivo de imagens
                <Icon name="ArrowRight" size={16} />
              </Link>
            </div>

            <div className="discovr-carousel__media">
              <img
                ref={parallaxRef}
                key={currentPhoto.url}
                src={
                  currentPhoto.previewUrl ||
                  currentPhoto.url
                }
                alt={currentPhoto.title}
                className="discovr-carousel__image"
                loading="lazy"
                decoding="async"
              />

              <a
                className="discovr-carousel__download"
                href={currentPhoto.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Descarregar a imagem ${currentPhoto.title}, abre numa nova janela`}
              >
                <Icon name="Download" size={18} />
              </a>

              <a
                className="discovr-carousel__view-full"
                href={buildApodPageUrl(currentPhoto.date)}
                target="_blank"
                rel="noreferrer"
                aria-label={`Ver a imagem completa ${currentPhoto.title} no site APOD da NASA, abre numa nova janela`}
              >
                Ver imagem completa
                <Icon name="ArrowRight" size={14} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="discovr-carousel__nav">
            <button
              type="button"
              className="discovr-carousel__control"
              onClick={handlePrevSlide}
              aria-label="Imagem anterior"
            >
              <Icon name="ArrowLeft" size={18} />
            </button>

            <div className="discovr-carousel__dots">
              {carouselPhotos.map((photo, index) => (
                <button
                  type="button"
                  key={photo.url}
                  className={`discovr-carousel__dot${index === carouselIndex
                    ? " discovr-carousel__dot--active"
                    : ""
                    }`}
                  onClick={() => setCarouselIndex(index)}
                  aria-label={`Ver imagem ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              className="discovr-carousel__control"
              onClick={handleNextSlide}
              aria-label="Imagem seguinte"
            >
              <Icon name="ArrowRight" size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DiscovrGallery;
