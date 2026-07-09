import { useEffect, useState } from "react";
import Container from "../../components/common/Container/Container";
import APODCard from "../../components/apod/APODCard";
import { getApod, getApodByDate } from "../../services/apodService";
import APODSkeleton from "../../components/apod/APODSkeleton/APODSkeleton";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import Section from "../../components/common/Section/Section";
import Button from "../../components/common/Button/Button";
import Carousel from "../../components/common/Carousel/Carousel";
import APODHistoryCard from "../../components/apod/APODHistoryCard/APODHistoryCard";
import "./APOD.css";

function APOD() {
  const [apod, setApod] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [activeHistory, setActiveHistory] = useState("");

  async function loadTodayApod() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getApod();
      setApod(data);
      setSelectedDate(data.date);
    } catch (err) {
      setError(err.message || "Erro ao carregar a imagem do dia.");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadPreviousApods() {
    try {
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
      console.error("Erro ao carregar imagens anteriores:", err);
    }
  }

  async function handleDateSubmit(event) {
    event.preventDefault();

    if (!selectedDate) return;

    try {
      setIsLoading(true);
      setError("");

      const data = await getApodByDate(selectedDate);
      setApod(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar a imagem dessa data.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleHistorySelect(selectedItem) {
    setApod(selectedItem);
    setSelectedDate(selectedItem.date);
    setActiveHistory(selectedItem.date);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  useEffect(() => {
    loadTodayApod();
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

          {error && <p className="apod-error">{error}</p>}

          {apod && !isLoading && <APODCard apod={apod} />}
        </Section>

        <Section
          title="Imagens anteriores"
          description="Explora as imagens astronómicas publicadas nos últimos dias."
        >
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
        </Section>
      </Container>

      <section className="apod-archive">
        <Container>
          <div className="apod-archive__box">
            <div>
              <p className="apod-archive__label">Arquivo APOD</p>
              <h2>Explora imagens de outros dias</h2>
              <p>
                Escolhe uma data e descobre qual foi a imagem astronómica
                publicada pela NASA nesse dia.
              </p>
            </div>

            <form className="apod-archive__form" onSubmit={handleDateSubmit}>
              <input
                type="date"
                value={selectedDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(event) => setSelectedDate(event.target.value)}
              />

              <Button type="submit">Pesquisar</Button>

              <Button
                type="button"
                variant="secondary"
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