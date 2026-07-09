import './EpicSkeleton.css';

// Placeholder mostrado enquanto o EpicPanel aguarda a resposta da EPIC API.
// Reflete a mesma forma do resultado final (tags de meta-informação +
// grelha de miniaturas) para evitar saltos de layout quando os dados chegam.
export default function EpicSkeleton({ count = 10 }) {
  return (
    <div className="epic-skeleton" aria-hidden="true">
      <div className="epic-skeleton__meta">
        <span className="epic-skeleton__tag" />
        <span className="epic-skeleton__tag" />
        <span className="epic-skeleton__tag" />
      </div>

      <div className="epic-skeleton__grid">
        {Array.from({ length: count }).map((_, i) => (
          <div className="epic-skeleton__thumb" key={i}>
            <span className="epic-skeleton__time" />
          </div>
        ))}
      </div>
    </div>
  );
}
