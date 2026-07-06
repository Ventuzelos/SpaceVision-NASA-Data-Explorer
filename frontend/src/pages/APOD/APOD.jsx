import { useEffect, useState } from "react";
import Container from "../../components/common/Container/Container";
import APODCard from "../../components/apod/APODCard";
import { getApod } from "../../services/apodService";
import APODSkeleton from "../../components/apod/APODSkeleton/APODSkeleton";
import "./APOD.css";

function APOD() {
  const [apod, setApod] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApod() {
      try {
        const data = await getApod();
        setApod(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadApod();
  }, []);

  return (
    <main className="apod-page">
      <section className="apod-hero">
        <Container>
          <p className="apod-hero__label">NASA Astronomy Picture of the Day</p>

          <h1>Imagem astronómica do dia</h1>

          <p className="apod-hero__text">
            Explora diariamente uma imagem real da NASA, acompanhada da sua
            explicação científica.
          </p>
        </Container>
      </section>

      <section className="apod-content">
        <Container>
          {isLoading && <APODSkeleton />}

          {error && <p className="apod-error">{error}</p>}

          {apod && <APODCard apod={apod} />}
        </Container>
      </section>
    </main>
  );
}

export default APOD;