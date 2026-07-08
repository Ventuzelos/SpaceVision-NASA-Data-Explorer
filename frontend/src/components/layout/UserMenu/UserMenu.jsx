
import { Link } from "react-router-dom";
import Button from "../../common/Button/Button";
import "./UserMenu.css";

function UserMenu({ isAuthenticated}) {
  

  if (!isAuthenticated) {
    return (
      <Link to="/login">
        <Button variant="primary">Entrar</Button>
      </Link>
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