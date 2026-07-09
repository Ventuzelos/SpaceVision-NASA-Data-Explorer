import { useEffect, useState } from "react";
import Container from "../../components/common/Container/Container";
import APODCard from "../../components/apod/APODCard";
import { getApod } from "../../services/apodService";
import APODSkeleton from "../../components/apod/APODSkeleton/APODSkeleton";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import Section from "../../components/common/Section/Section";
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
          <Breadcrumb />

          <Section
            eyebrow="NASA Astronomy Picture of the Day"
            title="Imagem astronómica do dia"
            description="Explora diariamente uma imagem real da NASA, acompanhada da sua explicação científica."
          />
        </Container>
      </section>

      <Container>
        <Section
          title="Imagem em destaque"
          description="Conteúdo atualizado diariamente através da API oficial da NASA."
        >
          {isLoading && <APODSkeleton />}

          {error && <p className="apod-error">{error}</p>}

          {apod && <APODCard apod={apod} />}
        </Section>
      </Container>
    </main>
  );
}

export default APOD;