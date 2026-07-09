// Cartão de detalhe — mostra a imagem completa da Terra (2048x2048)
// junto com legenda e coordenadas do centro visível.

export default function EpicCard({ detail, onImageClick }) {
  if (!detail) return null;

  const { url, caption, time, lat, lon } = detail;

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Terra — Disco Completo</span>
        <span className="card-label">{time ? `${time} UTC` : ''}</span>
      </div>
      <div style={{ textAlign: 'center' }}>
        <img
          src={url}
          alt={caption}
          onClick={onImageClick}
          style={{
            width: '100%',
            maxWidth: '380px',
            borderRadius: 'var(--radius-md)',
            display: 'block',
            margin: '0 auto',
            cursor: 'zoom-in',
          }}
        />
        <div
          style={{
            marginTop: '12px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-family)',
          }}
        >
          {caption && <div style={{ marginBottom: '6px' }}>{caption}</div>}
          {lat && lon && (
            <div>Centro visível: {lat}° lat · {lon}° lon</div>
          )}
          <div style={{ marginTop: '6px', color: 'var(--color-border)' }}>
            Formato PNG 2048×2048 px
          </div>
        </div>
      </div>
    </div>
  );
}