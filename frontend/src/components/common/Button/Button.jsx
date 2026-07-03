import Button from "../common/Button/Button";

function Button({ children, variant = "primary", type = "button", onClick }) {
  return (
    <button className={`btn btn--${variant}`} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;