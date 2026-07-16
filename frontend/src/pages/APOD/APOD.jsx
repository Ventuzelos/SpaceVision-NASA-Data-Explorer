import { useEffect, useRef, useState } from "react";
import Container from "../../components/common/Container/Container";
import APODCard from "../../components/apod/APODCard";
import {
  getApod,
  getApodByDate,
} from "../../services/apodService";
import APODSkeleton from "../../components/apod/APODSkeleton/APODSkeleton";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import Section from "../../components/common/Section/Section";
import Carousel from "../../components/common/Carousel/Carousel";
import APODHistoryCard from "../../components/apod/APODHistoryCard/APODHistoryCard";
import ErrorState from "../../components/common/ErrorState/ErrorState";
import getApiErrorMessage from "../../utils/getApiErrorMessage";
import "./APOD.css";

function APOD() {
  const [apod, setApod] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState("");
  const [activeHistory, setActiveHistory] = useState("");
  const requestIdRef = useRef(0);

  async function loadApod(date = "") {
    const requestId = ++requestIdRef.current;

    try {
      setIsLoading(true);
      setError("");
      setApod(null);

      const data = date
        ? await getApodByDate(date)
        : await getApod();

      if (requestIdRef.current !== requestId) return;

      setApod(data);
      setSelectedDate(data.date);
    } catch (err) {
      if (requestIdRef.current !== requestId) return;

      setError(
        getApiErrorMessage(
          err,
          "Não foi possível carregar a imagem astronómica."
        )
      );
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }

  async function loadPreviousApods() {
    try {
      setHistoryError("");

      const today = new Date();

      const dates = Array.from({ length: 6 }, (_, index) => {
        const date = new Date(today);

        date.setDate(today.getDate() - (index + 1));

        return date.toISOString().split("T")[0];
      });

      const results = await Promise.all(
        dates.map((date) => getApodByDate(date))
      );

      setHistory(results);
    } catch (err) {
      setHistoryError(
        getApiErrorMessage(
          err,
          "Não foi possível carregar as imagens anteriores."
        )
      );
    }
  }


  function handleHistorySelect(selectedItem) {
    setApod(selectedItem);
    setSelectedDate(selectedItem.date);
    setActiveHistory(selectedItem.date);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadApod();

  loadPreviousApods();
}, []);

  return (
    <main className="apod-page">
      <section className="apod-hero">
        <Container>
          <Breadcrumb />

          <Section
            eyebrow="NASA Astronomy Picture of the Day"
            title="Imagem astronómica do dia"
            description="Explora diariamente uma imagem real da NASA, acompanhada da sua explicação científica."
          />
        </Container>
      </section>

      <Container>
        <Section>
          {isLoading && <APODSkeleton />}

          {error && !isLoading && (
            <ErrorState
              title="Não foi possível carregar a APOD"
              message={error}
              onRetry={() => loadApod(selectedDate)}
            />
          )}

          {apod && !isLoading && !error && (
            <APODCard apod={apod} />
          )}
        </Section>

        <Section
          title="Imagens anteriores"
          description="Explora as imagens astronómicas publicadas nos últimos dias."
        >
          {historyError ? (
            <ErrorState
              title="Não foi possível carregar o histórico"
              message={historyError}
              onRetry={loadPreviousApods}
            />
          ) : (
            <Carousel>
              {history.map((item) => (
                <APODHistoryCard
                  key={item.date}
                  item={item}
                  active={activeHistory === item.date}
                  onSelect={handleHistorySelect}
                />
              ))}
            </Carousel>
          )}
        </Section>
      </Container>

    </main>
  );
}

export default APOD;