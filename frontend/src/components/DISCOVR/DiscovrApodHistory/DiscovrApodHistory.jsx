import { useEffect, useState } from "react";

import Icon from "../../common/Icon/Icon";
import ErrorState from "../../common/ErrorState/ErrorState";
import Carousel from "../../common/Carousel/Carousel";
import APODHistoryCard from "../../apod/APODHistoryCard/APODHistoryCard";

import { getApodsByDateRange } from "../../../services/apodService";
import getApiErrorMessage from "../../../utils/getApiErrorMessage";

import "./DiscovrApodHistory.css";

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function buildApodPageUrl(dateStr) {
  const [year, month, day] = dateStr.split("-");

  return `https://apod.nasa.gov/apod/ap${year.slice(2)}${month}${day}.html`;
}

function DiscovrApodHistory() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadHistory() {
    try {
      setError("");
      setIsLoading(true);

      const today = new Date();

      const endDate = new Date(today);
      endDate.setDate(today.getDate() - 1);

      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);

      const results = await getApodsByDateRange(
        formatDate(startDate),
        formatDate(endDate)
      );

      const orderedResults = Array.isArray(results)
        ? [...results].sort(
          (firstItem, secondItem) =>
            new Date(secondItem.date) - new Date(firstItem.date)
        )
        : [];

      setHistory(orderedResults);
    } catch (err) {
      setHistory([]);

      setError(
        getApiErrorMessage(
          err,
          "Não foi possível carregar as imagens anteriores."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadHistory();
  }, []);

  function handleSelect(item) {
    window.open(
      buildApodPageUrl(item.date),
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <section id="apod-historico" className="discovr-section">
      <h2 className="discovr-section__title">
        <Icon name="Calendar" size={22} />
        Imagens anteriores
      </h2>

      <p className="discovr-section__subtitle">
        Explora as imagens astronómicas publicadas nos últimos dias.
      </p>

      {isLoading && (
        <div
          className="discovr-apod-history__skeleton"
          aria-hidden="true"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="discovr-skeleton discovr-apod-history__skeleton-card"
            />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <ErrorState
          title="Não foi possível carregar o histórico"
          message={error}
          onRetry={loadHistory}
        />
      )}

      {!isLoading && !error && (
        <Carousel>
          {history.map((item) => (
            <APODHistoryCard
              key={item.date}
              item={item}
              active={false}
              onSelect={handleSelect}
            />
          ))}
        </Carousel>
      )}
    </section>
  );
}

export default DiscovrApodHistory;
