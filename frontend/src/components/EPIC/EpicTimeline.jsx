const TIMELINE_ITEMS = [
  {
    year: 'Fev 2015',
    title: 'Lançamento do DSCOVR',
    text: 'O satélite Deep Space Climate Observatory é lançado num foguetão Falcon 9 da SpaceX, numa parceria entre a NASA, a NOAA e a Força Aérea dos EUA.',
    color: 'var(--glow)',
    position: 'up',
  },
  {
    year: 'Jun 2015',
    title: 'Chegada ao ponto L1',
    text: 'Após meses de viagem, o DSCOVR entra em órbita a cerca de 1,5 milhões de km da Terra, no ponto de Lagrange L1.',
    color: 'var(--violet)',
    position: 'down',
  },
  {
    year: 'Verão 2015',
    title: 'Primeiras imagens da EPIC',
    text: 'A NASA divulga as primeiras imagens a cores naturais do disco completo da Terra, captadas pelo espectroradiómetro EPIC.',
    color: 'var(--green)',
    position: 'up',
  },
  {
    year: 'Desde 2015',
    title: 'Abertura da EPIC API',
    text: 'A EPIC API passa a disponibilizar publicamente cada captura e os respetivos metadados, prontos a explorar por qualquer pessoa.',
    color: 'var(--red)',
    position: 'down',
  },
  {
    year: 'Hoje',
    title: 'Mais de uma década de dados',
    text: 'A EPIC continua em operação, a capturar o disco completo da Terra a cada duas horas — um arquivo contínuo com mais de dez anos de imagens.',
    color: 'var(--glow)',
    position: 'up',
    active: true,
  },
];

function TimelineText({ item }) {
  return (
    <div className="timeline-h-content">
      <h4>{item.title}</h4>
      <p>{item.text}</p>
    </div>
  );
}

// Timeline horizontal: uma grelha de 3 linhas partilhadas por todos os
// marcos (texto de cima / linha+ponto / texto de baixo) garante que o
// ponto de cada marco fica sempre alinhado com a linha central, mesmo
// quando os textos "de cima" e "de baixo" têm alturas diferentes.
export default function EpicTimeline() {
  return (
    <div className="timeline-h">
      {TIMELINE_ITEMS.map((item, i) => (
        <div className="timeline-h-cell timeline-h-cell--top" key={`top-${i}`}>
          {item.position === 'up' && <TimelineText item={item} />}
        </div>
      ))}
      {TIMELINE_ITEMS.map((item, i) => (
        <div className="timeline-h-node" key={`node-${i}`}>
          <span
            className={`timeline-h-dot${item.active ? ' timeline-h-dot--active' : ''}`}
            style={{ '--dot-color': item.color }}
          />
          <span className="timeline-h-year" style={{ color: item.color }}>{item.year}</span>
        </div>
      ))}
      {TIMELINE_ITEMS.map((item, i) => (
        <div className="timeline-h-cell timeline-h-cell--bottom" key={`bottom-${i}`}>
          {item.position === 'down' && <TimelineText item={item} />}
        </div>
      ))}
    </div>
  );
}
