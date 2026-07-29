import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const [apod, setApod] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const requestIdRef = useRef(0);

  const loadApod = useCallback(
    async (date = "") => {
      const requestId = ++requestIdRef.current;

      try {
        setIsLoading(true);
        setError("");
        setApod(null);

        const data = date
          ? await getApodByDate(date)
          : await getApod();

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
            t("home.apod.loadError")
          )
        );
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      }
    },
    [t]
  );

 useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadApod();
}, [loadApod]);

  return (
    <>
      <PageMeta
        title={t("home.meta.title")}
        description={t("home.meta.description")}
      />

      <main>
        <Hero />

        <IntroSection />

        <ApiSection />

        <FilmStrip />

        <Container>
          <div className="home-apod-section">
            <Section
              eyebrow={t("home.apod.eyebrow")}
              title={t("home.apod.title")}
              description={t("home.apod.description")}
            >
              {isLoading && <APODSkeleton />}

              {error && !isLoading && (
                <ErrorState
                  title={t("home.apod.errorTitle")}
                  message={error}
                  onRetry={() =>
                    loadApod(selectedDate)
                  }
                />
              )}

              {apod && !isLoading && !error && (
                <APODCard
                  key={apod.date}
                  apod={apod}
                />
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