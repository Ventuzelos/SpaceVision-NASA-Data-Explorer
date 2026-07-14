import { useState } from "react";

import Container from "../../components/common/Container/Container";
import Icon from "../../components/common/Icon/Icon";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import "./FAQ.css";
import SearchInput from "../../components/common/SearchInput/SearchInput";


const CATEGORIES = ["Todas", "APIs NASA", "Dados", "Conta"];

const FAQ_ITEMS = [
  {
    category: "APIs NASA",
    icon: "Satellite",
    question: "Que APIs da NASA o SpaceVision utiliza?",
    answer: (
      <>
        <p>
          O SpaceVision liga-se diretamente às APIs públicas da NASA
          (api.nasa.gov) para trazer dados e imagens reais:
        </p>
        <ul className="faq-answer-grid">
          <li>
            <strong>APOD</strong>
            Astronomy Picture of the Day — a imagem astronómica do dia, com
            explicação escrita por astrónomos.
          </li>
          <li>
            <strong>DONKI</strong>
            Space Weather Database — erupções solares, ejeções de massa
            coronal e outros eventos de meteorologia espacial.
          </li>
          <li>
            <strong>EPIC</strong>
            Earth Polychromatic Imaging Camera — imagens do disco completo da
            Terra, captadas pelo satélite DSCOVR.
            
          </li>
          <li>
            <strong>NeoWatch</strong>
            Near Earth Object Web Service — asteroides e cometas que passam
            perto da órbita da Terra.

          </li>
        </ul>
      </>
    ),
  },
  {
    category: "Dados",
    icon: "ShieldCheck",
    question: "Os dados apresentados são em tempo real?",
    answer: (
      <>
        <p>
          Sim. O SpaceVision não guarda nem inventa dados — cada pedido é
          feito diretamente à API oficial da NASA no momento em que visitas
          a página, por isso vês sempre a informação mais recente que a
          NASA disponibiliza publicamente.
        </p>
        <div className="faq-callout">
          <Icon name="CheckCircle" size={16} />
          <span>Dados servidos diretamente por api.nasa.gov, sem intermediários.</span>
        </div>
      </>
    ),
  },
  {
    category: "Conta",
    icon: "UserCircle",
    question: "Preciso de criar conta para explorar o site?",
    answer: (
      <p>
        Não. Podes navegar por todas as páginas — APOD, DONKI, EPIC e
        NeoWatch — sem criar conta. A conta ("Entrar") só é necessária se
        quiseres funcionalidades associadas ao teu perfil, como guardar
        favoritos entre sessões.
      </p>
    ),
  },
  {
    category: "Conta",
    icon: "Heart",
    question: "Como funcionam os favoritos?",
    answer: (
      <p>
        Basta clicar no ícone de coração em qualquer imagem ou captura para
        a guardar. Os favoritos ficam disponíveis na página{" "}
        <strong>Favoritos</strong>, guardados neste browser — se limpares os
        dados de navegação ou mudares de dispositivo, a lista não te
        acompanha.
      </p>
    ),
  },
  {
    category: "Dados",
    icon: "Database",
    question: "Com que frequência os dados são atualizados?",
    answer: (
      <p>
        Depende da fonte: a EPIC publica novas capturas várias vezes por
        dia à medida que o DSCOVR fotografa a Terra; a NeoWatch acompanha as
        atualizações de trajetória do CNEOS; e o APOD muda uma vez por dia.
        Como o SpaceVision consulta a API a cada visita, essas atualizações
        chegam-te assim que a NASA as publica.
      </p>
    ),
  },
];

function FAQItem({ item, panelId, isOpen, onToggle }) {
  return (
    <div className={`faq-item${isOpen ? " faq-item--active" : ""}`}>
      <button
        type="button"
        className="faq-item__trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="faq-item__question">
          <Icon name={item.icon} size={20} className="faq-item__icon" />
          <span>{item.question}</span>
        </span>
        <Icon name="ChevronDown" size={18} className="faq-item__chevron" />
      </button>

      <div className="faq-item__content" id={panelId}>
        <div className="faq-item__answer">{item.answer}</div>
      </div>
    </div>
  );
}

function FAQ() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [openIndex, setOpenIndex] = useState(null);

  const term = search.trim().toLowerCase();

  const visibleItems = FAQ_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === "Todas" || item.category === activeCategory;
    const matchesSearch = !term || item.question.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  function handleToggle(index) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <main className="faq-page">
      <Container>
        <Breadcrumb title="FAQ" />
        <header className="faq-hero">
          <span className="faq-hero__eyebrow">Perguntas Frequentes</span>
          <h1>Tudo o que precisas de saber</h1>
          <p>
            Dúvidas sobre as APIs da NASA, a atualização dos dados e as
            funcionalidades do SpaceVision.
          </p>
        </header>

        <div className="faq-search">
          <SearchInput
            placeholder="Pesquisar por APOD, EPIC, favoritos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="faq-filters">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`faq-filter${category === activeCategory ? " faq-filter--active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="faq-list">
          {visibleItems.map((item) => {
            const index = FAQ_ITEMS.indexOf(item);
            return (
              <FAQItem
                key={item.question}
                item={item}
                panelId={`faq-panel-${index}`}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            );
          })}
        </div>

        {visibleItems.length === 0 && (
          <div className="faq-empty">
            <Icon name="AlertCircle" size={32} />
            <p>Não encontrámos nenhuma pergunta com esse termo.</p>
            <span>Tenta pesquisar por outra palavra-chave.</span>
          </div>
        )}
      </Container>
    </main>
  );
}

export default FAQ;
