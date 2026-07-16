import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Cookie,
  ShieldCheck,
  Database,
  Globe2,
  SlidersHorizontal,
  History,
  Mail,
} from "lucide-react";

import Container from "../../components/common/Container/Container";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";

import "./Cookies.css";

const SECTIONS = [
  {
    id: "o-que-sao",
    label: "O que são cookies",
    icon: Cookie,
  },
  {
    id: "como-usamos",
    label: "Como o SpaceVision guarda dados",
    icon: Database,
  },
  {
    id: "terceiros",
    label: "APIs e serviços de terceiros",
    icon: Globe2,
  },
  {
    id: "controlo",
    label: "Como limpar ou desativar",
    icon: SlidersHorizontal,
  },
  {
    id: "alteracoes",
    label: "Alterações a esta política",
    icon: History,
  },
  {
    id: "contacto",
    label: "Contacto",
    icon: Mail,
  },
];

const STORAGE_ITEMS = [
  {
    name: "Sessão de autenticação",
    mechanism: "sessionStorage",
    duration: "Apagada ao fechar o separador",
    purpose: "Manter-te autenticado enquanto navegas na plataforma.",
  },
  {
    name: "Favoritos",
    mechanism: "localStorage",
    duration: "Até limpares os dados do navegador",
    purpose: "Guardar as imagens e capturas que marcaste com o coração.",
  },
  {
    name: "Cookies de publicidade ou rastreio",
    mechanism: "Não utilizados",
    duration: "—",
    purpose: "O SpaceVision não integra redes de anúncios nem pixels de terceiros.",
  },
];

