import { Link, useNavigate } from "react-router-dom";
import Button from "../../common/Button/Button";
import { logoutUser } from "../../../services/authService";
import "./UserMenu.css";

function UserMenu({ user }) {
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return (
      <Link to="/login">
        <Button variant="primary">Entrar</Button>
      </Link>
    );
  }

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

  return (
    <div className="user-menu">
      {user.isAdmin && (
        <Link to="/admin">
          <Button variant="secondary">Painel Admin</Button>
        </Link>
      )}
      <Link to="/favorites">
        <Button variant="secondary">Favoritos</Button>
      </Link>
      <Button variant="outline" onClick={handleLogout}>
        Terminar sessão
      </Button>
    </div>
  );
}

export default UserMenu;