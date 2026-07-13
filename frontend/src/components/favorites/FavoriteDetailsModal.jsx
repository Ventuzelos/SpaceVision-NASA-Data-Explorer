import { useEffect } from "react";
import { ExternalLink, X } from "lucide-react";

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
      console.error(
        "Não foi possível interpretar os dados do favorito:",
        error
      );

      return {};
    }
  }

  return {};
}

function formatDate(value) {
  if (!value) {
    return "Data não disponível";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  return parsedDate.toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) {
    return "Data não disponível";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  const date = parsedDate.toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const time = parsedDate.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date} às ${time}`;
}

function formatShortDateTime(value) {
  if (!value) {
    return "Data não disponível";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  const date = parsedDate.toLocaleDateString("pt-PT");

  const time = parsedDate.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date}, ${time}`;
}

function formatNumber(value, maximumFractionDigits = 0) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Não disponível";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  return number.toLocaleString("pt-PT", {
    maximumFractionDigits,
  });
}

function formatValueWithUnit(
  value,
  unit,
  maximumFractionDigits = 0
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Não disponível";
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (
      trimmedValue
        .toLowerCase()
        .includes(unit.toLowerCase())
    ) {
      return trimmedValue;
    }

    const normalizedValue = trimmedValue
      .replace(/\s/g, "")
      .replace(",", ".");

    const numericValue = Number(normalizedValue);

    if (!Number.isNaN(numericValue)) {
      return `${formatNumber(
        numericValue,
        maximumFractionDigits
      )} ${unit}`;
    }

    return trimmedValue;
  }

  return `${formatNumber(
    value,
    maximumFractionDigits
  )} ${unit}`;
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
      data.image_url ||
      data.imageUrl ||
      data.hdurl ||
      data.hd_url ||
      data.url ||
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

  return (
    favorite.image_url ||
    data.image_url ||
    data.imageUrl ||
    data.url ||
    ""
  );
}

function getMetaValue(meta, possibleLabels) {
  if (!Array.isArray(meta)) {
    return null;
  }

  const normalizedLabels = possibleLabels.map((label) =>
    String(label).toLowerCase()
  );

  const matchingItem = meta.find((item) => {
    const itemLabel = String(
      item?.label || ""
    ).toLowerCase();

    return normalizedLabels.some(
      (label) =>
        itemLabel === label ||
        itemLabel.includes(label)
    );
  });

  return matchingItem?.value ?? null;
}

function getEstimatedDiameter(
  data,
  rawData,
  meta
) {
  const diameterFromData =
    data.diameter ||
    data.estimatedDiameter ||
    data.estimated_diameter_text ||
    data.estimatedDiameterText;

  if (diameterFromData) {
    return diameterFromData;
  }

  const diameterFromMeta = getMetaValue(meta, [
    "diâmetro estimado",
    "diametro estimado",
    "diâmetro",
    "diametro",
  ]);

  if (diameterFromMeta) {
    return diameterFromMeta;
  }

  const diameterMeters =
    rawData?.estimated_diameter?.meters ||
    data?.estimated_diameter?.meters;

  if (diameterMeters) {
    const minimum =
      diameterMeters.estimated_diameter_min;

    const maximum =
      diameterMeters.estimated_diameter_max;

    return `${formatNumber(minimum)} m – ${formatNumber(
      maximum
    )} m`;
  }

  const diameterKilometers =
    rawData?.estimated_diameter?.kilometers ||
    data?.estimated_diameter?.kilometers;

  if (diameterKilometers) {
    const minimum =
      diameterKilometers.estimated_diameter_min;

    const maximum =
      diameterKilometers.estimated_diameter_max;

    return `${formatNumber(
      minimum,
      2
    )} km – ${formatNumber(maximum, 2)} km`;
  }

  return "Não disponível";
}

function FavoriteDetailsModal({
  favorite,
  onClose,
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!favorite) {
    return null;
  }

  const data = parseFavoriteData(favorite.data);

  const favoriteType =
    getFavoriteType(favorite);

  const imageUrl = getImageUrl(
    favorite,
    data,
    favoriteType
  );

  const rawData =
    data.raw &&
    typeof data.raw === "object"
      ? data.raw
      : data;

  const neowsMeta = Array.isArray(data.meta)
    ? data.meta
    : Array.isArray(rawData.meta)
      ? rawData.meta
      : [];

  const approach =
    rawData.close_approach_data?.[0] ||
    data.close_approach_data?.[0] ||
    null;

  const neowsApproachDate =
    data.date ||
    data.approachDate ||
    data.approach_date ||
    data.closeApproachDate ||
    data.close_approach_date ||
    approach?.close_approach_date_full ||
    approach?.close_approach_date;

  const neowsDistanceKm =
    data.distanceKm ||
    data.distance_km ||
    data.missDistanceKm ||
    data.miss_distance_km ||
    data.missDistance ||
    data.miss_distance ||
    getMetaValue(neowsMeta, [
      "distância (miss distance)",
      "distancia (miss distance)",
      "miss distance",
      "distância",
      "distancia",
    ]) ||
    approach?.miss_distance?.kilometers;

  const neowsLunarDistance =
    data.lunarDistance ||
    data.lunar_distance ||
    data.distanceLunar ||
    data.distance_lunar ||
    getMetaValue(neowsMeta, [
      "distância lunar",
      "distancia lunar",
      "lunar distance",
    ]) ||
    approach?.miss_distance?.lunar;

  const neowsVelocity =
    data.velocityKmH ||
    data.velocity_kmh ||
    data.relativeVelocity ||
    data.relative_velocity ||
    data.relativeVelocityKmH ||
    data.relative_velocity_kmh ||
    getMetaValue(neowsMeta, [
      "velocidade relativa",
      "relative velocity",
      "velocidade",
    ]) ||
    approach?.relative_velocity
      ?.kilometers_per_hour;

  const neowsDiameter = getEstimatedDiameter(
    data,
    rawData,
    neowsMeta
  );

  const isHazardous =
    data.isHazardous ??
    data.hazardous ??
    data.is_potentially_hazardous_asteroid ??
    rawData.is_potentially_hazardous_asteroid ??
    false;

  const neowsRisk =
    data.risk ||
    data.riskLevel ||
    data.risk_level ||
    getMetaValue(neowsMeta, ["risco"]) ||
    (isHazardous ? "Elevado" : "Baixo");

  const neowsLink =
    data.link ||
    data.jplUrl ||
    data.jpl_url ||
    data.nasa_jpl_url ||
    rawData.nasa_jpl_url ||
    "";

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
        onClick={(event) =>
          event.stopPropagation()
        }
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
              <strong>Data:</strong>{" "}
              {formatDate(data.date)}
            </p>

            {data.copyright && (
              <p>
                <strong>Créditos:</strong>{" "}
                {data.copyright}
              </p>
            )}

            {data.explanation ||
            data.description ? (
              <div>
                <h3>Descrição</h3>

                <p>
                  {data.explanation ||
                    data.description}
                </p>
              </div>
            ) : (
              <p>
                Não existe uma descrição guardada
                neste favorito.
              </p>
            )}

            {data.media_type === "video" &&
              data.url && (
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
              <strong>Data:</strong>{" "}
              {formatDate(data.date)}
            </p>

            {data.caption ? (
              <div>
                <h3>Descrição</h3>
                <p>{data.caption}</p>
              </div>
            ) : (
              <p>
                Não existe uma descrição guardada
                neste favorito.
              </p>
            )}

            {data.centroid_coordinates && (
              <>
                <p>
                  <strong>Latitude:</strong>{" "}
                  {
                    data.centroid_coordinates
                      .lat
                  }
                </p>

                <p>
                  <strong>Longitude:</strong>{" "}
                  {
                    data.centroid_coordinates
                      .lon
                  }
                </p>
              </>
            )}

            {data.identifier && (
              <p>
                <strong>
                  Identificador:
                </strong>{" "}
                {data.identifier}
              </p>
            )}
          </div>
        )}

        {favoriteType === "donki" && (
          <div className="favorite-modal__details">
            <div className="favorite-modal__donki-summary">
              <p className="favorite-modal__donki-date">
                {formatDateTime(
                  data.date ||
                    data.event_date
                )}
              </p>

              {data.badge && (
                <span className="favorite-modal__donki-badge">
                  {data.badge}
                </span>
              )}
            </div>

            {Array.isArray(data.meta) &&
            data.meta.length > 0 ? (
              <dl className="favorite-modal__data-grid">
                {data.meta.map(
                  (item, index) => (
                    <div
                      className="favorite-modal__data-item"
                      key={`${item.label}-${index}`}
                    >
                      <dt>{item.label}</dt>

                      <dd>
                        {item.value ||
                          "Não disponível"}
                      </dd>
                    </div>
                  )
                )}
              </dl>
            ) : (
              <p>
                Não existem detalhes adicionais
                guardados para este evento.
              </p>
            )}

            {data.link && (
              <a
                className="favorite-modal__source-link"
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver fonte na NASA
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        )}

        {favoriteType === "neows" && (
          <div className="favorite-modal__details">
            <div className="favorite-modal__neows-summary">
              <p>
                <strong>Aproximação:</strong>{" "}
                {formatShortDateTime(
                  neowsApproachDate
                )}
              </p>

              <p
                className={`favorite-modal__risk ${
                  isHazardous
                    ? "favorite-modal__risk--high"
                    : "favorite-modal__risk--low"
                }`}
              >
                Risco: {neowsRisk}
              </p>
            </div>

            <dl className="favorite-modal__data-grid favorite-modal__data-grid--neows">
              <div className="favorite-modal__data-item">
                <dt>
                  Distância (miss distance)
                </dt>

                <dd>
                  {formatValueWithUnit(
                    neowsDistanceKm,
                    "km"
                  )}
                </dd>
              </div>

              <div className="favorite-modal__data-item">
                <dt>Distância lunar</dt>

                <dd>
                  {formatValueWithUnit(
                    neowsLunarDistance,
                    "LD",
                    2
                  )}
                </dd>
              </div>

              <div className="favorite-modal__data-item">
                <dt>Diâmetro estimado</dt>

                <dd>{neowsDiameter}</dd>
              </div>

              <div className="favorite-modal__data-item">
                <dt>Velocidade relativa</dt>

                <dd>
                  {formatValueWithUnit(
                    neowsVelocity,
                    "km/h"
                  )}
                </dd>
              </div>
            </dl>

            {neowsLink && (
              <a
                className="favorite-modal__source-link"
                href={neowsLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver no JPL
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        )}

        {Object.keys(data).length === 0 && (
          <div className="favorite-modal__details">
            <p>
              Este favorito não tem os dados completos
              guardados. Remove-o e volta a adicioná-lo
              para guardar todas as informações.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoriteDetailsModal;