import { PlayCircle } from "lucide-react";
import "./APODHistoryCard.css";

function APODHistoryCard({ item, active, onSelect }) {
  const formattedDate = new Date(item.date).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
  });

  return (
    <button
      className={`apod-history-card ${active ? "apod-history-card--active" : ""}`}
      onClick={() => onSelect(item)}
      type="button"
    >
      <div className="apod-history-card__media">
        {item.media_type === "image" ? (
          <img src={item.url} alt={item.title} />
        ) : (
          <div className="apod-history-card__video">
            <PlayCircle size={42} />
            <span>Vídeo</span>
          </div>
        )}
      </div>

      <div className="apod-history-card__content">
        <span>{formattedDate}</span>

        <h3>{item.title}</h3>
      </div>
    </button>
  );
}

export default APODHistoryCard;