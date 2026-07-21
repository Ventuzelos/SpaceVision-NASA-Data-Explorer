import LegalLayout from "../../../components/common/LegalLayout/LegalLayout";
import Icon from "../../../components/common/Icon/Icon";
import PageMeta from "../../../components/common/PageMeta/PageMeta";

const SECTIONS = [
  {
    id: "introducao-privacidade",
    icon: "Lock",
    title: "Introdução",
    content: (
      <p>
        Esta página explica que dados pessoais o SpaceVision guarda,
        porquê, e o que podes fazer para consultar ou apagar essa
        informação. Recolhemos o mínimo possível — só o que é necessário
        para a conta e os favoritos funcionarem.
      </p>
    ),
  },
  {
    id: "dados-recolhidos",
    icon: "Database",
    title: "Que dados guardamos",
    content: (
      <>
        <table className="legal-table">
          <thead>
            <tr>
              <th>Situação</th>
              <th>O que guardamos</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Navegação sem conta</td>
              <td>
                Nada de pessoal — podes ver APOD, DONKI, EPIC e NeoWatch
                sem fornecer qualquer dado.
              </td>
            </tr>
            <tr>
              <td>Registo de conta</td>
              <td>
                Nome, email e palavra-passe (esta última sempre
                encriptada, nunca em texto simples).
              </td>
            </tr>
            <tr>
              <td>Utilização da conta</td>
              <td>Os favoritos que guardas e os dados de perfil que editares.</td>
            </tr>
            <tr>
              <td>Formulário de contacto</td>
              <td>Nome, email e a mensagem que nos enviares.</td>
            </tr>
          </tbody>
        </table>
        <p>
          Não pedimos dados de pagamento, localização precisa, nem
          categorias especiais de dados (saúde, origem étnica, etc.).
        </p>
      </>
    ),
  },
  {
    id: "para-que-usamos",
    icon: "Settings2",
    title: "Para que usamos estes dados",
    content: (
      <ul>
        <li>Criar e proteger a tua conta;</li>
        <li>Guardar e sincronizar os teus favoritos entre sessões;</li>
        <li>Responder às mensagens que nos enviares;</li>
        <li>Manter a plataforma segura e a funcionar bem.</li>
      </ul>
    ),
  },
  {
    id: "armazenamento-seguranca",
    icon: "Server",
    title: "Onde guardamos e como protegemos",
    content: (
      <>
        <p>
          Os dados da tua conta ficam na base de dados do backend do
          SpaceVision, protegidos com medidas técnicas razoáveis. A
          palavra-passe é sempre guardada de forma encriptada.
        </p>
        <p>
          O token que mantém a tua sessão iniciada fica apenas no{" "}
          <strong>sessionStorage</strong> do teu navegador e desaparece
          sozinho quando fechas o separador — nunca fica guardado
          indefinidamente no teu dispositivo.
        </p>
        <div className="legal-callout">
          <Icon name="ShieldCheck" size={18} />
          <span>
            Nenhum sistema é 100% imune a incidentes, mas fazemos o
            possível para manter os teus dados seguros.
          </span>
        </div>
      </>
    ),
  },
  {
    id: "partilha",
    icon: "Share2",
    title: "Partilha com terceiros",
    content: (
      <>
        <p>Não vendemos nem alugamos os teus dados a ninguém. Só existem duas exceções técnicas:</p>
        <ul>
          <li>
            O <strong>alojamento</strong> onde o backend e a base de dados
            correm;
          </li>
          <li>
            As <strong>APIs da NASA</strong> (api.nasa.gov), usadas apenas
            para trazer dados e imagens — nunca enviamos dados teus para
            lá.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "direitos",
    icon: "UserCircle",
    title: "Os teus direitos",
    content: (
      <>
        <p>Nos termos do RGPD, podes a qualquer momento:</p>
        <ul>
          <li>Aceder aos dados que temos sobre ti;</li>
          <li>Corrigir informação desatualizada;</li>
          <li>Eliminar a tua conta e os dados associados, na página de Perfil;</li>
          <li>
            Apresentar reclamação junto da CNPD, se sentires que os teus
            direitos não foram respeitados.
          </li>
        </ul>
        <p>
          Se eliminares a conta, os teus dados e favoritos são removidos,
          salvo se a lei exigir que os guardemos por mais tempo.
        </p>
      </>
    ),
  },
  {
    id: "menores",
    icon: "Baby",
    title: "Crianças e menores",
    content: (
      <p>
        Qualquer pessoa pode explorar o SpaceVision sem conta, mas criar
        conta não é destinado a crianças menores de 13 anos sem o
        consentimento de um encarregado de educação. Se soubermos que
        recolhemos dados de uma criança sem esse consentimento,
        eliminamo-los.
      </p>
    ),
  },
  {
    id: "alteracoes-privacidade",
    icon: "RefreshCw",
    title: "Alterações a esta política",
    content: (
      <p>
        Esta política pode ser atualizada de vez em quando. A data no
        topo desta página mostra sempre a versão mais recente.
      </p>
    ),
  },
  {
    id: "contacto-privacidade",
    icon: "Mail",
    title: "Contacto",
    content: (
      <p>
        Para exercer os teus direitos ou tirar dúvidas, contacta-nos
        através da página <a href="/about">Sobre nós</a>.
      </p>
    ),
  },
];

function Privacy() {
  return (
    <>

      <PageMeta
        title="Política de privacidade — SpaceVision"
        description="Consulta como o SpaceVision trata os dados pessoais, favoritos, mensagens e informações da tua conta."
      />
      <LegalLayout
        icon="Lock"
        eyebrow="Legal"
        title="Política de Privacidade"
        description="Que dados o SpaceVision guarda, para quê, e como podes controlá-los."
        lastUpdated="16 de julho de 2026"
        summary="guardamos o mínimo possível: sem conta, não recolhemos nada de pessoal. Com conta, só o essencial para autenticação e favoritos — nunca vendido nem partilhado com terceiros."
        sections={SECTIONS}
      />
      </>
      );
}

      export default Privacy;