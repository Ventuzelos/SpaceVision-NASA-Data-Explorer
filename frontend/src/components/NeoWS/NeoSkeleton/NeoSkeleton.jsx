import "./NeoSkeleton.css";

function NeoSkeleton() {
  return (
    <article className="neo-skeleton" aria-hidden="true">
      <div className="neo-skeleton__header">
        <div className="neo-skeleton__title" />
        <div className="neo-skeleton__icon" />
      </div>

      <div className="neo-skeleton__date" />

      <div className="neo-skeleton__meta" />
      <div className="neo-skeleton__meta" />
      <div className="neo-skeleton__meta neo-skeleton__meta--short" />
    </article>
  );
}

export default NeoSkeleton;
