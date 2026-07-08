// recebe uma lista de fotos e desenha um EpicThumbnail para cada uma.
// É "composição" — um componente que usa outro componente dentro dele.
// A prop onSelect é passada para cada EpicThumbnail, permitindo que o componente pai saiba qual foto foi selecionada.

import EpicThumbnail from './EpicThumbnail';

// Grid aplicado via style inline: garante o layout em quadrados
// independentemente de qualquer CSS global/framework que possa
// estar a sobrepor-se à classe .rover-grid.
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '14px',
  width: '100%',
};

export default function EpicThumbnailGrid({ photos, date, onSelect }) {
  if (!photos.length) return null;

  return (
    <div className="rover-grid" style={gridStyle}>
      {photos.map((foto, i) => (
        <EpicThumbnail
          key={i}
          photo={foto}
          date={date}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}