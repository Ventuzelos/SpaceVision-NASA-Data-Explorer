import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

import "./Breadcrumb.css";

const routeNames = {
  apod: "APOD",
  donki: "DONKI",
  epic: "Earth",
  neowatch: "NeoWatch",
  gallery: "Discover",
  discover: "Discover",
  favorites: "Favoritos",
  about: "Sobre nós",
  faq: "FAQ",
  cookies: "Política de Cookies",
  profile: "Perfil",
  admin: "Administração",
};

function Breadcrumb({ title }) {
  const { pathname } = useLocation();

  const segments = pathname
    .split("/")
    .filter(Boolean);

  const items = [
    {
      label: "Home",
      to: "/",
    },
  ];

  let currentPath = "";

  segments.forEach((segment) => {
    currentPath += `/${segment}`;

    items.push({
      label:
        routeNames[segment] ||
        decodeURIComponent(segment),
      to: currentPath,
    });
  });

  if (title && items.length > 1) {
    items[items.length - 1] = {
      label: title,
    };
  }

  return (
    <nav
      className="breadcrumb"
      aria-label="Navegação estrutural"
    >
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast =
            index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="breadcrumb__item"
            >
              {isLast ? (
                <span
                  className="breadcrumb__current"
                  aria-current="page"
                >
                  {isFirst && (
                    <Home
                      size={15}
                      aria-hidden="true"
                    />
                  )}

                  {item.label}
                </span>
              ) : (
                <Link
                  className="breadcrumb__link"
                  to={item.to}
                >
                  {isFirst && (
                    <Home
                      size={15}
                      aria-hidden="true"
                    />
                  )}

                  {item.label}
                </Link>
              )}

              {!isLast && (
                <ChevronRight
                  className="breadcrumb__separator"
                  size={15}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;