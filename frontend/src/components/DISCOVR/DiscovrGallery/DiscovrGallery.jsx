import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import Icon from "../../common/Icon/Icon";
import ErrorState from "../../common/ErrorState/ErrorState";
import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";
import Toast from "../../common/Toast/Toast";

import { useParallax } from "../../../hooks/useParallax";
import useAuth from "../../../hooks/useAuth";
import { getApodByDate } from "../../../services/apodService";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../../services/favoritesService";
import getApiErrorMessage from "../../../utils/getApiErrorMessage";
import isSafeUrl from "../../../utils/isSafeUrl";

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
  dateString,
  locale,
  unavailableText
) {
  if (
    typeof dateString !==
      "string" ||
    !dateString.trim()
  ) {
    return unavailableText;
  }

  const [year, month, day] =
    dateString
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

  return new Intl.DateTimeFormat(
    locale,
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  )
    .format(parsedDate)
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
    !isSafeUrl(result.url) ||
    !isValidDateString(
      result.date
    )
  ) {
    return null;
  }

  const fullUrl =
    isSafeUrl(result.hdurl)
      ? result.hdurl
      : result.url;

  const title =
    typeof result.title ===
      "string"
      ? result.title.trim()
      : "";

  const explanation =
    typeof result.explanation ===
      "string"
      ? result.explanation.trim()
      : "";

  const originalTitle =
    result.original_title ||
    result.originalTitle ||
    result.title_original ||
    title ||
    "";

  const translatedTitle =
    result.translated_title ||
    result.translatedTitle ||
    result.title_pt ||
    title ||
    originalTitle;

  const originalExplanation =
    result.original_explanation ||
    result.originalExplanation ||
    result.explanation_original ||
    explanation ||
    "";

  const translatedExplanation =
    result.translated_explanation ||
    result.translatedExplanation ||
    result.explanation_pt ||
    explanation ||
    originalExplanation;

  return {
    url: fullUrl,

    previewUrl:
      result.url,

    date:
      result.date,

    title,

    explanation,

    originalTitle:
      typeof originalTitle ===
        "string"
        ? originalTitle.trim()
        : "",

    translatedTitle:
      typeof translatedTitle ===
        "string"
        ? translatedTitle.trim()
        : "",

    originalExplanation:
      typeof originalExplanation ===
        "string"
        ? originalExplanation.trim()
        : "",

    translatedExplanation:
      typeof translatedExplanation ===
        "string"
        ? translatedExplanation.trim()
        : "",
  };
}

