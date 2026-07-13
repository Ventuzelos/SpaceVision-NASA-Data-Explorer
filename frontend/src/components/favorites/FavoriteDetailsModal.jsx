import { useEffect } from "react";
import { X } from "lucide-react";
import "./FavoriteDetailsModal.css";

function parseFavoriteData(data) {
  if (!data) {
    return {};
  }

  if (typeof data === "object") {
    return data;
  }

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Não foi possível interpretar os dados:", error);
      return {};
    }
  }

  return {};
}

function formatDate(date) {
  if (!date) {
    return "Data não disponível";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatNumber(value, maximumFractionDigits = 0) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "Não disponível";
  }

  return number.toLocaleString("pt-PT", {
    maximumFractionDigits,
  });
}

function getFavoriteType(favorite) {
  return String(
    favorite?.nasa_type ||
      favorite?.source ||
      favorite?.type ||
      "NASA"
  ).toLowerCase();
}

function getImageUrl(favorite, data, favoriteType) {
  if (favoriteType === "apod") {
    if (data.media_type === "video") {
      return "";
    }

    return (
      favorite.image_url ||
      data.hdurl ||
      data.url ||
      data.image_url ||
      ""
    );
  }

  if (favoriteType === "epic") {
    return (
      favorite.image_url ||
      data.image_url ||
      data.imageUrl ||
      data.url ||
      ""
    );
  }

  return favorite.image_url || data.image_url || data.url || "";
}

function FavoriteDetailsModal({ favorite, onClose }) {
  if (!favorite) {
    return null;
  }

  const data = parseFavoriteData(favorite.data);
  const favoriteType = getFavoriteType(favorite);
  const imageUrl = getImageUrl(favorite, data, favoriteType);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const approach = data.close_approach_data?.[0];

  return (
    <div
      className="favorite-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="favorite-modal-title"
      onClick={onClose}
    >
      <div
        className="favorite-modal__content"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="favorite-modal__close"
          onClick={onClose}
          aria-label="Fechar detalhes"
        >
          <X size={22} />
        </button>

        <span className="favorite-modal__type">
          {favoriteType.toUpperCase()}
        </span>

        <h2 id="favorite-modal-title">
          {favorite.title ||
            data.title ||
            data.name ||
            "Conteúdo sem título"}
        </h2>

        {imageUrl && (
          <img
            className="favorite-modal__image"
            src={imageUrl}
            alt={
              favorite.title ||
              data.title ||
              data.caption ||
              "Imagem da NASA"
            }
          />
        )}

        {favoriteType === "apod" && (
          <div className="favorite-modal__details">
            <p>
              <strong>Data:</strong> {formatDate(data.date)}
            </p>

            {data.copyright && (
              <p>
                <strong>Créditos:</strong> {data.copyright}
              </p>
            )}

            {data.explanation ? (
              <div>
                <h3>Descrição</h3>
                <p>{data.explanation}</p>
              </div>
            ) : (
              <p>Não existe uma descrição guardada neste favorito.</p>
            )}

            {data.media_type === "video" && data.url && (
              <a
                className="favorite-modal__link"
                href={data.url}
                target="_blank"
                rel="noreferrer"
              >
                Abrir vídeo
              </a>
            )}
          </div>
        )}

        {favoriteType === "epic" && (
          <div className="favorite-modal__details">
            <p>
              <strong>Data:</strong> {formatDate(data.date)}
            </p>

            {data.caption ? (
              <div>
                <h3>Descrição</h3>
                <p>{data.caption}</p>
              </div>
            ) : (
              <p>Não existe uma descrição guardada neste favorito.</p>
            )}

            {data.centroid_coordinates && (
              <>
                <p>
                  <strong>Latitude:</strong>{" "}
                  {data.centroid_coordinates.lat}
                </p>

                <p>
                  <strong>Longitude:</strong>{" "}
                  {data.centroid_coordinates.lon}
                </p>
              </>
            )}

            {data.identifier && (
              <p>
                <strong>Identificador:</strong> {data.identifier}
              </p>
            )}
          </div>
        )}

        {favoriteType === "donki" && (
          <div className="favorite-modal__details">
            <p>
              <strong>Data:</strong>{" "}
              {formatDate(
                data.beginTime ||
                  data.startTime ||
                  data.eventTime ||
                  data.event_date
              )}
            </p>

            {(data.classType || data.class_type) && (
              <p>
                <strong>Classe:</strong>{" "}
                {data.classType || data.class_type}
              </p>
            )}

            {(data.sourceLocation || data.source_location) && (
              <p>
                <strong>Localização:</strong>{" "}
                {data.sourceLocation || data.source_location}
              </p>
            )}

            {(data.activeRegionNum || data.active_region_num) && (
              <p>
                <strong>Região ativa:</strong>{" "}
                {data.activeRegionNum || data.active_region_num}
              </p>
            )}

            {data.note ? (
              <div>
                <h3>Descrição</h3>
                <p>{data.note}</p>
              </div>
            ) : (
              <p>Não existe uma descrição guardada neste favorito.</p>
            )}
          </div>
        )}

        {favoriteType === "neows" && (
          <div className="favorite-modal__details">
            <p>
              <strong>Nome:</strong>{" "}
              {data.name || favorite.title}
            </p>

            <p>
              <strong>Potencialmente perigoso:</strong>{" "}
              {data.is_potentially_hazardous_asteroid
                ? "Sim"
                : "Não"}
            </p>

            {data.absolute_magnitude_h !== undefined && (
              <p>
                <strong>Magnitude absoluta:</strong>{" "}
                {data.absolute_magnitude_h}
              </p>
            )}

            {data.estimated_diameter?.kilometers && (
              <p>
                <strong>Diâmetro estimado:</strong>{" "}
                {formatNumber(
                  data.estimated_diameter.kilometers
                    .estimated_diameter_min,
                  2
                )}
                {" – "}
                {formatNumber(
                  data.estimated_diameter.kilometers
                    .estimated_diameter_max,
                  2
                )}{" "}
                km
              </p>
            )}

            {approach && (
              <>
                <p>
                  <strong>Data de aproximação:</strong>{" "}
                  {formatDate(approach.close_approach_date)}
                </p>

                <p>
                  <strong>Velocidade:</strong>{" "}
                  {formatNumber(
                    approach.relative_velocity
                      ?.kilometers_per_hour
                  )}{" "}
                  km/h
                </p>

                <p>
                  <strong>Distância da Terra:</strong>{" "}
                  {formatNumber(
                    approach.miss_distance?.kilometers
                  )}{" "}
                  km
                </p>

                {approach.orbiting_body && (
                  <p>
                    <strong>Corpo orbitado:</strong>{" "}
                    {approach.orbiting_body}
                  </p>
                )}
              </>
            )}

            {data.nasa_jpl_url && (
              <a
                className="favorite-modal__link"
                href={data.nasa_jpl_url}
                target="_blank"
                rel="noreferrer"
              >
                Consultar na NASA JPL
              </a>
            )}
          </div>
        )}

        {Object.keys(data).length === 0 && (
          <div className="favorite-modal__details">
            <p>
              Este favorito não tem os dados completos guardados.
              Remove-o e volta a adicioná-lo para guardar todas as
              informações.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoriteDetailsModal;