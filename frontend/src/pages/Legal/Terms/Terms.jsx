import LegalLayout from "../../../components/common/LegalLayout/LegalLayout";
import Icon from "../../../components/common/Icon/Icon";
import PageMeta from "../../../components/common/PageMeta/PageMeta";

const SECTIONS = [
  {
    id: "introducao",
    icon: "FileText",
    title: "Introdução e aceitação",
    content: (
      <>
        <p>
          Este documento explica as regras de utilização do SpaceVision, uma
          plataforma educativa que apresenta dados e imagens públicas das
          APIs abertas da NASA (api.nasa.gov). Não é um produto comercial —
          é um projeto feito para explorar e aprender com dados reais do
          espaço.
        </p>
        <p>
          Ao usares o site, estás a concordar com estas regras. Se algo
          aqui não fizer sentido para ti, o melhor é não continuares a
          usar a plataforma e entrares em contacto connosco.
        </p>
      </>
    ),
  },
  {
    id: "o-que-e",
    icon: "Rocket",
    title: "O que podes fazer no SpaceVision",
    content: (
      <>
        <p>No site podes, sem precisares de conta:</p>
        <ul>
          <li>Ver a imagem astronómica do dia (APOD);</li>
          <li>Consultar eventos de meteorologia espacial (DONKI);</li>
          <li>Explorar imagens da Terra captadas pelo satélite DSCOVR (EPIC);</li>
          <li>Acompanhar asteroides próximos da Terra (NeoWatch).</li>
        </ul>
        <p>
          Criar conta é só necessário se quiseres guardar favoritos ou
          gerir um perfil. Como é um projeto educativo, não garantimos que
          o site esteja sempre disponível ou livre de erros — depende, em
          grande parte, das próprias APIs da NASA.
        </p>
      </>
    ),
  },
  {
    id: "a-tua-conta",
    icon: "UserCircle",
    title: "A tua conta",
    content: (
      <>
        <p>Se decidires criar conta, pedimos-te que:</p>
        <ul>
          <li>Uses dados verdadeiros no registo;</li>
          <li>Guardes bem a tua palavra-passe e não a partilhes;</li>
          <li>
            Nos avises se achares que alguém acedeu à tua conta sem
            autorização;
          </li>
          <li>
            Não uses bots, scraping intensivo ou automações que
            sobrecarreguem o site ou as APIs da NASA;
          </li>
          <li>
            Não tentes aceder a áreas administrativas ou a contas de
            outras pessoas.
          </li>
        </ul>
        <p>
          Podes eliminar a tua conta a qualquer momento, na página de
          Perfil, confirmando a palavra-passe.
        </p>
      </>
    ),
  },
  {
    id: "propriedade",
    icon: "Scale",
    title: "Propriedade intelectual",
    content: (
      <p>
        As imagens e dados científicos que vês vêm diretamente da NASA e
        seguem as condições de utilização da própria NASA, geralmente de
        domínio público. Já o design, o código e a marca "SpaceVision"
        foram criados especificamente para este projeto e não devem ser
        copiados ou usados comercialmente sem autorização.
      </p>
    ),
  },
  {
    id: "responsabilidade",
    icon: "AlertCircle",
    title: "Disponibilidade e responsabilidade",
    content: (
      <>
        <p>
          Como dependemos de APIs externas da NASA, pode haver
          indisponibilidades, atrasos ou dados incompletos que estão fora
          do nosso controlo. Podemos alterar, pausar ou descontinuar
          funcionalidades a qualquer momento, sem aviso prévio.
        </p>
        <div className="legal-callout">
          <Icon name="Info" size={18} />
          <span>
            O SpaceVision é fornecido "tal como está", sem garantias, e não
            nos responsabilizamos por danos resultantes do uso da
            plataforma ou de imprecisões nos dados da NASA.
          </span>
        </div>
      </>
    ),
  },
  {
    id: "alteracoes-termos",
    icon: "RefreshCw",
    title: "Alterações a estes termos",
    content: (
      <p>
        Podemos atualizar estes Termos de vez em quando. Quando isso
        acontecer, atualizamos a data no topo desta página. Continuar a
        usar o SpaceVision depois de uma alteração significa que aceitas
        os novos termos.
      </p>
    ),
  },
  {
    id: "contacto-termos",
    icon: "Mail",
    title: "Contacto",
    content: (
      <p>
        Tens dúvidas sobre estes Termos? Fala connosco através da página{" "}
        <a href="/about">Sobre nós</a>.
      </p>
    ),
  },
];

function Terms() {
  return (
    <>
      <PageMeta
        title="Termos de utilização — SpaceVision"
        description="Consulta os termos de utilização aplicáveis à plataforma SpaceVision."
      />
      <LegalLayout
        icon="Scale"
        eyebrow="Legal"
        title="Termos e Condições"
        description="As regras simples que tornam o SpaceVision justo para todos — o que podes esperar do serviço e o que pedimos em troca."
        lastUpdated="16 de julho de 2026"
        summary="o SpaceVision é um projeto educativo gratuito, sem garantias comerciais. Não precisas de conta para explorar os dados da NASA — só se quiseres guardar favoritos ou gerir um perfil."
        sections={SECTIONS}
      />
      </>
      );
}

      export default Terms;
