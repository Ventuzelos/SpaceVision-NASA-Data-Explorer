// Detalhes da foto EPIC
// Mostra a foto selecionada em tamanho grande, com legenda e coordenadas do centro visível
// Permite abrir a foto em um lightbox quando clicada
// Recebe como props: photo (objeto da foto selecionada), date (data da foto), onOpenLightbox (função para abrir o lightbox)



import { buildEpicUrls } from '../../services/epicService';

export default function EpicDetail({ photo, date, onOpenLightbox }) {
  if (!photo) return null;

  const { full } = buildEpicUrls(photo, date);
  const time = photo.date?.split(' ')[1]?.substring(0, 5) ?? '';
  const lat = photo.centroid_coordinates?.lat?.toFixed(1);
  const lon = photo.centroid_coordinates?.lon?.toFixed(1);

  return (
    <div className="card">
      <div className="card-header">
        <span>Terra — Disco Completo</span>
        <span>{time} UTC</span>
      </div>
      <img
        src={full}
        alt={photo.caption || photo.image}
        onClick={() => onOpenLightbox(full, photo.caption)}
        style={{ cursor: 'zoom-in' }}
      />
      <div>
        {photo.caption && <div>{photo.caption}</div>}
        {lat && lon && <div>Centro visível: {lat}° lat · {lon}° lon</div>}
      </div>
    </div>
  );
}

//nota: A função buildEpicUrls é responsável por construir as URLs das imagens EPIC com base no objeto da foto e na data fornecida. A função onOpenLightbox é chamada quando a imagem é clicada, permitindo que a foto seja aberta em um lightbox para visualização em tamanho maior.
