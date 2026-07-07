import api from "./api";

const FEED_ENDPOINT = "/neo/rest/v1/feed";

// Limite imposto pela NASA NeoWS Feed API: máx. 7 dias por pesquisa (RF-06)
export const MAX_RANGE_DAYS = 7;

function toISODate(date) {
  return date.toISOString().split("T")[0];
}

function diffInDays(startISO, endISO) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

/**
 * Devolve um intervalo de datas por omissão, a partir de hoje.
 */
export function getDefaultDateRange(daysAhead = MAX_RANGE_DAYS) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + Math.min(daysAhead, MAX_RANGE_DAYS));

  return {
    startDate: toISODate(startDate),
    endDate: toISODate(endDate),
  };
}

/**
 * Garante que o intervalo [startDate, endDate] nunca excede o limite da API (RF-06).
 * Se exceder, o endDate é "clampado" para startDate + MAX_RANGE_DAYS.
 * Devolve também um indicador de que o intervalo foi ajustado.
 */
export function clampDateRange(startDate, endDate) {
  const start = new Date(startDate);
  let end = new Date(endDate);
  let wasClamped = false;

  if (end < start) {
    end = new Date(start);
    wasClamped = true;
  }

  const diffDays = diffInDays(toISODate(start), toISODate(end));

  if (diffDays > MAX_RANGE_DAYS) {
    end = new Date(start);
    end.setDate(end.getDate() + MAX_RANGE_DAYS);
    wasClamped = true;
  }

  return {
    startDate: toISODate(start),
    endDate: toISODate(end),
    wasClamped,
  };
}

function normalizeNeo(neo, closeApproach) {
  const diameterKm = neo.estimated_diameter?.kilometers;
  const diameterMin = diameterKm?.estimated_diameter_min ?? null;
  const diameterMax = diameterKm?.estimated_diameter_max ?? null;

  return {
    id: neo.id,
    neoReferenceId: neo.neo_reference_id,
    name: neo.name?.replace(/[()]/g, "") ?? "Objeto desconhecido",
    isHazardous: Boolean(neo.is_potentially_hazardous_asteroid),
    isSentryObject: Boolean(neo.is_sentry_object),
    absoluteMagnitude: neo.absolute_magnitude_h ?? null,
    diameterMinKm: diameterMin,
    diameterMaxKm: diameterMax,
    diameterAvgKm:
      diameterMin != null && diameterMax != null
        ? (diameterMin + diameterMax) / 2
        : null,
    jplUrl: neo.nasa_jpl_url,
    closeApproachDate:
      closeApproach?.close_approach_date_full ||
      closeApproach?.close_approach_date ||
      null,
    missDistanceKm: closeApproach?.miss_distance?.kilometers
      ? Number(closeApproach.miss_distance.kilometers)
      : null,
    missDistanceLunar: closeApproach?.miss_distance?.lunar
      ? Number(closeApproach.miss_distance.lunar)
      : null,
    velocityKmH: closeApproach?.relative_velocity?.kilometers_per_hour
      ? Number(closeApproach.relative_velocity.kilometers_per_hour)
      : null,
    orbitingBody: closeApproach?.orbiting_body || "Terra",
  };
}

/**
 * RF-06 — Vai buscar os objetos próximos da Terra num intervalo de datas.
 * O intervalo é sempre validado/limitado a MAX_RANGE_DAYS antes do pedido.
 */
export async function fetchNeoFeed(startDate, endDate) {
  const { startDate: safeStart, endDate: safeEnd } = clampDateRange(
    startDate,
    endDate
  );

  const { data } = await api.get(FEED_ENDPOINT, {
    params: { start_date: safeStart, end_date: safeEnd },
  });

  const byDate = data?.near_earth_objects || {};

  const objects = Object.values(byDate)
    .flat()
    .map((neo) => normalizeNeo(neo, neo.close_approach_data?.[0]));

  return {
    elementCount: data?.element_count ?? objects.length,
    startDate: safeStart,
    endDate: safeEnd,
    objects,
  };
}

/**
 * RF-08 — Ordena a lista por distância de aproximação ("miss distance").
 */
export function sortByMissDistance(objects, direction = "asc") {
  return [...objects].sort((a, b) => {
    const distA = a.missDistanceKm ?? Infinity;
    const distB = b.missDistanceKm ?? Infinity;
    return direction === "asc" ? distA - distB : distB - distA;
  });
}

/**
 * RF-07 — Estatísticas agregadas: total, contagem de perigosos,
 * objeto mais próximo e maior diâmetro estimado.
 */
export function computeStats(objects) {
  if (!objects.length) {
    return {
      total: 0,
      hazardousCount: 0,
      closest: null,
      largest: null,
    };
  }

  const hazardousCount = objects.filter((neo) => neo.isHazardous).length;

  const closest = objects.reduce((min, neo) => {
    if (neo.missDistanceKm == null) return min;
    if (!min || neo.missDistanceKm < min.missDistanceKm) return neo;
    return min;
  }, null);

  const largest = objects.reduce((max, neo) => {
    if (neo.diameterMaxKm == null) return max;
    if (!max || neo.diameterMaxKm > max.diameterMaxKm) return neo;
    return max;
  }, null);

  return {
    total: objects.length,
    hazardousCount,
    closest,
    largest,
  };
}
