import "./APODSkeleton.css";

function APODSkeleton() {
  return (
    <article
      className="apod-skeleton"
      aria-busy="true"
      aria-label="A carregar imagem astronómica do dia"
    >
      <div className="apod-skeleton__image"></div>

      <div className="apod-skeleton__content">
        <div className="apod-skeleton__badges">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="apod-skeleton__title"></div>

        <div className="apod-skeleton__text"></div>
        <div className="apod-skeleton__text"></div>
        <div className="apod-skeleton__text apod-skeleton__text--short"></div>

        <div className="apod-skeleton__actions">
          <span></span>
          <span></span>
        </div>
      </div>
    </article>
  );
}

export default APODSkeleton;