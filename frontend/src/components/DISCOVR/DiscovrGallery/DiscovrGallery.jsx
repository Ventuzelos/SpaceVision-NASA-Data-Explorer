import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Icon from "../../common/Icon/Icon";
import ErrorState from "../../common/ErrorState/ErrorState";

import { useParallax } from "../../../hooks/useParallax";
import { getApodByDate } from "../../../services/apodService";
import getApiErrorMessage from "../../../utils/getApiErrorMessage";

import "./DiscovrGallery.css";

const APOD_START_DATE = new Date(
  1995,
  5,
  16
);

const CAROUSEL_SIZE = 5;
const MAX_APOD_ATTEMPTS = 8;
const APOD_REQUEST_DELAY = 1000;

const GALLERY_CACHE_KEY =
  "spacevision_discovr_gallery";

function padDatePart(value) {
  return String(value).padStart(
    2,
    "0"
  );
}

function formatDateForApi(date) {
  if (
    !(date instanceof Date) ||
    Number.isNaN(date.getTime())
  ) {
    return "";
  }

  const year = date.getFullYear();

  const month = padDatePart(
    date.getMonth() + 1
  );

  const day = padDatePart(
    date.getDate()
  );

  return `${year}-${month}-${day}`;
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(
      resolve,
      milliseconds
    );
  });
}

function randomApodDate() {
  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const startTimestamp =
    APOD_START_DATE.getTime();

  const endTimestamp =
    today.getTime();

  const randomTimestamp =
    startTimestamp +
    Math.random() *
      (endTimestamp -
        startTimestamp);

  return formatDateForApi(
    new Date(randomTimestamp)
  );
}

function formatApodEyebrow(
  dateString
) {
  if (
    typeof dateString !== "string"
  ) {
    return "DATA INDISPONÍVEL";
  }

  const [
    year,
    month,
    day,
  ] = dateString
    .split("-")
    .map(Number);

  const parsedDate = new Date(
    year,
    month - 1,
    day
  );

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return dateString;
  }

  return parsedDate
    .toLocaleDateString(
      "pt-PT",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    )
    .toUpperCase();
}

function truncateText(
  text,
  maxLength
) {
  if (
    typeof text !== "string"
  ) {
    return "";
  }

  const normalizedText =
    text.trim();

  if (
    normalizedText.length <=
    maxLength
  ) {
    return normalizedText;
  }

  return `${normalizedText
    .slice(0, maxLength)
    .trim()}…`;
}

function isValidDateString(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  );
}

function isSafeHttpUrl(value) {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" ||
      url.protocol === "http:"
    );
  } catch {
    return false;
  }
}

function buildApodPageUrl(
  dateString
) {
  if (
    !isValidDateString(
      dateString
    )
  ) {
    return "";
  }

  const [
    year,
    month,
    day,
  ] = dateString.split("-");

  return `https://apod.nasa.gov/apod/ap${year.slice(
    2
  )}${month}${day}.html`;
}

function normalizePhoto(result) {
  if (
    !result ||
    result.media_type !== "image" ||
    !isSafeHttpUrl(result.url) ||
    !isValidDateString(
      result.date
    )
  ) {
    return null;
  }

  const fullUrl =
    isSafeHttpUrl(result.hdurl)
      ? result.hdurl
      : result.url;

  return {
    url: fullUrl,

    previewUrl:
      result.url,

    title:
      typeof result.title ===
        "string" &&
      result.title.trim()
        ? result.title.trim()
        : "Imagem da NASA",

    date:
      result.date,

    explanation:
      typeof result.explanation ===
      "string"
        ? result.explanation
        : "",
  };
}

function isValidCachedPhoto(
  photo
) {
  return Boolean(
    photo &&
      isSafeHttpUrl(
        photo.url
      ) &&
      isSafeHttpUrl(
        photo.previewUrl ||
          photo.url
      ) &&
      isValidDateString(
        photo.date
      )
  );
}

