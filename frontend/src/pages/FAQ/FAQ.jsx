import { useState } from "react";

import Container from "../../components/common/Container/Container";
import Icon from "../../components/common/Icon/Icon";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import SearchInput from "../../components/common/SearchInput/SearchInput";

import "./FAQ.css";

const CATEGORIES = ["Todas", "APIs NASA", "Dados", "Conta"];

const FAQ_ITEMS = [
  {
    category: "APIs NASA",
    icon: "Satellite",
    question: "Que APIs da NASA o SpaceVision utiliza?",
    answer: (
      <>
        <p>
          O SpaceVision liga-se diretamente às APIs públicas da NASA para
          apresentar dados e imagens reais:
        </p>

        <ul className="faq-answer-grid">
          <li>
            <strong>APOD</strong>
            Astronomy Picture of the Day — a imagem astronómica do dia, com
            uma explicação escrita por astrónomos.
          </li>

          <li>
            <strong>DONKI</strong>
            Space Weather Database — erupções solares, ejeções de massa
            coronal e outros eventos de meteorologia espacial.
          </li>

          <li>
            <strong>EPIC</strong>
            Earth Polychromatic Imaging Camera — imagens do disco completo
            da Terra, captadas pelo satélite DSCOVR.
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
          O SpaceVision apresenta a informação mais recente disponibilizada
          publicamente pelas APIs da NASA. Algumas fontes são atualizadas
          diariamente, enquanto outras podem receber novos dados várias vezes
          ao longo do dia.
        </p>

        <div className="faq-callout">
          <Icon
            name="CheckCircle"
            size={16}
            aria-hidden="true"
          />

          <span>
            Dados obtidos através dos serviços oficiais da NASA.
          </span>
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
        Não. Podes navegar pelas páginas APOD, DONKI, EPIC, NeoWatch e
        Discover sem criar conta. A autenticação é necessária apenas para
        funcionalidades pessoais, como guardar favoritos e gerir o perfil.
      </p>
    ),
  },
  {
    category: "Conta",
    icon: "Heart",
    question: "Como funcionam os favoritos?",
    answer: (
      <p>
        Depois de iniciares sessão, podes selecionar o ícone de coração nos
        conteúdos disponíveis. Os favoritos ficam associados à tua conta e
        podem ser consultados na página <strong>Favoritos</strong>.
      </p>
    ),
  },
  {
    category: "Dados",
    icon: "Database",
    question: "Com que frequência os dados são atualizados?",
    answer: (
      <p>
        Depende da fonte. A EPIC pode publicar várias capturas por dia, a
        NeoWatch acompanha atualizações dos objetos próximos da Terra, o
        DONKI recebe novos eventos de meteorologia espacial e o APOD publica
        um novo conteúdo diariamente.
      </p>
    ),
  },
];

function FAQItem({
  item,
  panelId,
  triggerId,
  isOpen,
  onToggle,
}) {
  return (
    <article
      className={`faq-item${
        isOpen ? " faq-item--active" : ""
      }`}
    >
      <h2 className="faq-item__heading">
        <button
          id={triggerId}
          type="button"
          className="faq-item__trigger"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className="faq-item__question">
            <Icon
              name={item.icon}
              size={20}
              className="faq-item__icon"
              aria-hidden="true"
            />

            <span>{item.question}</span>
          </span>

          <Icon
            name="ChevronDown"
            size={18}
            className="faq-item__chevron"
            aria-hidden="true"
          />
        </button>
      </h2>

      <div
        id={panelId}
        className="faq-item__content"
        role="region"
        aria-labelledby={triggerId}
        hidden={!isOpen}
      >
        <div className="faq-item__answer">
          {item.answer}
        </div>
      </div>
    </article>
  );
}

function FAQ() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("Todas");
  const [openIndex, setOpenIndex] = useState(null);

  const term = search.trim().toLowerCase();

  const visibleItems = FAQ_ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === "Todas" ||
      item.category === activeCategory;

    const searchableText = [
      item.question,
      item.category,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !term || searchableText.includes(term);

    return matchesCategory && matchesSearch;
  });

  function handleToggle(index) {
    setOpenIndex((current) =>
      current === index ? null : index
    );
  }

  function handleCategoryChange(category) {
    setActiveCategory(category);
    setOpenIndex(null);
  }

  return (
    <main className="faq-page">
      <Container>
        <Breadcrumb title="FAQ" />

        <header className="faq-hero">
          <p className="faq-hero__eyebrow">
            Perguntas frequentes
          </p>

          <h1>Tudo o que precisas de saber</h1>

          <p className="faq-hero__description">
            Dúvidas sobre as APIs da NASA, a atualização dos dados e as
            funcionalidades do SpaceVision.
          </p>
        </header>

        <section
          className="faq-tools"
          aria-label="Pesquisa e filtros das perguntas frequentes"
        >
          <div className="faq-search">
            <SearchInput
              placeholder="Pesquisar por APOD, EPIC, favoritos..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div
            className="faq-filters"
            role="group"
            aria-label="Filtrar perguntas por categoria"
          >
            {CATEGORIES.map((category) => {
              const isActive =
                category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  className={`faq-filter${
                    isActive
                      ? " faq-filter--active"
                      : ""
                  }`}
                  onClick={() =>
                    handleCategoryChange(category)
                  }
                  aria-pressed={isActive}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        <section
          className="faq-list"
          aria-label="Perguntas frequentes"
          aria-live="polite"
        >
          {visibleItems.map((item) => {
            const index = FAQ_ITEMS.indexOf(item);
            const panelId = `faq-panel-${index}`;
            const triggerId = `faq-trigger-${index}`;

            return (
              <FAQItem
                key={item.question}
                item={item}
                panelId={panelId}
                triggerId={triggerId}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            );
          })}
        </section>

        {visibleItems.length === 0 && (
          <div
            className="faq-empty"
            role="status"
          >
            <Icon
              name="AlertCircle"
              size={32}
              aria-hidden="true"
            />

            <p>
              Não encontrámos nenhuma pergunta com esse termo.
            </p>

            <span>
              Tenta pesquisar por outra palavra-chave.
            </span>
          </div>
        )}
      </Container>
    </main>
  );
}

export default FAQ;