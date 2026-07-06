import EpicPanel from './EpicPanel';

function EPIC() {
  const handleOpenLightbox = (src, caption) => {

    // Placeholder temporário — substituir quando o Lightbox partilhado existir

    console.log('Abrir lightbox:', src, caption);
  };

  return (
    <div className="wrap">
      <h1>Earth Polychromatic Imaging Camera</h1>
      <EpicPanel onOpenLightbox={handleOpenLightbox} />
    </div>
  );
}

export default EPIC;

//notas
// 1. O componente EPIC é o ponto de entrada da página EPIC, renderizando o título e o painel de fotos.
// 2. A função handleOpenLightbox é um placeholder para abrir o lightbox, atualmente apenas loga a ação no console.
// 3. O componente EpicPanel é responsável por gerenciar o estado das fotos, carregando-as da API e permitindo a seleção de uma foto para exibição em tamanho grande.
//
// 4. O layout da página é simples, com um título e o painel de fotos, permitindo ao usuário interagir com as fotos EPIC de forma intuitiva.
//