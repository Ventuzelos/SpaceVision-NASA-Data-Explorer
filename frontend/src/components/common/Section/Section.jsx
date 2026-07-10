import "./Section.css";

function Section({ eyebrow, title, description, action, children }) {
  return (
    <section className="section">
      <div className="section__header">
        <div>
          {eyebrow && <p className="section__eyebrow">{eyebrow}</p>}
          {title && <h2 className="section__title">{title}</h2>}
          {description && (
            <p className="section__description">{description}</p>
          )}
        </div>

        {action && <div className="section__action">{action}</div>}
      </div>

      {children && <div className="section__content">{children}</div>}
    </section>
  );
}

export default Section;