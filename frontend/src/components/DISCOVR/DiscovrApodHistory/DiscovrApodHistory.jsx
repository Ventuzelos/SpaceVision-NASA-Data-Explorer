import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import Icon from "../../common/Icon/Icon";
import ErrorState from "../../common/ErrorState/ErrorState";
import Carousel from "../../common/Carousel/Carousel";
import APODHistoryCard from "../../apod/APODHistoryCard/APODHistoryCard";

import { getApodsByDateRange } from "../../../services/apodService";
import getApiErrorMessage from "../../../utils/getApiErrorMessage";

import "./DiscovrApodHistory.css";

const HISTORY_DAYS = 6;

function padDatePart(value) {
  return String(value).padStart(
    2,
    "0"
  );
}

function formatDate(date) {
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

function isValidDateString(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    return false;
  }

  const [year, month, day] =
    value
      .split("-")
      .map(Number);

  const parsedDate = new Date(
    year,
    month - 1,
    day
  );

  return (
    parsedDate.getFullYear() ===
      year &&
    parsedDate.getMonth() ===
      month - 1 &&
    parsedDate.getDate() === day
  );
}

function getDateTimestamp(value) {
  if (!isValidDateString(value)) {
    return 0;
  }

  const [year, month, day] =
    value
      .split("-")
      .map(Number);

  return new Date(
    year,
    month - 1,
    day
  ).getTime();
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

function normalizeHistoryItem(
  item,
  defaultTitle
) {
  if (
    !item ||
    typeof item !== "object" ||
    !isValidDateString(
      item.date
    )
  ) {
    return null;
  }

  const title =
    typeof item.title ===
      "string"
      ? item.title.trim()
      : "";

  const explanation =
    typeof item.explanation ===
      "string"
      ? item.explanation.trim()
      : "";

  const originalTitle =
    item.original_title ||
    item.originalTitle ||
    item.title_original ||
    title ||
    "";

  const translatedTitle =
    item.translated_title ||
    item.translatedTitle ||
    item.title_pt ||
    title ||
    originalTitle;

  const originalExplanation =
    item.original_explanation ||
    item.originalExplanation ||
    item.explanation_original ||
    explanation ||
    "";

  const translatedExplanation =
    item.translated_explanation ||
    item.translatedExplanation ||
    item.explanation_pt ||
    explanation ||
    originalExplanation;

  return {
    ...item,

    title:
      title ||
      defaultTitle,

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

    media_type:
      typeof item.media_type ===
        "string"
        ? item.media_type
        : "image",
  };
}

function DiscovrApodHistory() {
  const { t, i18n } =
    useTranslation();

  const isEnglish =
    i18n.resolvedLanguage?.startsWith(
      "en"
    );

  const [history, setHistory] =
    useState([]);

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const mountedRef =
    useRef(true);

  const requestIdRef =
    useRef(0);

  const loadHistory = useCallback(
    async () => {
      const requestId =
        ++requestIdRef.current;

      if (mountedRef.current) {
        setError("");
        setIsLoading(true);
      }

      try {
        const today = new Date();

        today.setHours(
          0,
          0,
          0,
          0
        );

        const endDate = new Date(
          today
        );

        endDate.setDate(
          endDate.getDate() - 1
        );

        const startDate = new Date(
          endDate
        );

        startDate.setDate(
          startDate.getDate() -
            (HISTORY_DAYS - 1)
        );

        const startDateString =
          formatDate(startDate);

        const endDateString =
          formatDate(endDate);

        const results =
          await getApodsByDateRange(
            startDateString,
            endDateString
          );

        if (
          !mountedRef.current ||
          requestIdRef.current !==
            requestId
        ) {
          return;
        }

        const orderedResults =
          Array.isArray(results)
            ? results
                .map((item) =>
                  normalizeHistoryItem(
                    item,
                    t(
                      "discovr.apodHistory.defaultTitle"
                    )
                  )
                )
                .filter(Boolean)
                .sort(
                  (
                    firstItem,
                    secondItem
                  ) =>
                    getDateTimestamp(
                      secondItem.date
                    ) -
                    getDateTimestamp(
                      firstItem.date
                    )
                )
            : [];

        setHistory(
          orderedResults
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
          "Erro ao carregar o histórico APOD:",
          requestError
        );

        setHistory([]);

        setError(
          getApiErrorMessage(
            requestError,
            t(
              "discovr.apodHistory.errors.loadFallback"
            )
          )
        );
      } finally {
        if (
          mountedRef.current &&
          requestIdRef.current ===
            requestId
        ) {
          setIsLoading(false);
        }
      }
    },
    [t]
  );

  useEffect(() => {
    mountedRef.current = true;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadHistory();

    return () => {
      mountedRef.current =
        false;

      requestIdRef.current += 1;
    };
  }, [loadHistory]);

  function handleSelect(item) {
    const apodUrl =
      buildApodPageUrl(
        item?.date
      );

    if (!apodUrl) {
      return;
    }

    const openedWindow =
      window.open(
        apodUrl,
        "_blank",
        "noopener,noreferrer"
      );

    if (openedWindow) {
      openedWindow.opener =
        null;
    }
  }

  const localizedHistory =
    history.map((item) => {
      const localizedTitle =
        isEnglish
          ? item.originalTitle ||
            item.title ||
            item.translatedTitle ||
            t(
              "discovr.apodHistory.defaultTitle"
            )
          : item.translatedTitle ||
            item.title ||
            item.originalTitle ||
            t(
              "discovr.apodHistory.defaultTitle"
            );

      const localizedExplanation =
        isEnglish
          ? item.originalExplanation ||
            item.explanation ||
            item.translatedExplanation ||
            ""
          : item.translatedExplanation ||
            item.explanation ||
            item.originalExplanation ||
            "";

      return {
        ...item,
        title: localizedTitle,
        explanation:
          localizedExplanation,
      };
    });

  return (
    <section
      id="apod-historico"
      className="discovr-section"
      aria-labelledby="discovr-apod-history-title"
    >
      <h2
        id="discovr-apod-history-title"
        className="discovr-section__title"
      >
        {t(
          "discovr.apodHistory.title"
        )}
      </h2>

      <p className="discovr-section__subtitle">
        {t(
          "discovr.apodHistory.description"
        )}
      </p>

      {isLoading && (
        <div
          className="discovr-apod-history__skeleton"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label={t(
            "discovr.apodHistory.loadingAria"
          )}
        >
          {Array.from({
            length: HISTORY_DAYS,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="discovr-skeleton discovr-apod-history__skeleton-card"
                aria-hidden="true"
              />
            )
          )}
        </div>
      )}

      {!isLoading && error && (
        <ErrorState
          title={t(
            "discovr.apodHistory.errors.title"
          )}
          message={error}
          onRetry={loadHistory}
        />
      )}

      {!isLoading &&
        !error &&
        localizedHistory.length ===
          0 && (
          <div
            className="discovr-apod-history__empty"
            role="status"
          >
            <Icon
              name="ImageOff"
              size={24}
              aria-hidden="true"
            />

            <h3>
              {t(
                "discovr.apodHistory.empty.title"
              )}
            </h3>

            <p>
              {t(
                "discovr.apodHistory.empty.description"
              )}
            </p>
          </div>
        )}

      {!isLoading &&
        !error &&
        localizedHistory.length >
          0 && (
          <Carousel>
            {localizedHistory.map(
              (item) => (
                <APODHistoryCard
                  key={item.date}
                  item={item}
                  active={false}
                  onSelect={
                    handleSelect
                  }
                />
              )
            )}
          </Carousel>
        )}
    </section>
  );
}

export default DiscovrApodHistory;