import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  LogOut,
  Shield,
  User,
} from "lucide-react";

import Button from "../../common/Button/Button";
import useAuth from "../../../hooks/useAuth";

import "./UserMenu.css";

function UserMenu({ onMobileNavigate }) {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    isAdmin,
    isAuthLoading,
    logout,
  } = useAuth();

  const [isAccountMenuOpen, setIsAccountMenuOpen] =
    useState(false);

  const menuRef = useRef(null);

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

  function handleMobileNavigation() {
    setIsAccountMenuOpen(false);
    onMobileNavigate?.();
  }

  async function handleLogout() {
    await logout();

    setIsAccountMenuOpen(false);
    onMobileNavigate?.();

    navigate("/");
  }
  
  if (isAuthLoading) {
    return (
      <div
        className="user-menu user-menu--loading"
        aria-label="A carregar sessão"
        aria-busy="true"
      >
        <span className="user-menu__skeleton" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="user-menu user-menu--guest">
        <div className="user-menu__guest-desktop">
          <Link
            to="/login"
            onClick={handleMobileNavigation}
          >
            <Button variant="primary">
              Entrar
            </Button>
          </Link>

          <Link
            to="/register"
            onClick={handleMobileNavigation}
            className="user-menu__register-link"
          >
            Registar
          </Link>
        </div>

        <div className="user-menu__guest-mobile">
          <Link
            to="/login"
            onClick={handleMobileNavigation}
          >
            <Button variant="primary">
              Entrar
            </Button>
          </Link>

          <Link
            to="/register"
            onClick={handleMobileNavigation}
          >
            <Button variant="secondary">
              Criar conta
            </Button>
          </Link>
        </div>
      </div>
    );
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
                onClick={() =>
                  setIsAccountMenuOpen(false)
                }
              >
                <Shield size={18} aria-hidden="true" />
                Painel Admin
              </Link>
            )}

            <Link
              to="/profile"
              className="account-dropdown__item"
              onClick={() =>
                setIsAccountMenuOpen(false)
              }
            >
              <User size={18} aria-hidden="true" />
              Perfil
            </Link>

            <Link
              to="/favorites"
              className="account-dropdown__item"
              onClick={() =>
                setIsAccountMenuOpen(false)
              }
            >
              <Heart size={18} aria-hidden="true" />
              Favoritos
            </Link>

            <div className="account-dropdown__divider" />

            <button
              type="button"
              className="account-dropdown__item account-dropdown__item--logout"
              onClick={handleLogout}
            >
              <LogOut size={18} aria-hidden="true" />
              Terminar sessão
            </button>
          </div>
        )}
      </div>

      <div className="user-menu__mobile">
        {isAdmin && (
          <Link
            to="/admin"
            onClick={handleMobileNavigation}
          >
            <Button variant="secondary">
              Painel Admin
            </Button>
          </Link>
        )}

        <Link
          to="/profile"
          onClick={handleMobileNavigation}
        >
          <Button variant="secondary">
            Perfil
          </Button>
        </Link>

        <Link
          to="/favorites"
          onClick={handleMobileNavigation}
        >
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