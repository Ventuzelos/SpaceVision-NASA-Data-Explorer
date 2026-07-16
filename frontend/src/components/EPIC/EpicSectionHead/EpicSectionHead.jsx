import "./EpicSectionHead.css";

export default function EpicSectionHead({
  eyebrow,
  title,
  sub,
  id,
  className = "",
}) {
  const titleId =
    id || `epic-section-${title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}`;

  return (
    <header
      className={`epic-section-head ${className}`.trim()}
    >
      <p className="epic-section-head__eyebrow">
        {eyebrow}
      </p>

      <h2
        id={titleId}
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