import Container from "../../components/common/Container/Container";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import PageMeta from "../../components/common/PageMeta/PageMeta";
import "./Accessibility.css";

function Accessibility() {
  return (
    <>
      <PageMeta
        title="Acessibilidade — SpaceVision"
        description="Consulta as medidas de acessibilidade implementadas no SpaceVision e as formas de comunicar dificuldades de utilização."
      />
      <main className="accessibility-page">
        <Container>
          <Breadcrumb title="Acessibilidade" />

          <header className="accessibility-page__header">
            <span className="accessibility-page__eyebrow">
              Inclusão digital
            </span>

            <h1>Declaração de acessibilidade</h1>

            <p>
              O SpaceVision está empenhado em proporcionar
              uma experiência digital acessível e inclusiva,
              permitindo que todas as pessoas possam explorar
              conteúdos e dados oficiais da NASA.
            </p>
          </header>

          <section aria-labelledby="commitment-title">
            <h2 id="commitment-title">
              O nosso compromisso
            </h2>

            <p>
              Procuramos melhorar continuamente a
              acessibilidade da plataforma e seguir as
              recomendações das Web Content Accessibility
              Guidelines, WCAG 2.2, no nível AA.
            </p>
          </section>

          <section aria-labelledby="measures-title">
            <h2 id="measures-title">
              Medidas de acessibilidade implementadas
            </h2>

            <ul>
              <li>
                Navegação através do teclado nas principais
                funcionalidades.
              </li>

              <li>
                Estrutura semântica com títulos, regiões e
                elementos HTML adequados.
              </li>

              <li>
                Textos alternativos em imagens relevantes.
              </li>

              <li>
                Etiquetas acessíveis em formulários e botões.
              </li>

              <li>
                Indicação visual clara do elemento com foco.
              </li>

              <li>
                Contraste de cores adequado entre texto e fundo.
              </li>

              <li>
                Mensagens de erro apresentadas de forma textual.
              </li>

              <li>
                Utilização de atributos ARIA quando necessário.
              </li>

              <li>
                Interface responsiva para diferentes tamanhos
                de ecrã.
              </li>

              <li>
                Conteúdo utilizável sem depender apenas da cor.
              </li>
            </ul>
          </section>

          <section aria-labelledby="compatibility-title">
            <h2 id="compatibility-title">
              Compatibilidade
            </h2>

            <p>
              O SpaceVision foi desenvolvido para funcionar
              nas versões recentes dos principais navegadores,
              incluindo Google Chrome, Mozilla Firefox,
              Microsoft Edge e Safari.
            </p>

            <p>
              A plataforma procura ser compatível com
              tecnologias de apoio, como leitores de ecrã,
              navegação por teclado e ferramentas de ampliação.
            </p>
          </section>

          <section aria-labelledby="limitations-title">
            <h2 id="limitations-title">
              Limitações conhecidas
            </h2>

            <p>
              Apesar dos esforços realizados, algumas áreas
              podem ainda não cumprir totalmente todos os
              requisitos de acessibilidade.
            </p>

            <ul>
              <li>
                Algumas visualizações tridimensionais podem
                ser mais difíceis de utilizar apenas através
                do teclado.
              </li>

              <li>
                Determinados conteúdos fornecidos pelas APIs
                externas da NASA podem não incluir descrições
                alternativas completas.
              </li>

              <li>
                Algumas informações científicas podem exigir
                melhorias adicionais na simplificação da
                linguagem.
              </li>
            </ul>

            <p>
              Estas limitações serão revistas e melhoradas
              progressivamente.
            </p>
          </section>

          <section aria-labelledby="feedback-title">
            <h2 id="feedback-title">
              Contacto e feedback
            </h2>

            <p>
              Caso encontres alguma barreira de acessibilidade
              ou tenhas dificuldade em utilizar uma
              funcionalidade, envia-nos uma mensagem através
              da página de contacto.
            </p>

            <p>
              Ao reportar um problema, indica sempre que
              possível:
            </p>

            <ul>
              <li>A página onde encontraste o problema;</li>
              <li>A dificuldade identificada;</li>
              <li>O navegador ou dispositivo utilizado;</li>
              <li>
                A tecnologia de apoio utilizada, caso se
                aplique.
              </li>
            </ul>
          </section>

          <section aria-labelledby="assessment-title">
            <h2 id="assessment-title">
              Avaliação da acessibilidade
            </h2>

            <p>
              A acessibilidade do SpaceVision é avaliada
              através de testes automáticos, inspeção manual,
              navegação por teclado e revisão dos principais
              fluxos da aplicação.
            </p>
          </section>

          <section aria-labelledby="update-title">
            <h2 id="update-title">
              Atualização desta declaração
            </h2>

            <p>
              Esta declaração foi atualizada em julho de 2026.
            </p>
          </section>
        </Container>
      </main>
      </>
      );
}

      export default Accessibility;