import Icon from "../Icon/Icon";

import "./FavoriteButton.css";

function FavoriteButton({
  active = false,
  onClick,
  size = 18,
  ariaLabel,
}) {
  return (
    <button
      type="button"
      className={`favorite-button ${
        active ? "favorite-button--active" : ""
      }`}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
    >
      <Icon
        name="Heart"
        size={size}
        className={active ? "favorite-button__icon--active" : ""}
      />
    </button>
  );
}

export default FavoriteButton;