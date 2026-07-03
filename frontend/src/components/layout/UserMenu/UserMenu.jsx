import "./UserMenu.css";

function UserMenu({ isAuthenticated }) {
  if (!isAuthenticated) {
    return (
      <button className="user-menu__button" type="button">
        Entrar
      </button>
    );
  }

  return (
    <div className="user-menu">
      <button className="user-menu__profile" type="button">
        Perfil
      </button>

      <button className="user-menu__logout" type="button">
        Terminar sessão
      </button>
    </div>
  );
}

export default UserMenu;