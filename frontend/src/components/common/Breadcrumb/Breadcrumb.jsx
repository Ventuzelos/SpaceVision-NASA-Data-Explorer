import { Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import "./Breadcrumb.css";

const routeNames = {
  apod: "APOD",
  "donki": "DONKI",
  earth: "Earth",
  gallery: "Gallery",
  favorites: "Favorites",
  discover: "Discover",
  about: "Sobre nós",
};

function Breadcrumb({ title }) {
  const { pathname } = useLocation();

  const segments = pathname.split("/").filter(Boolean);

  const items = [{ label: "Home", to: "/" }];

  let currentPath = "";

  segments.forEach((segment) => {
    currentPath += `/${segment}`;

    items.push({
      label: routeNames[segment] || segment,
      to: currentPath,
    });
  });

  if (title) {
    items[items.length - 1] = {
      label: title,
    };
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="breadcrumb__item">
              {isLast ? (
                <span className="breadcrumb__current">
                  {index === 0 && <Home size={14} />}
                  {item.label}
                </span>
              ) : (
                <Link className="breadcrumb__link" to={item.to}>
                  {index === 0 && <Home size={14} />}
                  {item.label}
                </Link>
              )}

              {!isLast && (
                <span className="breadcrumb__separator">›</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;