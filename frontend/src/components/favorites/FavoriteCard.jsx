import Button from "../common/Button/Button";
import "./FavoriteCard.css";

function FavoriteCard({ favorite, onRemove }) {
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

  const imageUrl =
    favorite.image_url ||
    favoriteData.image_url ||
    favoriteData.imageUrl ||
    "";

  const favoriteType =
    favorite.nasa_type ||
    favorite.type ||
    "NASA";

  return (
    <article className="favorite-card">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={favorite.title || "Conteúdo favorito da NASA"}
        />
      ) : (
        <div className="favorite-card__image-placeholder">
          Imagem não disponível
        </div>
      )}

      <div className="favorite-card__content">
        <span className="favorite-card__type">
          {String(favoriteType).toUpperCase()}
        </span>

        <h2>{favorite.title || "Conteúdo sem título"}</h2>

        <p>{formattedDate}</p>

        <Button
          variant="secondary"
          onClick={() => onRemove(favorite.id)}
        >
          Remover
        </Button>
      </div>
    </article>
  );
}

export default FavoriteCard;