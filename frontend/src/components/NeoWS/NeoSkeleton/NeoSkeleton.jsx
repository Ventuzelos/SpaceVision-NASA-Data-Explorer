import "./NeoSkeleton.css";

function NeoSkeleton() {
  return (
    <article className="neo-skeleton" aria-hidden="true">
      <div className="neo-skeleton__avatar" />

      <div className="neo-skeleton__main">
        <div className="neo-skeleton__title" />
        <div className="neo-skeleton__date" />

        <div className="neo-skeleton__meta-row">
          <div className="neo-skeleton__meta" />
          <div className="neo-skeleton__meta" />
        </div>
      </div>

      <div className="neo-skeleton__side">
        <div className="neo-skeleton__pill" />
      </div>
    </article>
  );
}

export default NeoSkeleton;