function Cookies() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="cookies-page">
      <Container>
        <Breadcrumb title="Política de Cookies" />

        <header className="cookies-hero">
          <p className="cookies-page__eyebrow">Privacidade &amp; dados</p>
          <h1>Política de Cookies</h1>
          <p className="cookies-hero__description">
            O que fica guardado no teu navegador quando exploras o
            SpaceVision, e como podes controlá-lo.
          </p>
          <p className="cookies-hero__meta">
            Última atualização: 16 de julho de 2026
          </p>
        </header>

        <div className="cookies-summary">
          <ShieldCheck size={22} aria-hidden="true" />
          <p>
            <strong>Em resumo:</strong> o SpaceVision não usa cookies de
            publicidade nem de rastreio de terceiros. Guardamos apenas o
            essencial &mdash; sessão e favoritos &mdash; diretamente no teu
            navegador.
          </p>
        </div>

        <nav className="cookies-toc" aria-label="Secções da política">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`cookies-toc__link${
                activeId === id ? " cookies-toc__link--active" : ""
              }`}
              aria-current={activeId === id ? "true" : undefined}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="cookies-layout">
          <aside className="cookies-rail" aria-hidden="true">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`cookies-rail__link${
                  activeId === id ? " cookies-rail__link--active" : ""
                }`}
              >
                <Icon size={17} aria-hidden="true" />
                <span>{label}</span>
              </a>
            ))}
          </aside>

          <div className="cookies-content">
            <section
              id="o-que-sao"
              ref={(el) => (sectionRefs.current["o-que-sao"] = el)}
              className="cookies-section"
            >
              <span className="cookies-section__index">01</span>
              <h2>O que são cookies</h2>
              <p>
                Cookies são pequenos ficheiros de texto que um site pode
                pedir ao teu navegador para guardar, normalmente para
                lembrar quem és entre visitas ou para medir o uso da
                página. O teu navegador também oferece outras formas de
                armazenamento local &mdash; como o{" "}
                <code>localStorage</code> e o <code>sessionStorage</code>{" "}
                &mdash; que funcionam de forma parecida mas nunca são
                enviadas automaticamente para o servidor a cada pedido.
              </p>
              <p>
                É essa segunda forma, mais leve e mais privada, que o
                SpaceVision utiliza. Chamamos-lhe "cookies" nesta página
                porque é o termo que a maioria das pessoas reconhece, mas
                tecnicamente não colocamos cookies no teu navegador.
              </p>
            </section>

            <section
              id="como-usamos"
              ref={(el) => (sectionRefs.current["como-usamos"] = el)}
              className="cookies-section"
            >
              <span className="cookies-section__index">02</span>
              <h2>Como o SpaceVision guarda dados</h2>
              <p>
                A tabela seguinte resume tudo o que a aplicação guarda no
                teu navegador, para que serve e durante quanto tempo.
              </p>

              <div className="cookies-table-wrap">
                <table className="cookies-table">
                  <thead>
                    <tr>
                      <th scope="col">O que guarda</th>
                      <th scope="col">Mecanismo</th>
                      <th scope="col">Duração</th>
                      <th scope="col">Finalidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STORAGE_ITEMS.map((item) => (
                      <tr key={item.name}>
                        <td data-label="O que guarda">{item.name}</td>
                        <td data-label="Mecanismo">
                          <code>{item.mechanism}</code>
                        </td>
                        <td data-label="Duração">{item.duration}</td>
                        <td data-label="Finalidade">{item.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section
              id="terceiros"
              ref={(el) => (sectionRefs.current["terceiros"] = el)}
              className="cookies-section"
            >
              <span className="cookies-section__index">03</span>
              <h2>APIs e serviços de terceiros</h2>
              <p>
                O SpaceVision consulta as APIs públicas da NASA (
                <code>api.nasa.gov</code>) diretamente do teu navegador
                para obter imagens e dados. Esses pedidos não fazem a NASA
                colocar cookies no teu dispositivo através da nossa
                aplicação &mdash; apenas se saíres do SpaceVision e
                visitares{" "}
                <a href="https://www.nasa.gov/" target="_blank" rel="noreferrer">
                  nasa.gov
                </a>{" "}
                é que ficas sujeito à política de privacidade própria
                deles.
              </p>
              <p>
                O serviço onde este site está alojado pode registar
                cookies técnicos de infraestrutura (por exemplo, para
                balanceamento de carga ou proteção contra abuso), fora do
                controlo direto da aplicação.
              </p>
            </section>

            <section
              id="controlo"
              ref={(el) => (sectionRefs.current["controlo"] = el)}
              className="cookies-section"
            >
              <span className="cookies-section__index">04</span>
              <h2>Como limpar ou desativar</h2>
              <p>
                Podes apagar tudo o que o SpaceVision guardou a qualquer
                momento, sem pedir nada à nossa equipa:
              </p>
              <ul className="cookies-list">
                <li>
                  Terminar sessão apaga imediatamente o token de
                  autenticação guardado.
                </li>
                <li>
                  Limpar os dados de navegação do browser (definições
                  &rarr; privacidade &rarr; dados do site) remove os
                  favoritos e qualquer sessão ativa.
                </li>
                <li>
                  Navegar em modo privado/anónimo não guarda nada depois
                  de fechares a janela.
                </li>
              </ul>
              <p className="cookies-note">
                Nota: limpar os dados do navegador termina a tua sessão e
                esvazia a lista de favoritos guardada localmente.
              </p>
            </section>

            <section
              id="alteracoes"
              ref={(el) => (sectionRefs.current["alteracoes"] = el)}
              className="cookies-section"
            >
              <span className="cookies-section__index">05</span>
              <h2>Alterações a esta política</h2>
              <p>
                Se a forma como o SpaceVision guarda dados no teu
                navegador mudar &mdash; por exemplo, ao introduzir
                preferências de tema ou analítica interna &mdash;
                atualizamos esta página e a data no topo antes de essa
                alteração entrar em vigor.
              </p>
            </section>

            <section
              id="contacto"
              ref={(el) => (sectionRefs.current["contacto"] = el)}
              className="cookies-section"
            >
              <span className="cookies-section__index">06</span>
              <h2>Contacto</h2>
              <p>
                Tens dúvidas sobre privacidade ou sobre o que fica
                guardado no teu navegador? Fala com a equipa através da
                página{" "}
                <Link to="/about">Sobre nós</Link>.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default Cookies;
