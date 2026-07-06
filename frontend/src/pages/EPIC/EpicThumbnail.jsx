//mostra UMA foto pequena (thumbnail) com a hora por baixo. 
//Se a imagem falhar a carregar, tenta a versão grande.
//Recebe como props: photo (objeto da foto), date (data da foto), onSelect (função para selecionar a foto)


import { buildEpicUrls } from '../../services/epicService';

export default function EpicThumbnail({ photo, date, onSelect }) {
  const { thumb, full } = buildEpicUrls(photo, date);
  const time = photo.date?.split(' ')[1]?.substring(0, 5) ?? '';

  return (
    <div className="rover-img-wrap" onClick={() => onSelect(photo)}>
      <img
        src={thumb}
        alt={photo.image}
        onError={e => { e.currentTarget.src = full; }}
      />
      <div className="thumb-time">{time} UTC</div>
    </div>
  );
}