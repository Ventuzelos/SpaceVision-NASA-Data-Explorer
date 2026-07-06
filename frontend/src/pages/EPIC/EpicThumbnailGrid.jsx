//recebe uma lista de fotos e desenha um EpicThumbnail para cada uma. 
//É "composição" — um componente que usa outro componente dentro dele.
// . A prop onSelect é passada para cada EpicThumbnail, permitindo que o componente pai saiba qual foto foi selecionada.

import EpicThumbnail from './EpicThumbnail';

export default function EpicThumbnailGrid({ photos, date, onSelect }) {
  if (!photos.length) return null;

  return (
    <div className="rover-grid">
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