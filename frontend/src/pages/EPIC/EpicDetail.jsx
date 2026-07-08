import EpicCard from '../../components/EPIC/EpicCard';

// EpicPanel passa a foto selecionada (já no formato "detail":
// { url, caption, time, lat, lon }) como prop `photo`.
export default function EpicDetail({ photo, date, onOpenLightbox }) {
  if (!photo) return null;

  return (
    <EpicCard
      detail={photo}
      onImageClick={() => onOpenLightbox?.(photo)}
    />
  );
}