import { useEffect, useRef, useState } from "react";

import Hero from "../../components/home/Hero/Hero";
import IntroSection from "../../components/home/IntroSection/IntroSection";
import FilmStrip from "../../components/home/FilmStrip/FilmStrip";
import ApiSection from "../../components/home/ApiSection/ApiSection";
import CTASection from "../../components/home/CTASection/CTASection";

import Container from "../../components/common/Container/Container";
import Section from "../../components/common/Section/Section";
import ErrorState from "../../components/common/ErrorState/ErrorState";

import APODCard from "../../components/apod/APODCard";
import APODSkeleton from "../../components/apod/APODSkeleton/APODSkeleton";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import { getApod, getApodByDate } from "../../services/apodService";

import getApiErrorMessage from "../../utils/getApiErrorMessage";

import "./Home.css";

function Home() {
  const [apod, setApod] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const requestIdRef = useRef(0);

  async function loadApod(date = "") {
    const requestId = ++requestIdRef.current;

    try {
      setIsLoading(true);
      setError("");
      setApod(null);

      const data = date ? await getApodByDate(date) : await getApod();

      if (requestIdRef.current !== requestId) {
        return;
      }

      setApod(data);
      setSelectedDate(data.date);
    } catch (err) {
      if (requestIdRef.current !== requestId) {
        return;
      }

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadApod();
  }, []);

  return (
    <>
      <PageMeta
        title="SpaceVision — Explora dados reais da NASA"
        description="Explora imagens da Terra, meteorologia espacial, asteroides próximos e outros dados oficiais da NASA numa experiência visual e interativa."
      />

      <main>
        <Hero />

        <IntroSection />

        <ApiSection />

        <FilmStrip />

        <Container>
          <div className="home-apod-section">
            <Section
              eyebrow="NASA · APOD"
              title="Imagem astronómica do dia"
              description="Explora diariamente uma imagem real da NASA, acompanhada da sua explicação científica."
            >
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
          </div>
        </Container>

        <CTASection />
      </main>
    </>
  );
}

export default Home;