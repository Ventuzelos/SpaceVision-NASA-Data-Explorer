import './EpicSectionHead.css';

export default function EpicSectionHead({ eyebrow, title, sub, style }) {
  return (
    <div className="section-head" style={style}>
      <div className="section-eyebrow">{eyebrow}</div>
      <div className="section-title">{title}</div>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}
