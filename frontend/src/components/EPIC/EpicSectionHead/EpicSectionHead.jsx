import "./EpicSectionHead.css";

export default function EpicSectionHead({
  eyebrow,
  title,
  sub,
  id,
  titleId,
  className = "",
}) {
  const generatedTitleId = title
    ? `epic-section-${title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}`
    : "epic-section-title";

  const resolvedTitleId =
    titleId || id || generatedTitleId;

  return (
    <header
      className={`epic-section-head ${className}`.trim()}
    >
      {eyebrow && (
        <p className="epic-section-head__eyebrow">
          {eyebrow}
        </p>
      )}

      <h2
        id={resolvedTitleId}
        className="epic-section-head__title"
      >
        {title}
      </h2>

      {sub && (
        <p className="epic-section-head__description">
          {sub}
        </p>
      )}
    </header>
  );
}