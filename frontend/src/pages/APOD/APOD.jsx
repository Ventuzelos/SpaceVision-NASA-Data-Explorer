import { useEffect, useState } from "react";
import Container from "../../components/common/Container/Container";
import APODCard from "../../components/apod/APODCard";
import {
  getApod,
  getApodByDate,
} from "../../services/apodService";
import APODSkeleton from "../../components/apod/APODSkeleton/APODSkeleton";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import Section from "../../components/common/Section/Section";
import Button from "../../components/common/Button/Button";
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

  async function loadApod(date = "") {
    try {
      setIsLoading(true);
      setError("");
      setApod(null);

      const data = date
        ? await getApodByDate(date)
        : await getApod();

      setApod(data);
      setSelectedDate(data.date);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Não foi possível carregar a imagem astronómica."
        )
      );
    } finally {
      setIsLoading(false);
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

  function loadTodayApod() {
    setActiveHistory("");
    loadApod();
  }

  function handleDateSubmit(event) {
    event.preventDefault();

    if (!selectedDate) {
      return;
    }

    setActiveHistory("");
    loadApod(selectedDate);
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

      <section className="apod-archive">
        <Container>
          <div className="apod-archive__box">
            <div>
              <p className="apod-archive__label">
                Arquivo APOD
              </p>

              <h2>Explora imagens de outros dias</h2>

              <p>
                Escolhe uma data e descobre qual foi a imagem
                astronómica publicada pela NASA nesse dia.
              </p>
            </div>

            <form
              className="apod-archive__form"
              onSubmit={handleDateSubmit}
            >
              <div className="apod-archive__field">
                <label htmlFor="apod-date">
                  Data da imagem
                </label>

                <input
                  id="apod-date"
                  type="date"
                  value={selectedDate}
                  max={new Date().toISOString().split("T")[0]}
                  disabled={isLoading}
                  onChange={(event) =>
                    setSelectedDate(event.target.value)
                  }
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !selectedDate}
              >
                {isLoading ? "A carregar..." : "Pesquisar"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                disabled={isLoading}
                onClick={loadTodayApod}
              >
                Hoje
              </Button>
            </form>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default APOD;