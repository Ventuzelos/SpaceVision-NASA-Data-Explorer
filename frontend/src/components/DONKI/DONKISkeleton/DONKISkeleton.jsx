import "./DONKISkeleton.css";

function DONKISkeleton() {
  return (
    <article className="donki-skeleton" aria-hidden="true">
      <div className="donki-skeleton__header">
        <div className="donki-skeleton__title" />
        <div className="donki-skeleton__badge" />
      </div>

      <div className="donki-skeleton__date" />

      <div className="donki-skeleton__meta" />
      <div className="donki-skeleton__meta donki-skeleton__meta--short" />

      <div className="donki-skeleton__actions">
        <div className="donki-skeleton__button" />
        <div className="donki-skeleton__icon" />
      </div>
    </article>
  );
}

export default DONKISkeleton;