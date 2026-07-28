import { useState } from "react";

import Container from "../../components/common/Container/Container";
import Icon from "../../components/common/Icon/Icon";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import SearchInput from "../../components/common/SearchInput/SearchInput";
import PageMeta from "../../components/common/PageMeta/PageMeta";
import Pagination from "../../components/common/Pagination/Pagination";

import "./FAQ.css";

const CATEGORIES = [
  "Todas",
  "Geral",
  "APIs NASA",
  "Dados",
  "Conta",
  "Favoritos",
  "Chave NASA",
  "Privacidade",
  "Suporte",
];

const FAQ_ITEMS = [
  {
    category: "Geral",
    icon: "Rocket",
    question: "O que é o SpaceVision?",
    keywords: "plataforma aplicação nasa universo espaço projeto",
    answer: (
      <p>
        O SpaceVision — NASA Data Explorer é uma plataforma educativa que
        reúne diferentes fontes oficiais da NASA numa única experiência.
        Permite explorar imagens astronómicas, meteorologia espacial,
        fotografias da Terra, asteroides, missões e outros conteúdos
        científicos de forma visual e acessível.
      </p>
    ),
  },
  {
    category: "Geral",
    icon: "ShieldCheck",
    question: "O SpaceVision é uma aplicação oficial da NASA?",
    keywords: "oficial nasa projeto académico universidade escola",
    answer: (
      <p>
        Não. O SpaceVision é um projeto académico independente. A plataforma
        utiliza dados e serviços oficiais disponibilizados publicamente pela
        NASA, mas não é desenvolvida, patrocinada ou administrada pela NASA.
      </p>
    ),
  },
  {
    category: "Geral",
    icon: "UserCircle",
    question: "Para quem foi criado o SpaceVision?",
    keywords: "público estudantes curiosidade ciência astronomia",
    answer: (
      <p>
        A plataforma foi criada para pessoas interessadas em ciência,
        tecnologia e exploração espacial, incluindo utilizadores sem
        conhecimentos avançados de astronomia. Também pode ser útil para
        estudantes, professores e entusiastas do espaço.
      </p>
    ),
  },
  {
    category: "Geral",
    icon: "Globe",
    question: "O SpaceVision funciona em telemóveis e tablets?",
    keywords: "mobile responsivo tablet smartphone computador desktop",
    answer: (
      <p>
        Sim. A interface foi desenvolvida para se adaptar a computadores,
        tablets e telemóveis. Algumas visualizações mais complexas, como os
        modelos 3D, podem ter um desempenho diferente dependendo do
        dispositivo utilizado.
      </p>
    ),
  },
  {
    category: "APIs NASA",
    icon: "Satellite",
    question: "Que APIs da NASA o SpaceVision utiliza?",
    keywords:
      "apod donki epic neows neowatch api astronomia meteorologia terra asteroides",
    answer: (
      <>
        <p>
          O SpaceVision utiliza diferentes serviços públicos da NASA:
        </p>

        <ul className="faq-answer-grid">
          <li>
            <strong>APOD</strong>
            Astronomy Picture of the Day — conteúdo astronómico diário
            acompanhado por uma explicação científica.
          </li>

          <li>
            <strong>DONKI</strong>
            Base de dados de meteorologia espacial, incluindo erupções
            solares, tempestades geomagnéticas e ejeções de massa coronal.
          </li>

          <li>
            <strong>EPIC</strong>
            Imagens do disco completo da Terra captadas pela câmara EPIC a
            bordo do satélite DSCOVR.
          </li>

          <li>
            <strong>NeoWS</strong>
            Dados sobre asteroides e outros objetos que passam próximos da
            órbita da Terra.
          </li>
        </ul>
      </>
    ),
  },
  {
    category: "APIs NASA",
    icon: "Image",
    question: "O que é a imagem astronómica do dia?",
    keywords: "apod fotografia vídeo astronomia imagem diária",
    answer: (
      <p>
        A Astronomy Picture of the Day, conhecida como APOD, é um conteúdo
        publicado diariamente pela NASA. Pode ser uma fotografia, uma
        ilustração científica ou um vídeo, acompanhado por uma explicação
        escrita por profissionais da área.
      </p>
    ),
  },
  {
    category: "APIs NASA",
    icon: "Sun",
    question: "O que é a meteorologia espacial?",
    keywords:
      "donki sol erupções solares tempestades geomagnéticas eventos solares",
    answer: (
      <p>
        A meteorologia espacial estuda as condições do Sol e do espaço que
        podem afetar a Terra e os seus sistemas tecnológicos. No SpaceVision,
        os dados DONKI permitem consultar eventos como erupções solares,
        ejeções de massa coronal e tempestades geomagnéticas.
      </p>
    ),
  },
  {
    category: "APIs NASA",
    icon: "Globe",
    question: "O que é a câmara EPIC?",
    keywords: "epic terra dscovr satélite imagens planeta",
    answer: (
      <p>
        A EPIC, ou Earth Polychromatic Imaging Camera, é uma câmara instalada
        no satélite DSCOVR. A partir de uma posição entre a Terra e o Sol,
        capta imagens do lado iluminado do planeta em vários comprimentos de
        onda.
      </p>
    ),
  },
  {
    category: "APIs NASA",
    icon: "Orbit",
    question: "O que são objetos próximos da Terra?",
    keywords:
      "asteroides neows neowatch objetos próximos perigosos órbita distância",
    answer: (
      <p>
        São asteroides ou cometas cujas órbitas passam relativamente perto da
        órbita terrestre. A designação não significa necessariamente que
        exista perigo de colisão. O SpaceVision apresenta dados como a
        distância, velocidade, dimensão estimada e classificação de risco.
      </p>
    ),
  },
  {
    category: "Dados",
    icon: "Database",
    question: "Os dados apresentados são em tempo real?",
    keywords: "tempo real atualizados nasa atraso cache",
    answer: (
      <>
        <p>
          O SpaceVision apresenta a informação mais recente disponibilizada
          publicamente pelas APIs da NASA. Nem todas as fontes funcionam em
          tempo real: algumas são atualizadas diariamente e outras recebem
          novos dados ao longo do dia.
        </p>

        <div className="faq-callout">
          <Icon
            name="CheckCircle"
            size={16}
            aria-hidden="true"
          />

          <span>
            A frequência de atualização depende de cada serviço da NASA.
          </span>
        </div>
      </>
    ),
  },
  {
    category: "Dados",
    icon: "Database",
    question: "Com que frequência os dados são atualizados?",
    keywords: "frequência atualização apod epic donki neows cache",
    answer: (
      <p>
        O APOD publica um novo conteúdo diariamente. A EPIC pode disponibilizar
        várias imagens por dia. O DONKI recebe eventos sempre que são
        registadas novas ocorrências de meteorologia espacial e o NeoWS é
        atualizado de acordo com os dados orbitais publicados pela NASA.
      </p>
    ),
  },
  {
    category: "Dados",
    icon: "AlertCircle",
    question: "Porque alguns dias não apresentam resultados?",
    keywords: "sem resultados data vazia nenhum evento erro",
    answer: (
      <p>
        Algumas datas podem não ter imagens ou eventos disponíveis. Isto não
        significa necessariamente que exista um erro: pode simplesmente não
        ter sido registado conteúdo nessa data. Experimenta selecionar outro
        dia ou aumentar o intervalo da pesquisa.
      </p>
    ),
  },
  {
    category: "Dados",
    icon: "Image",
    question: "Porque algumas imagens ou vídeos não carregam?",
    keywords: "imagem vídeo falha indisponível ligação youtube nasa",
    answer: (
      <p>
        Alguns conteúdos são alojados em serviços externos ou podem ficar
        temporariamente indisponíveis. Uma ligação lenta, limites da API ou
        bloqueios do navegador também podem impedir o carregamento. Atualiza a
        página e tenta novamente alguns minutos depois.
      </p>
    ),
  },
  {
    category: "Conta",
    icon: "UserCircle",
    question: "Preciso de criar conta para explorar o site?",
    keywords: "conta registo login sessão navegar",
    answer: (
      <p>
        Não. Podes consultar as áreas públicas sem criar conta. A autenticação
        é necessária apenas para funcionalidades pessoais, como guardar
        favoritos, gerir o perfil, descarregar os teus dados ou adicionar uma
        chave pessoal da NASA.
      </p>
    ),
  },
  {
    category: "Conta",
    icon: "UserCircle",
    question: "Como posso criar uma conta?",
    keywords: "registar criar conta nome email palavra-passe",
    answer: (
      <p>
        Abre a página de registo, introduz o teu nome, email e uma
        palavra-passe válida e confirma o formulário. Depois do registo,
        poderás iniciar sessão e utilizar as funcionalidades pessoais da
        plataforma.
      </p>
    ),
  },
  {
    category: "Conta",
    icon: "KeyRound",
    question: "Esqueci-me da palavra-passe. O que devo fazer?",
    keywords: "recuperar reset redefinir password palavra-passe email",
    answer: (
      <p>
        Na página de início de sessão, seleciona a opção de recuperação da
        palavra-passe. Introduz o email associado à tua conta e segue as
        instruções enviadas. Em ambiente de desenvolvimento, o envio pode ser
        registado nos logs do servidor.
      </p>
    ),
  },
  {
    category: "Conta",
    icon: "Trash2",
    question: "Como posso eliminar a minha conta?",
    keywords: "apagar eliminar conta perfil dados",
    answer: (
      <p>
        A eliminação da conta está disponível no Perfil, na área dedicada à
        gestão da conta. A ação requer confirmação e remove o acesso à conta.
        Antes de eliminar, podes descarregar uma cópia dos teus dados.
      </p>
    ),
  },
  {
    category: "Favoritos",
    icon: "Heart",
    question: "Como funcionam os favoritos?",
    keywords: "favoritos coração guardar remover conteúdos",
    answer: (
      <p>
        Depois de iniciares sessão, seleciona o ícone de coração num conteúdo
        compatível. O favorito fica associado à tua conta e pode ser
        consultado ou removido na página <strong>Favoritos</strong>.
      </p>
    ),
  },
  {
    category: "Favoritos",
    icon: "Heart",
    question: "Os favoritos ficam disponíveis noutros dispositivos?",
    keywords: "sincronização dispositivos conta telemóvel computador",
    answer: (
      <p>
        Sim. Os favoritos são guardados na tua conta e não apenas no
        navegador. Ao iniciares sessão noutro dispositivo com a mesma conta,
        deverás encontrar os conteúdos anteriormente guardados.
      </p>
    ),
  },
  {
    category: "Favoritos",
    icon: "UserCircle",
    question: "Porque preciso de iniciar sessão para guardar favoritos?",
    keywords: "autenticação sessão unauthenticated favorito",
    answer: (
      <p>
        A sessão permite associar cada favorito ao utilizador correto e
        mantê-lo disponível depois de fechar o navegador ou mudar de
        dispositivo. Sem sessão, podes continuar a explorar os conteúdos, mas
        não os podes guardar na tua coleção pessoal.
      </p>
    ),
  },
  {
    category: "Chave NASA",
    icon: "KeyRound",
    question: "O que é uma chave da API da NASA?",
    keywords: "api key chave nasa pedidos limite perfil",
    answer: (
      <p>
        É um código pessoal fornecido pela NASA para identificar os pedidos
        efetuados às suas APIs. Uma chave pessoal permite utilizar um limite
        próprio de pedidos, em vez de depender apenas da chave geral da
        aplicação.
      </p>
    ),
  },
  {
    category: "Chave NASA",
    icon: "KeyRound",
    question:
      "Como funciona a chave da API da NASA e porque devo utilizar uma chave pessoal?",
    keywords:
      "nasa api key chave pessoal chave geral limite pedidos bloqueio conta perfil obter criar",
    answer: (
      <>
        <p>
          O SpaceVision utiliza uma chave geral da API da NASA para permitir que
          os visitantes consultem os conteúdos sem terem de configurar uma chave
          própria. No entanto, essa chave é partilhada por todos os utilizadores
          da plataforma e possui um limite de pedidos.
        </p>

        <p>
          Quando muitas pessoas utilizam o site ao mesmo tempo, esse limite pode
          ser atingido temporariamente. Nessa situação, algumas imagens, eventos
          ou outros dados da NASA podem deixar de carregar até o limite ficar
          novamente disponível.
        </p>

        <p>
          Para evitar depender da chave partilhada, podes obter gratuitamente uma
          chave pessoal no portal oficial das APIs da NASA. Depois de iniciares
          sessão no SpaceVision, podes inserir essa chave na área dedicada à
          <strong> Chave NASA</strong> da página de Perfil.
        </p>

        <div className="faq-callout">
          <Icon
            name="ExternalLink"
            size={16}
            aria-hidden="true"
          />

          <span>
            Obtém uma chave pessoal no{" "}
            <a
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              portal oficial das APIs da NASA
            </a>
            .
          </span>
        </div>
      </>
    ),
  },
  {
    category: "Chave NASA",
    icon: "AlertCircle",
    question: "O que significa “limite de pedidos atingido”?",
    keywords: "rate limit excedido nasa pedidos 429",
    answer: (
      <p>
        Significa que a chave utilizada atingiu temporariamente o número
        máximo de pedidos permitido pela NASA. Podes aguardar pela renovação
        do limite ou adicionar uma chave pessoal da NASA na página de Perfil.
      </p>
    ),
  },
  {
    category: "Chave NASA",
    icon: "ShieldCheck",
    question: "A minha chave pessoal da NASA fica protegida?",
    keywords: "segurança privacidade api key chave encriptada",
    answer: (
      <p>
        A chave é enviada para o back-end e utilizada nos pedidos à NASA. Não
        deve ser exposta nos URLs, na interface pública ou a outros
        utilizadores. Podes substituí-la ou removê-la a qualquer momento no
        Perfil.
      </p>
    ),
  },
  {
    category: "Privacidade",
    icon: "ShieldCheck",
    question: "Que dados pessoais são guardados?",
    keywords: "dados pessoais nome email favoritos chave privacidade",
    answer: (
      <p>
        A aplicação guarda os dados necessários para gerir a conta, como nome,
        email e palavra-passe protegida. Também pode guardar favoritos,
        preferências e uma chave pessoal da NASA, quando o utilizador decide
        adicioná-la.
      </p>
    ),
  },
  {
    category: "Privacidade",
    icon: "ShieldCheck",
    question: "As palavras-passe são guardadas em texto simples?",
    keywords: "password palavra-passe hash segurança",
    answer: (
      <p>
        Não. As palavras-passe são processadas através dos mecanismos de
        segurança do Laravel e guardadas sob a forma de hash. Isto significa
        que a palavra-passe original não deve ficar diretamente legível na
        base de dados.
      </p>
    ),
  },
  {
    category: "Privacidade",
    icon: "Download",
    question: "Posso descarregar os meus dados?",
    keywords: "download exportar dados perfil rgpd",
    answer: (
      <p>
        Sim. A página de Perfil inclui uma opção para descarregar os dados
        associados à tua conta. Esta funcionalidade permite consultar a
        informação pessoal armazenada pela plataforma.
      </p>
    ),
  },
  {
    category: "Privacidade",
    icon: "ShieldCheck",
    question: "O SpaceVision utiliza cookies?",
    keywords: "cookies sessão preferências política",
    answer: (
      <p>
        A aplicação pode utilizar mecanismos técnicos necessários ao
        funcionamento da autenticação e da experiência do utilizador. Consulta
        a Política de Cookies disponível no rodapé para obter informação mais
        detalhada.
      </p>
    ),
  },
  {
    category: "Suporte",
    icon: "AlertCircle",
    question: "O que devo fazer quando aparece um erro de ligação?",
    keywords: "erro rede servidor backend cors ligação",
    answer: (
      <p>
        Confirma que tens ligação à Internet e atualiza a página. Em ambiente
        local, confirma também se o front-end e o servidor Laravel estão em
        execução. Caso o problema continue, tenta novamente mais tarde ou
        utiliza o formulário de contacto.
      </p>
    ),
  },
  {
    category: "Suporte",
    icon: "Globe",
    question: "Que navegadores são suportados?",
    keywords: "chrome edge firefox safari navegador browser",
    answer: (
      <p>
        O SpaceVision foi desenvolvido para funcionar nas versões recentes
        dos principais navegadores, incluindo Chrome, Edge e Firefox. Algumas
        funcionalidades visuais podem variar em navegadores antigos ou em
        dispositivos sem suporte para WebGL.
      </p>
    ),
  },
  {
    category: "Suporte",
    icon: "ShieldCheck",
    question: "O SpaceVision pode ser utilizado apenas com o teclado?",
    keywords: "acessibilidade teclado tab enter escape wcag",
    answer: (
      <p>
        A interface foi desenvolvida com suporte para navegação por teclado,
        incluindo menus, formulários, filtros, acordeões e modais. O foco deve
        permanecer visível durante a navegação com Tab, Shift + Tab, Enter e
        Escape.
      </p>
    ),
  },
  {
    category: "Suporte",
    icon: "HelpCircle",
    question: "Como posso contactar a equipa?",
    keywords: "contacto ajuda mensagem suporte equipa",
    answer: (
      <p>
        Podes utilizar o formulário de contacto disponível na página
        <strong> Sobre</strong>. As mensagens enviadas ficam disponíveis para
        consulta pelos administradores da plataforma.
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
      className={`faq-item${isOpen ? " faq-item--active" : ""
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

const ITEMS_PER_PAGE = 8;

function FAQ() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("Todas");
  const [openIndex, setOpenIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const term = search.trim().toLowerCase();

 const visibleItems = FAQ_ITEMS.filter((item) => {
  const matchesCategory =
    activeCategory === "Todas" ||
    item.category === activeCategory;

  const searchableText = [
    item.question,
    item.category,
    item.keywords ?? "",
  ]
    .join(" ")
    .toLowerCase();

  const matchesSearch =
    !term || searchableText.includes(term);

  return matchesCategory && matchesSearch;
});

const totalPages = Math.ceil(
  visibleItems.length / ITEMS_PER_PAGE
);

const startIndex =
  (currentPage - 1) * ITEMS_PER_PAGE;

const paginatedItems = visibleItems.slice(
  startIndex,
  startIndex + ITEMS_PER_PAGE
);

  function handleToggle(index) {
    setOpenIndex((current) =>
      current === index ? null : index
    );
  }

  function handleCategoryChange(category) {
    setActiveCategory(category);
    setOpenIndex(null);
    setCurrentPage(1);
  }

  return (
    <>
      <PageMeta
        title="Perguntas Frequentes — SpaceVision"
        description="Encontra respostas sobre o SpaceVision, as APIs da NASA, favoritos, conta de utilizador e utilização da plataforma."
      />
      <main className="faq-page">
        <Container>
          <Breadcrumb title="Perguntas Frequentes" />

          <header className="faq-hero">
            <p className="faq-hero__eyebrow">
              Perguntas frequentes
            </p>

            <h1>Tudo o que precisas de saber</h1>


            <p className="faq-hero__description">
              Encontra respostas sobre os dados da NASA, conta, favoritos,
              segurança, chave pessoal e funcionalidades do SpaceVision.
            </p>
          </header>

          <section
            className="faq-tools"
            aria-label="Pesquisa e filtros das perguntas frequentes"
          >
            <div className="faq-search">
              <SearchInput
                placeholder="Pesquisar por imagem do dia, asteroides, favoritos ou acesso à NASA..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                  setOpenIndex(null);
                }}
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
                    className={`faq-filter${isActive
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
            {paginatedItems.map((item) => {
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

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                setOpenIndex(null);

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            />
          )}

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
    </>
  );
}

export default FAQ;