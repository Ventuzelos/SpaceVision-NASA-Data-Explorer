import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Heart,
  LogOut,
  Shield,
  User,
} from "lucide-react";

import Button from "../../common/Button/Button";
import useAuth from "../../../hooks/useAuth";

import "./UserMenu.css";

function UserMenu({ onMobileNavigate }) {
  const { t } = useTranslation();
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

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

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
        aria-label={t("userMenu.loadingSession")}
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
              {t("userMenu.login")}
            </Button>
          </Link>

          <Link
            to="/register"
            onClick={handleMobileNavigation}
          >
            <Button variant="secondary">
              {t("userMenu.register")}
            </Button>
          </Link>
        </div>

        <div className="user-menu__guest-mobile">
          <Link
            to="/login"
            onClick={handleMobileNavigation}
          >
            <Button variant="primary">
              {t("userMenu.login")}
            </Button>
          </Link>

          <Link
            to="/register"
            onClick={handleMobileNavigation}
          >
            <Button variant="secondary">
              {t("userMenu.register")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const firstName =
    user?.name?.trim()?.split(" ")[0] ||
    t("userMenu.defaultUser");

  return (
    <div
      className="user-menu"
      ref={menuRef}
    >
      <div className="user-menu__desktop">
        <button
          type="button"
          className="account-menu-trigger"
          onClick={() =>
            setIsAccountMenuOpen(
              (current) => !current
            )
          }
          aria-label={t("userMenu.open")}
          aria-expanded={isAccountMenuOpen}
          aria-controls="account-dropdown"
        >
          <User
            size={20}
            aria-hidden="true"
          />

          <span className="account-menu-trigger__greeting">
            {t("userMenu.greeting", {
              name: firstName,
            })}
          </span>
        </button>

        {isAccountMenuOpen && (
          <div
            id="account-dropdown"
            className="account-dropdown"
          >
            <div className="account-dropdown__header">
              <span className="account-dropdown__avatar">
                {firstName
                  .charAt(0)
                  .toUpperCase()}
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
                <Shield
                  size={18}
                  aria-hidden="true"
                />

                {t("userMenu.adminPanel")}
              </Link>
            )}

            <Link
              to="/profile"
              className="account-dropdown__item"
              onClick={() =>
                setIsAccountMenuOpen(false)
              }
            >
              <User
                size={18}
                aria-hidden="true"
              />

              {t("navigation.profile")}
            </Link>

            <Link
              to="/favorites"
              className="account-dropdown__item"
              onClick={() =>
                setIsAccountMenuOpen(false)
              }
            >
              <Heart
                size={18}
                aria-hidden="true"
              />

              {t("navigation.favorites")}
            </Link>

            <div className="account-dropdown__divider" />

            <button
              type="button"
              className="account-dropdown__item account-dropdown__item--logout"
              onClick={handleLogout}
            >
              <LogOut
                size={18}
                aria-hidden="true"
              />

              {t("navigation.logout")}
            </button>
          </div>
        )}
      </div>

      <div className="user-menu__mobile">
        <div className="account-dropdown__header">
          <span
            className="account-dropdown__avatar"
            aria-hidden="true"
          >
            {firstName
              .charAt(0)
              .toUpperCase()}
          </span>

          <div>
            <strong>
              {t("userMenu.greeting", {
                name: firstName,
              })}
            </strong>

            <span>{user.email}</span>
          </div>
        </div>

        <div className="account-dropdown__divider" />

        {isAdmin && (
          <Link
            to="/admin"
            onClick={handleMobileNavigation}
          >
            <Button variant="secondary">
              {t("userMenu.adminPanel")}
            </Button>
          </Link>
        )}

        <Link
          to="/profile"
          onClick={handleMobileNavigation}
        >
          <Button variant="secondary">
            {t("navigation.profile")}
          </Button>
        </Link>

        <Link
          to="/favorites"
          onClick={handleMobileNavigation}
        >
          <Button variant="secondary">
            {t("navigation.favorites")}
          </Button>
        </Link>

        <Button
          variant="outline"
          onClick={handleLogout}
        >
          {t("navigation.logout")}
        </Button>
      </div>
    </div>
  );
}

export default UserMenu;