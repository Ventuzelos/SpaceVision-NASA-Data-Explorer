import Button from "../common/Button/Button";
import "./FavoriteCard.css";

function FavoriteCard({ favorite, onRemove, onView }) {
  const favoriteData = favorite?.data || {};

  const rawDate =
    favoriteData.date ||
    favoriteData.event_date ||
    favorite.created_at ||
    null;

  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Data não disponível";

  const favoriteType = String(
    favorite.nasa_type ||
      favorite.source ||
      favorite.type ||
      "NASA"
  ).toUpperCase();

  return (
    <article className="favorite-card">
      <div className="favorite-card__content">
        <span className="favorite-card__type">
          {favoriteType}
        </span>

        <h2>{favorite.title || "Conteúdo sem título"}</h2>

        <p>{formattedDate}</p>

        <div className="favorite-card__actions">
          <Button
            type="button"
            onClick={() => onView(favorite)}
          >
            Ver
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => onRemove(favorite.id)}
          >
            Remover
          </Button>
        </div>
      </div>
    </article>
  );
}

export default FavoriteCard;