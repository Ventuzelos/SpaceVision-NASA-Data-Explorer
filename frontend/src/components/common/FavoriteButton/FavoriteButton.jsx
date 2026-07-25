import Icon from "../Icon/Icon";

import "./FavoriteButton.css";

function FavoriteButton({
  active = false,
  disabled = false,
  onClick,
  size = 18,
  ariaLabel,
  className = "",
}) {
  return (
    <button
      type="button"
      className={`favorite-button ${
        active ? "favorite-button--active" : ""
      } ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
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