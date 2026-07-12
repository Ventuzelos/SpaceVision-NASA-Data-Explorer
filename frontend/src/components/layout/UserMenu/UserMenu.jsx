import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Heart, LogOut, Shield, User } from "lucide-react";

import Button from "../../common/Button/Button";
import useAuth from "../../../hooks/useAuth";

import "./UserMenu.css";

function UserMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();

  const [isAccountMenuOpen, setIsAccountMenuOpen] =
    useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    setIsAccountMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="user-menu">
        <Link to="/login">
          <Button variant="primary">
            Entrar
          </Button>
        </Link>
      </div>
    );
  }

  async function handleLogout() {
    await logout();
    setIsAccountMenuOpen(false);
    navigate("/");
  }

  const firstName =
    user?.name?.trim()?.split(" ")[0] || "Utilizador";

  return (
    <div className="user-menu" ref={menuRef}>
      <div className="user-menu__desktop">
        <button
          type="button"
          className="account-menu-trigger"
          onClick={() =>
            setIsAccountMenuOpen((current) => !current)
          }
          aria-expanded={isAccountMenuOpen}
          aria-haspopup="menu"
          aria-controls="account-dropdown"
        >
          <span className="account-menu-trigger__text">
            <small>Olá, {firstName}</small>
            <strong>Minha conta</strong>
          </span>

          <ChevronDown
            size={18}
            aria-hidden="true"
            className={
              isAccountMenuOpen
                ? "account-menu-trigger__icon account-menu-trigger__icon--open"
                : "account-menu-trigger__icon"
            }
          />
        </button>

        {isAccountMenuOpen && (
          <div
            id="account-dropdown"
            className="account-dropdown"
            role="menu"
          >
            <div className="account-dropdown__header">
              <span className="account-dropdown__avatar">
                {firstName.charAt(0).toUpperCase()}
              </span>

              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
            </div>

            <div className="account-dropdown__divider" />

            {isAdmin && (
              <Link
                to="/admin"
                className="account-dropdown__item"
                role="menuitem"
              >
                <Shield size={18} aria-hidden="true" />
                Painel Admin
              </Link>
            )}

            <Link
              to="/profile"
              className="account-dropdown__item"
              role="menuitem"
            >
              <User size={18} aria-hidden="true" />
              Perfil
            </Link>

            <Link
              to="/favorites"
              className="account-dropdown__item"
              role="menuitem"
            >
              <Heart size={18} aria-hidden="true" />
              Favoritos
            </Link>

            <div className="account-dropdown__divider" />

            <button
              type="button"
              className="account-dropdown__item account-dropdown__item--logout"
              onClick={handleLogout}
              role="menuitem"
            >
              <LogOut size={18} aria-hidden="true" />
              Terminar sessão
            </button>
          </div>
        )}
      </div>

      <div className="user-menu__mobile">
        {isAdmin && (
          <Link to="/admin">
            <Button variant="secondary">
              Painel Admin
            </Button>
          </Link>
        )}

        <Link to="/profile">
          <Button variant="secondary">
            Perfil
          </Button>
        </Link>

        <Link to="/favorites">
          <Button variant="secondary">
            Favoritos
          </Button>
        </Link>

        <Button
          variant="outline"
          onClick={handleLogout}
        >
          Terminar sessão
        </Button>
      </div>
    </div>
  );
}

export default UserMenu;