function getCachedGallery() {
  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  try {
    const cachedValue =
      window.sessionStorage.getItem(
        GALLERY_CACHE_KEY
      );

    if (!cachedValue) {
      return [];
    }

    const parsedValue =
      JSON.parse(
        cachedValue
      );

    if (
      !Array.isArray(
        parsedValue
      )
    ) {
      return [];
    }

    return parsedValue.filter(
      isValidCachedPhoto
    );
  } catch {
    try {
      window.sessionStorage.removeItem(
        GALLERY_CACHE_KEY
      );
    } catch {
      // O armazenamento pode estar indisponível.
    }

    return [];
  }
}

function saveGalleryToCache(
  photos
) {
  if (
    typeof window === "undefined" ||
    !Array.isArray(photos) ||
    photos.length === 0
  ) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      GALLERY_CACHE_KEY,
      JSON.stringify(photos)
    );
  } catch {
    // A galeria continua funcional sem cache.
  }
}

function DiscovrGallery() {
  const [initialGallery] =
    useState(getCachedGallery);

  const [
    carouselPhotos,
    setCarouselPhotos,
  ] = useState(initialGallery);

  const [
    carouselIndex,
    setCarouselIndex,
  ] = useState(0);

  const [
    carouselLoading,
    setCarouselLoading,
  ] = useState(
    initialGallery.length === 0
  );

  const [
    carouselError,
    setCarouselError,
  ] = useState("");

  const [
    failedPreviewUrl,
    setFailedPreviewUrl,
  ] = useState("");

  const [
    failedFullUrl,
    setFailedFullUrl,
  ] = useState("");

  const mountedRef =
    useRef(true);

  const requestIdRef =
    useRef(0);

  const parallaxRef =
    useParallax(0.15);

  const loadCarouselPhotos =
    useCallback(async () => {
      const requestId =
        ++requestIdRef.current;

      if (mountedRef.current) {
        setCarouselLoading(true);
        setCarouselError("");
        setCarouselIndex(0);
        setFailedPreviewUrl("");
        setFailedFullUrl("");
      }

      const photos = [];

      const attemptedDates =
        new Set();

      try {
        while (
          photos.length <
            CAROUSEL_SIZE &&
          attemptedDates.size <
            MAX_APOD_ATTEMPTS
        ) {
          if (
            !mountedRef.current ||
            requestIdRef.current !==
              requestId
          ) {
            return;
          }

          const date =
            randomApodDate();

          if (
            !date ||
            attemptedDates.has(
              date
            )
          ) {
            continue;
          }

          attemptedDates.add(
            date
          );

          try {
            const result =
              await getApodByDate(
                date
              );

            if (
              !mountedRef.current ||
              requestIdRef.current !==
                requestId
            ) {
              return;
            }

            const photo =
              normalizePhoto(
                result
              );

            if (!photo) {
              continue;
            }

            const alreadyExists =
              photos.some(
                (
                  existingPhoto
                ) =>
                  existingPhoto.date ===
                    photo.date ||
                  existingPhoto.url ===
                    photo.url
              );

            if (!alreadyExists) {
              photos.push(
                photo
              );
            }
          } catch (
            requestError
          ) {
            if (
              !mountedRef.current ||
              requestIdRef.current !==
                requestId
            ) {
              return;
            }

            if (
              requestError.response
                ?.status === 429
            ) {
              if (
                photos.length ===
                0
              ) {
                setCarouselError(
                  "Foram efetuados demasiados pedidos à NASA. Aguarda um momento e tenta novamente."
                );
              }

              break;
            }

            console.warn(
              `Não foi possível carregar o APOD de ${date}:`,
              requestError
            );
          }

          if (
            photos.length <
              CAROUSEL_SIZE &&
            attemptedDates.size <
              MAX_APOD_ATTEMPTS
          ) {
            await wait(
              APOD_REQUEST_DELAY
            );
          }
        }

        if (
          !mountedRef.current ||
          requestIdRef.current !==
            requestId
        ) {
          return;
        }

        if (
          photos.length > 0
        ) {
          setCarouselPhotos(
            photos
          );

          saveGalleryToCache(
            photos
          );

          setCarouselError("");

          return;
        }

        setCarouselPhotos([]);

        setCarouselError(
          "Não foi possível carregar imagens da NASA neste momento."
        );
      } catch (
        requestError
      ) {
        if (
          !mountedRef.current ||
          requestIdRef.current !==
            requestId
        ) {
          return;
        }

        console.error(
          "Erro ao carregar o carrossel de imagens:",
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
        if (
          mountedRef.current &&
          requestIdRef.current ===
            requestId
        ) {
          setCarouselLoading(
            false
          );
        }
      }
    }, []);

  useEffect(() => {
    mountedRef.current = true;

    let initialLoadTimeoutId =
      null;

    if (
      initialGallery.length === 0
    ) {
      initialLoadTimeoutId =
        window.setTimeout(() => {
          loadCarouselPhotos();
        }, 0);
    }

    return () => {
      mountedRef.current =
        false;

      requestIdRef.current +=
        1;

      if (
        initialLoadTimeoutId !==
        null
      ) {
        window.clearTimeout(
          initialLoadTimeoutId
        );
      }
    };
  }, [
    initialGallery.length,
    loadCarouselPhotos,
  ]);

  function handlePrevSlide() {
    if (
      carouselPhotos.length <=
      1
    ) {
      return;
    }

    setCarouselIndex(
      (currentIndex) =>
        currentIndex === 0
          ? carouselPhotos.length -
            1
          : currentIndex - 1
    );

    setFailedPreviewUrl("");
    setFailedFullUrl("");
  }

  function handleNextSlide() {
    if (
      carouselPhotos.length <=
      1
    ) {
      return;
    }

    setCarouselIndex(
      (currentIndex) =>
        currentIndex ===
        carouselPhotos.length - 1
          ? 0
          : currentIndex + 1
    );

    setFailedPreviewUrl("");
    setFailedFullUrl("");
  }

  function handleSelectSlide(
    index
  ) {
    setCarouselIndex(index);
    setFailedPreviewUrl("");
    setFailedFullUrl("");
  }

  const currentPhoto =
    carouselPhotos[
      carouselIndex
    ] || null;

  const previewUrl =
    currentPhoto?.previewUrl ||
    currentPhoto?.url ||
    "";

  const fullUrl =
    currentPhoto?.url ||
    "";

  const previewFailed =
    Boolean(previewUrl) &&
    failedPreviewUrl ===
      previewUrl;

  const fullFailed =
    Boolean(fullUrl) &&
    failedFullUrl ===
      fullUrl;

  const imageSource =
    !previewFailed
      ? previewUrl
      : fullUrl;

  const imageError =
    !imageSource ||
    (previewFailed &&
      fullFailed);

  const apodPageUrl =
    buildApodPageUrl(
      currentPhoto?.date
    );

  function handleImageError() {
    if (
      !previewFailed &&
      previewUrl
    ) {
      setFailedPreviewUrl(
        previewUrl
      );

      return;
    }

    if (fullUrl) {
      setFailedFullUrl(
        fullUrl
      );
    }
  }

  return (
    <section
      id="galeria"
      className="discovr-section"
      aria-labelledby="discovr-gallery-title"
    >
      <h2
        id="discovr-gallery-title"
        className="discovr-section__title"
      >
        <Icon
          name="Image"
          size={22}
          aria-hidden="true"
        />

        Galeria aleatória da NASA
      </h2>

      <p className="discovr-section__subtitle">
        Cinco imagens escolhidas ao acaso do arquivo do Astronomy Picture of the Day.
      </p>

      {carouselLoading && (
        <div
          className="discovr-carousel"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="A carregar galeria da NASA"
        >
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
              {Array.from({
                length:
                  CAROUSEL_SIZE,
              }).map(
                (_, index) => (
                  <span
                    key={index}
                    className="discovr-carousel__dot"
                  />
                )
              )}
            </div>

            <div className="discovr-skeleton discovr-skeleton--control" />
          </div>
        </div>
      )}

      {!carouselLoading &&
        carouselError && (
          <ErrorState
            title="Sinal perdido"
            message={
              carouselError
            }
            onRetry={
              loadCarouselPhotos
            }
          />
        )}

      {!carouselLoading &&
        !carouselError &&
        currentPhoto && (
          <div className="discovr-carousel">
            <div className="discovr-carousel__card">
              <div className="discovr-carousel__text">
                <span className="discovr-carousel__eyebrow">
                  {formatApodEyebrow(
                    currentPhoto.date
                  )}
                </span>

                <h3>
                  {currentPhoto.title}
                </h3>

                <p>
                  {truncateText(
                    currentPhoto.explanation,
                    220
                  )}
                </p>

                <a
                  href="#apod-historico"
                  className="discovr-link"
                >
                  Ver arquivo de imagens

                  <Icon
                    name="ArrowRight"
                    size={16}
                    aria-hidden="true"
                  />
                </a>
              </div>

              <div className="discovr-carousel__media">
                {imageError ? (
                  <div
                    className="discovr-carousel__image-fallback"
                    role="img"
                    aria-label="A imagem da NASA não está disponível"
                  >
                    <Icon
                      name="ImageOff"
                      size={28}
                      aria-hidden="true"
                    />

                    <strong>
                      Imagem indisponível
                    </strong>

                    <span>
                      Não foi possível carregar esta imagem.
                    </span>
                  </div>
                ) : (
                  <img
                    ref={
                      parallaxRef
                    }
                    key={
                      currentPhoto.url
                    }
                    src={
                      imageSource
                    }
                    alt={
                      currentPhoto.title
                    }
                    className="discovr-carousel__image"
                    loading="lazy"
                    decoding="async"
                    onError={
                      handleImageError
                    }
                  />
                )}

                {!imageError &&
                  fullUrl && (
                    <a
                      className="discovr-carousel__download"
                      href={
                        fullUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir a imagem ${currentPhoto.title} em tamanho completo, numa nova janela`}
                    >
                      <Icon
                        name="Download"
                        size={18}
                        aria-hidden="true"
                      />
                    </a>
                  )}

                {apodPageUrl && (
                  <a
                    className="discovr-carousel__view-full"
                    href={
                      apodPageUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ver ${currentPhoto.title} no site APOD da NASA, abre numa nova janela`}
                  >
                    Ver imagem completa

                    <Icon
                      name="ArrowRight"
                      size={14}
                      aria-hidden="true"
                    />
                  </a>
                )}
              </div>
            </div>

            <div
              className="discovr-carousel__nav"
              aria-label="Navegação da galeria"
            >
              <button
                type="button"
                className="discovr-carousel__control"
                onClick={
                  handlePrevSlide
                }
                disabled={
                  carouselPhotos.length <=
                  1
                }
                aria-label="Imagem anterior"
              >
                <Icon
                  name="ArrowLeft"
                  size={18}
                  aria-hidden="true"
                />
              </button>

              <div className="discovr-carousel__dots">
                {carouselPhotos.map(
                  (
                    photo,
                    index
                  ) => (
                    <button
                      type="button"
                      key={`${photo.date}-${photo.url}`}
                      className={`discovr-carousel__dot${
                        index ===
                        carouselIndex
                          ? " discovr-carousel__dot--active"
                          : ""
                      }`}
                      onClick={() =>
                        handleSelectSlide(
                          index
                        )
                      }
                      aria-label={`Ver imagem ${index + 1}: ${photo.title}`}
                      aria-current={
                        index ===
                        carouselIndex
                          ? "true"
                          : undefined
                      }
                    />
                  )
                )}
              </div>

              <button
                type="button"
                className="discovr-carousel__control"
                onClick={
                  handleNextSlide
                }
                disabled={
                  carouselPhotos.length <=
                  1
                }
                aria-label="Imagem seguinte"
              >
                <Icon
                  name="ArrowRight"
                  size={18}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        )}
    </section>
  );
}

export default DiscovrGallery;