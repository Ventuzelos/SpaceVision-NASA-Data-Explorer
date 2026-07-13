import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Icon from "../../common/Icon/Icon";
import Button from "../../common/Button/Button";

import { useParallax } from "../../../hooks/useParallax";
import { getApodByDate } from "../../../services/apodService";
import getApiErrorMessage from "../../../utils/getApiErrorMessage";

import "./DiscovrGallery.css";

const APOD_START_DATE = new Date("1995-06-16");
const CAROUSEL_SIZE = 5;

function randomApodDate() {
  const today = new Date();
  const span = today.getTime() - APOD_START_DATE.getTime();
  const randomTime = APOD_START_DATE.getTime() + Math.random() * span;

  return new Date(randomTime).toISOString().split("T")[0];
}

function randomApodDates(count) {
  const dates = new Set();

  while (dates.size < count) {
    dates.add(randomApodDate());
  }

  return Array.from(dates);
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
    loadCarouselPhotos();
  }, []);

  async function loadCarouselPhotos() {
    setCarouselLoading(true);
    setCarouselError("");
    setCarouselIndex(0);

    try {
      const dates = randomApodDates(CAROUSEL_SIZE + 4);

      const results = await Promise.allSettled(
        dates.map((date) => getApodByDate(date))
      );

      const photos = results
        .filter(
          (result) =>
            result.status === "fulfilled" &&
            result.value?.media_type === "image"
        )
        .map((result) => ({
          url: result.value.hdurl || result.value.url,
          title: result.value.title,
          date: result.value.date,
          explanation: result.value.explanation,
        }))
        .slice(0, CAROUSEL_SIZE);

      if (photos.length === 0) {
        setCarouselError(
          "Não foi possível carregar imagens da NASA neste momento."
        );
        setCarouselPhotos([]);
        return;
      }

      setCarouselPhotos(photos);
    } catch (requestError) {
      console.error("Erro ao carregar carrossel de imagens:", requestError);

      setCarouselError(
        getApiErrorMessage(
          requestError,
          "Não foi possível carregar imagens da NASA."
        )
      );
      setCarouselPhotos([]);
    } finally {
      setCarouselLoading(false);
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
    <section className="discovr-section">
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
        <div className="discovr-error-card">
          <Icon
            name="WifiOff"
            size={28}
            className="discovr-error-card__icon"
          />

          <h3>Sinal perdido</h3>
          <p>{carouselError}</p>

          <Button variant="secondary" onClick={loadCarouselPhotos}>
            Tentar novamente
          </Button>
        </div>
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
                src={currentPhoto.url}
                alt={currentPhoto.title}
                className="discovr-carousel__image"
              />

              <a
                className="discovr-carousel__download"
                href={currentPhoto.url}
                download
                target="_blank"
                rel="noreferrer"
                aria-label="Descarregar imagem"
              >
                <Icon name="Download" size={18} />
              </a>

              <a
                className="discovr-carousel__view-full"
                href={buildApodPageUrl(currentPhoto.date)}
                target="_blank"
                rel="noreferrer"
              >
                Ver imagem completa
                <Icon name="ArrowRight" size={14} />
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
                  className={`discovr-carousel__dot${
                    index === carouselIndex
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
