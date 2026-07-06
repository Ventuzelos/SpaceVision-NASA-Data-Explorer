import Button from "../common/Button/Button";
import "./FavoriteCard.css";

function FavoriteCard({ favorite, onRemove }) {
  const formattedDate = new Date(favorite.date).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="favorite-card">
      <img src={favorite.imageUrl} alt={favorite.title} />

      <div className="favorite-card__content">
        <span className="favorite-card__type">
          {favorite.type.toUpperCase()}
        </span>

        <h2>{favorite.title}</h2>

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