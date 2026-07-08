export default function EpicPanel({ photos, loading, loadingMsg, error, date, onSelect, onRetry }) {
  if (loading) {
    return (
      <div className="grid-wrap">
        <div className="state-msg">
          <div className="spinner" />
          {loadingMsg}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid-wrap">
        <div className="state-msg err">
          Não foi possível obter dados da EPIC.
          <br />
          {error}
          <br />
          <button className="btn" style={{ marginTop: 14 }} onClick={onRetry}>
            ↺ Tentar de novo
          </button>
        </div>
      </div>
    );
  }

  if (!photos || !photos.length) {
    return (
      <div className="grid-wrap">
        <div className="state-msg">Escolhe uma data ou carrega a captura mais recente.</div>
      </div>
    );
  }

  const [y, m, d] = date.split('-');

  return (
    <>
      <div className="meta-row">
        <span className="tag tag-glow">{photos.length} CAPTURAS</span>
        <span className="tag tag-green">DSCOVR · L1</span>
        <span className="tag">{date}</span>
      </div>
      <div className="grid-wrap">
        <div className="thumb-grid">
          {photos.map((p, i) => {
            const thumbUrl = `https://epic.gsfc.nasa.gov/archive/natural/${y}/${m}/${d}/thumbs/${p.image}.jpg`;
            const fullUrl = `https://epic.gsfc.nasa.gov/archive/natural/${y}/${m}/${d}/png/${p.image}.png`;
            const time = p.date ? p.date.split(' ')[1].substring(0, 5) : '';
            return (
              <div
                key={p.image + i}
                className="thumb"
                title={p.caption || ''}
                onClick={() => onSelect(p)}
              >
                <img
                  src={thumbUrl}
                  alt={p.image}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fullUrl;
                    e.target.style.objectFit = 'contain';
                  }}
                />
                <div className="t">{time} UTC</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}