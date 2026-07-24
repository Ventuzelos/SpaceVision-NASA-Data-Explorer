import EpicCard from "../../../components/EPIC/EpicCard/EpicCard";

export default function EpicDetail({
  photo,
  onOpenLightbox,
}) {
  if (!photo) {
    return null;
  }

  function handleImageClick() {
    if (
      typeof onOpenLightbox === "function"
    ) {
      onOpenLightbox(photo);
    }
  }

  return (
    <EpicCard
      detail={photo}
      onImageClick={handleImageClick}
    />
  );
}