import nasaApi from "./nasaApi";

const FEED_ENDPOINT = "/neo/feed";
const DAY_IN_MILLISECONDS =
  24 * 60 * 60 * 1000;

// Limite da NASA NeoWS Feed API.
export const MAX_RANGE_DAYS = 7;

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function toISODate(date) {
  if (
    !(date instanceof Date) ||
    Number.isNaN(date.getTime())
  ) {
    return "";
  }

  const year = date.getFullYear();

  const month = padDatePart(
    date.getMonth() + 1
  );

  const day = padDatePart(
    date.getDate()
  );

  return `${year}-${month}-${day}`;
}

function isValidISODate(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  const date = new Date(
    year,
    month - 1,
    day
  );

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function parseISODate(value) {
  if (!isValidISODate(value)) {
    return null;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day
  );
}

function getUtcTimestamp(value) {
  if (!isValidISODate(value)) {
    return null;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  return Date.UTC(
    year,
    month - 1,
    day
  );
}

function diffInDays(
  startDate,
  endDate
) {
  const startTimestamp =
    getUtcTimestamp(startDate);

  const endTimestamp =
    getUtcTimestamp(endDate);

  if (
    startTimestamp === null ||
    endTimestamp === null
  ) {
    return null;
  }

  return Math.round(
    (endTimestamp -
      startTimestamp) /
      DAY_IN_MILLISECONDS
  );
}

function toFiniteNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function cleanName(value) {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return "Objeto desconhecido";
  }

  return (
    value
      .replace(/[()]/g, "")
      .trim() ||
    "Objeto desconhecido"
  );
}

/**
 * Devolve o intervalo inicial:
 * hoje até aos próximos sete dias.
 */
export function getDefaultDateRange(
  daysAhead = MAX_RANGE_DAYS
) {
  const safeDaysAhead = Math.min(
    Math.max(
      Number(daysAhead) || 0,
      0
    ),
    MAX_RANGE_DAYS
  );

  const startDate = new Date();

  const endDate = new Date(
    startDate
  );

  endDate.setDate(
    endDate.getDate() +
      safeDaysAhead
  );

  return {
    startDate: toISODate(
      startDate
    ),

    endDate: toISODate(
      endDate
    ),
  };
}

/**
 * Garante que o intervalo é válido e
 * não excede o limite máximo da API.
 *
 * Datas futuras são permitidas.
 */
export function clampDateRange(
  startDate,
  endDate
) {
  const today = new Date();

  let start = parseISODate(
    startDate
  );

  let end = parseISODate(
    endDate
  );

  let wasClamped = false;

  if (!start) {
    start = new Date(today);
    wasClamped = true;
  }

  if (!end) {
    end = new Date(start);
    wasClamped = true;
  }

  if (end < start) {
    end = new Date(start);
    wasClamped = true;
  }

  const differenceInDays =
    diffInDays(
      toISODate(start),
      toISODate(end)
    );

  if (
    differenceInDays !== null &&
    differenceInDays >
      MAX_RANGE_DAYS
  ) {
    end = new Date(start);

    end.setDate(
      end.getDate() +
        MAX_RANGE_DAYS
    );

    wasClamped = true;
  }

  return {
    startDate: toISODate(
      start
    ),

    endDate: toISODate(
      end
    ),

    wasClamped,
  };
}

function normalizeNeo(
  neo,
  closeApproach
) {
  const diameterKilometers =
    neo?.estimated_diameter
      ?.kilometers;

  const diameterMeters =
    neo?.estimated_diameter
      ?.meters;

  const diameterMinKm =
    toFiniteNumber(
      diameterKilometers
        ?.estimated_diameter_min
    );

  const diameterMaxKm =
    toFiniteNumber(
      diameterKilometers
        ?.estimated_diameter_max
    );

  const diameterMinM =
    toFiniteNumber(
      diameterMeters
        ?.estimated_diameter_min
    );

  const diameterMaxM =
    toFiniteNumber(
      diameterMeters
        ?.estimated_diameter_max
    );

  const missDistanceKm =
    toFiniteNumber(
      closeApproach
        ?.miss_distance
        ?.kilometers
    );

  const missDistanceLunar =
    toFiniteNumber(
      closeApproach
        ?.miss_distance
        ?.lunar
    );

  const velocityKmH =
    toFiniteNumber(
      closeApproach
        ?.relative_velocity
        ?.kilometers_per_hour
    );

  return {
    id:
      neo?.id ??
      neo?.neo_reference_id ??
      null,

    neoReferenceId:
      neo?.neo_reference_id ??
      neo?.id ??
      null,

    name: cleanName(
      neo?.name
    ),

    isHazardous: Boolean(
      neo
        ?.is_potentially_hazardous_asteroid
    ),

    isSentryObject: Boolean(
      neo?.is_sentry_object
    ),

    absoluteMagnitude:
      toFiniteNumber(
        neo?.absolute_magnitude_h
      ),

    diameterMinKm,
    diameterMaxKm,

    diameterAvgKm:
      diameterMinKm !== null &&
      diameterMaxKm !== null
        ? (diameterMinKm +
            diameterMaxKm) /
          2
        : null,

    diameterMinM,
    diameterMaxM,

    jplUrl:
      typeof neo?.nasa_jpl_url ===
      "string"
        ? neo.nasa_jpl_url
        : null,

    closeApproachDate:
      closeApproach
        ?.close_approach_date_full ||
      closeApproach
        ?.close_approach_date ||
      null,

    missDistanceKm,
    missDistanceLunar,
    velocityKmH,

    orbitingBody:
      closeApproach
        ?.orbiting_body ||
      "Terra",

    raw: neo,
  };
}

/**
 * Obtém os objetos próximos da Terra
 * para o intervalo indicado.
 */
export async function fetchNeoFeed(
  startDate,
  endDate
) {
  if (
    !isValidISODate(startDate) ||
    !isValidISODate(endDate)
  ) {
    throw new Error(
      "O intervalo de datas da NeoWS não é válido."
    );
  }

  const {
    startDate: safeStart,
    endDate: safeEnd,
  } = clampDateRange(
    startDate,
    endDate
  );

  const { data } =
    await nasaApi.get(
      FEED_ENDPOINT,
      {
        params: {
          start_date:
            safeStart,

          end_date:
            safeEnd,
        },
      }
    );

  const objectsByDate =
    data?.near_earth_objects;

  const safeObjectsByDate =
    objectsByDate &&
    typeof objectsByDate ===
      "object"
      ? objectsByDate
      : {};

  const objects =
    Object.values(
      safeObjectsByDate
    )
      .filter(Array.isArray)
      .flat()
      .filter(
        (neo) =>
          neo &&
          typeof neo === "object"
      )
      .map((neo) => {
        const approaches =
          Array.isArray(
            neo.close_approach_data
          )
            ? neo.close_approach_data
            : [];

        const matchingApproach =
          approaches.find(
            (approach) => {
              const approachDate =
                approach
                  ?.close_approach_date;

              return (
                approachDate >=
                  safeStart &&
                approachDate <=
                  safeEnd
              );
            }
          ) ||
          approaches[0] ||
          null;

        return normalizeNeo(
          neo,
          matchingApproach
        );
      })
      .filter(
        (neo) =>
          neo.id !== null
      );

  return {
    elementCount:
      toFiniteNumber(
        data?.element_count
      ) ?? objects.length,

    startDate: safeStart,
    endDate: safeEnd,
    objects,
  };
}

/**
 * Ordena por distância de aproximação.
 */
export function sortByMissDistance(
  objects,
  direction = "asc"
) {
  const safeObjects =
    Array.isArray(objects)
      ? objects
      : [];

  const safeDirection =
    direction === "desc"
      ? "desc"
      : "asc";

  return [...safeObjects].sort(
    (
      firstObject,
      secondObject
    ) => {
      const firstDistance =
        firstObject
          ?.missDistanceKm;

      const secondDistance =
        secondObject
          ?.missDistanceKm;

      const firstHasDistance =
        firstDistance !== null &&
        firstDistance !==
          undefined;

      const secondHasDistance =
        secondDistance !== null &&
        secondDistance !==
          undefined;

      if (
        !firstHasDistance &&
        !secondHasDistance
      ) {
        return 0;
      }

      if (!firstHasDistance) {
        return 1;
      }

      if (!secondHasDistance) {
        return -1;
      }

      return safeDirection ===
        "asc"
        ? firstDistance -
            secondDistance
        : secondDistance -
            firstDistance;
    }
  );
}

/**
 * Calcula as estatísticas agregadas.
 */
export function computeStats(
  objects
) {
  const safeObjects =
    Array.isArray(objects)
      ? objects
      : [];

  if (
    safeObjects.length === 0
  ) {
    return {
      total: 0,
      hazardousCount: 0,
      closest: null,
      largest: null,
    };
  }

  const hazardousCount =
    safeObjects.filter(
      (neo) =>
        Boolean(
          neo?.isHazardous
        )
    ).length;

  const closest =
    safeObjects.reduce(
      (
        closestObject,
        neo
      ) => {
        if (
          neo?.missDistanceKm ===
            null ||
          neo?.missDistanceKm ===
            undefined
        ) {
          return closestObject;
        }

        if (
          !closestObject ||
          neo.missDistanceKm <
            closestObject
              .missDistanceKm
        ) {
          return neo;
        }

        return closestObject;
      },
      null
    );

  const largest =
    safeObjects.reduce(
      (
        largestObject,
        neo
      ) => {
        if (
          neo?.diameterMaxKm ===
            null ||
          neo?.diameterMaxKm ===
            undefined
        ) {
          return largestObject;
        }

        if (
          !largestObject ||
          neo.diameterMaxKm >
            largestObject
              .diameterMaxKm
        ) {
          return neo;
        }

        return largestObject;
      },
      null
    );

  return {
    total:
      safeObjects.length,

    hazardousCount,
    closest,
    largest,
  };
}