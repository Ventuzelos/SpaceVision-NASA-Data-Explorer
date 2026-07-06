import "./EPICSkeleton.css";

function EPICSkeleton() {
  return (
    <article className="epic-skeleton">
      {/* Esqueleto do Painel Superior */}
      <div className="epic-skeleton__panel"></div>

      {/* Esqueleto dos Controlos de Data */}
      <div className="epic-skeleton__controls">
        <div className="epic-skeleton__input"></div>
        <div className="epic-skeleton__button"></div>
      </div>

      {/* Conteúdo Principal Lado a Lado */}
      <div className="epic-skeleton__content">
        
        {/* Grelha de Miniaturas (Simula 4 cartões de imagem) */}
        <div className="epic-skeleton__grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="epic-skeleton__thumbnail"></div>
          ))}
        </div>

        {/* Detalhe da Imagem Ativa */}
        <div className="epic-skeleton__detail">
          <div className="epic-skeleton__large-image"></div>
          <div className="epic-skeleton__title"></div>
          <div className="epic-skeleton__text"></div>
          <div className="epic-skeleton__text epic-skeleton__text--short"></div>
        </div>

      </div>
    </article>
  );
}

export default EPICSkeleton;