function isValidCachedPhoto(
  photo
) {
  return Boolean(
    photo &&
      isSafeUrl(
        photo.url
      ) &&
      isSafeUrl(
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
    typeof window ===
    "undefined"
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
    typeof window ===
      "undefined" ||
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
  const { t, i18n } =
    useTranslation();

  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const isEnglish =
    i18n.resolvedLanguage?.startsWith(
      "en"
    );

  const locale = isEnglish
    ? "en-GB"
    : "pt-PT";

  const [
    favorite,
    setFavorite,
  ] = useState(false);

  const [
    favoriteDatabaseId,
    setFavoriteDatabaseId,
  ] = useState(null);

  const [
    isFavoriteLoading,
    setIsFavoriteLoading,
  ] = useState(false);

  const [
    toastMessage,
    setToastMessage,
  ] = useState("");

  const toastTimeoutRef =
    useRef(null);

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
              photos.push(photo);
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
                photos.length === 0
              ) {
                setCarouselError(
                  t(
                    "discovr.gallery.errors.rateLimit"
                  )
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
          t(
            "discovr.gallery.errors.noImages"
          )
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
            t(
              "discovr.gallery.errors.loadFallback"
            )
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
    }, [t]);

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

  const currentTitle =
    currentPhoto
      ? isEnglish
        ? currentPhoto.originalTitle ||
          currentPhoto.title ||
          currentPhoto.translatedTitle ||
          t(
            "discovr.gallery.defaultTitle"
          )
        : currentPhoto.translatedTitle ||
          currentPhoto.title ||
          currentPhoto.originalTitle ||
          t(
            "discovr.gallery.defaultTitle"
          )
      : "";

  const currentExplanation =
    currentPhoto
      ? isEnglish
        ? currentPhoto.originalExplanation ||
          currentPhoto.explanation ||
          currentPhoto.translatedExplanation ||
          ""
        : currentPhoto.translatedExplanation ||
          currentPhoto.explanation ||
          currentPhoto.originalExplanation ||
          ""
      : "";

  const favoriteId = currentPhoto
    ? `apod-${currentPhoto.date}`
    : null;

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
    failedFullUrl === fullUrl;

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

  useEffect(() => {
    let isMounted = true;

    if (
      isAuthLoading ||
      !isAuthenticated ||
      !favoriteId
    ) {
      return undefined;
    }

    async function checkFavorite() {
      try {
        const favorites =
          await getFavorites(
            "apod"
          );

        const existingFavorite =
          favorites.find(
            (item) => {
              const itemId =
                item.nasa_id ||
                item.id;

              return (
                String(itemId) ===
                String(favoriteId)
              );
            }
          );

        if (!isMounted) {
          return;
        }

        setFavorite(
          Boolean(
            existingFavorite
          )
        );

        setFavoriteDatabaseId(
          existingFavorite?.id ||
            null
        );
      } catch (error) {
        if (
          error.response?.status !==
          401
        ) {
          console.error(
            "Erro ao verificar favorito:",
            error
          );
        }

        if (isMounted) {
          setFavorite(false);
          setFavoriteDatabaseId(
            null
          );
        }
      }
    }

    checkFavorite();

    return () => {
      isMounted = false;
    };
  }, [
    favoriteId,
    isAuthenticated,
    isAuthLoading,
  ]);

  useEffect(() => {
    return () => {
      if (
        toastTimeoutRef.current
      ) {
        window.clearTimeout(
          toastTimeoutRef.current
        );
      }
    };
  }, []);

  function showToast(message) {
    if (
      toastTimeoutRef.current
    ) {
      window.clearTimeout(
        toastTimeoutRef.current
      );
    }

    setToastMessage(message);

    toastTimeoutRef.current =
      window.setTimeout(() => {
        setToastMessage("");
        toastTimeoutRef.current =
          null;
      }, 2500);
  }

  async function handleFavoriteClick() {
    if (!isAuthenticated) {
      showToast(
        t(
          "discovr.gallery.favorites.loginRequired"
        )
      );

      return;
    }

    if (
      isFavoriteLoading ||
      !currentPhoto
    ) {
      return;
    }

    try {
      setIsFavoriteLoading(true);

      if (
        favorite &&
        favoriteDatabaseId
      ) {
        await removeFavorite(
          favoriteDatabaseId
        );

        setFavorite(false);
        setFavoriteDatabaseId(
          null
        );

        showToast(
          t(
            "discovr.gallery.favorites.removed"
          )
        );

        return;
      }

      const favoriteItem = {
        nasa_type: "apod",
        nasa_id: favoriteId,

        title:
          currentTitle ||
          t(
            "discovr.gallery.defaultTitle"
          ),

        image_url:
          currentPhoto.url,

        data: {
          ...currentPhoto,
          title: currentTitle,
          explanation:
            currentExplanation,
          media_type: "image",
          image_url:
            currentPhoto.url,
        },
      };

      const createdFavorite =
        await addFavorite(
          favoriteItem
        );

      setFavorite(true);

      setFavoriteDatabaseId(
        createdFavorite.id
      );

      showToast(
        t(
          "discovr.gallery.favorites.added"
        )
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar favorito:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        showToast(
          t(
            "discovr.gallery.favorites.loginRequired"
          )
        );
      } else {
        showToast(
          t(
            "discovr.gallery.favorites.updateError"
          )
        );
      }
    } finally {
      setIsFavoriteLoading(false);
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
        {t(
          "discovr.gallery.title"
        )}
      </h2>

      <p className="discovr-section__subtitle">
        {t(
          "discovr.gallery.description"
        )}
      </p>

      {carouselLoading && (
        <div
          className="discovr-carousel"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label={t(
            "discovr.gallery.loadingAria"
          )}
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
            title={t(
              "discovr.gallery.errors.title"
            )}
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
                    currentPhoto.date,
                    locale,
                    t(
                      "discovr.gallery.dateUnavailable"
                    )
                  )}
                </span>

                <div className="discovr-carousel__title-row">
                  <h3>
                    {currentTitle}
                  </h3>

                  <FavoriteButton
                    active={
                      isAuthenticated &&
                      favorite
                    }
                    onClick={
                      handleFavoriteClick
                    }
                    disabled={
                      isFavoriteLoading ||
                      isAuthLoading
                    }
                    ariaLabel={
                      favorite
                        ? t(
                            "discovr.gallery.favorites.removeAria"
                          )
                        : t(
                            "discovr.gallery.favorites.addAria"
                          )
                    }
                  />
                </div>

                <p>
                  {currentExplanation
                    ? truncateText(
                        currentExplanation,
                        220
                      )
                    : t(
                        "discovr.gallery.descriptionUnavailable"
                      )}
                </p>

                <a
                  href="#apod-historico"
                  className="discovr-link"
                >
                  {t(
                    "discovr.gallery.viewArchive"
                  )}

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
                    aria-label={t(
                      "discovr.gallery.imageUnavailableAria"
                    )}
                  >
                    <Icon
                      name="ImageOff"
                      size={28}
                      aria-hidden="true"
                    />

                    <strong>
                      {t(
                        "discovr.gallery.imageUnavailable"
                      )}
                    </strong>

                    <span>
                      {t(
                        "discovr.gallery.imageLoadError"
                      )}
                    </span>
                  </div>
                ) : (
                  <img
                    ref={parallaxRef}
                    key={
                      currentPhoto.url
                    }
                    src={
                      imageSource
                    }
                    alt={
                      currentTitle
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
                      aria-label={t(
                        "discovr.gallery.openFullSizeAria",
                        {
                          title:
                            currentTitle,
                        }
                      )}
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
                    aria-label={t(
                      "discovr.gallery.viewOnApodAria",
                      {
                        title:
                          currentTitle,
                      }
                    )}
                  >
                    {t(
                      "discovr.gallery.viewFullImage"
                    )}

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
              aria-label={t(
                "discovr.gallery.navigationAria"
              )}
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
                aria-label={t(
                  "discovr.gallery.previousImage"
                )}
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
                  ) => {
                    const photoTitle =
                      isEnglish
                        ? photo.originalTitle ||
                          photo.title ||
                          photo.translatedTitle ||
                          t(
                            "discovr.gallery.defaultTitle"
                          )
                        : photo.translatedTitle ||
                          photo.title ||
                          photo.originalTitle ||
                          t(
                            "discovr.gallery.defaultTitle"
                          );

                    return (
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
                        aria-label={t(
                          "discovr.gallery.selectImageAria",
                          {
                            number:
                              index +
                              1,
                            title:
                              photoTitle,
                          }
                        )}
                        aria-current={
                          index ===
                          carouselIndex
                            ? "true"
                            : undefined
                        }
                      />
                    );
                  }
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
                aria-label={t(
                  "discovr.gallery.nextImage"
                )}
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

      <Toast
        message={toastMessage}
      />
    </section>
  );
}

export default DiscovrGallery;