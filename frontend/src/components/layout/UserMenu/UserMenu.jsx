import Button from "../../common/Button/Button";
import "./UserMenu.css";

function UserMenu({ isAuthenticated }) {
  if (!isAuthenticated) {
    return (
      <Button variant="primary">
        Entrar
      </Button>
    );
  }

  return (
    <div className="user-menu">
      <Button variant="secondary">Perfil</Button>
      <Button variant="secondary">Favoritos</Button>
      <Button variant="outline">Terminar sessão</Button>
    </div>
  );
}

export default UserMenu;