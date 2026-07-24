import nasaApi from "./nasaApi";

const DONKI_ENDPOINTS = {
  FLR: "/donki/FLR",
  CME: "/donki/CME",
  GST: "/donki/GST",
  SEP: "/donki/SEP",
  HSS: "/donki/HSS",
  NOTIFICATIONS: "/donki/notifications",
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const donkiEventTypes = [
  {
    id: "FLR",
    label: "Solar Flares",
    shortLabel: "Erupções Solares",
    description:
      "Explosões de radiação intensa na superfície do Sol.",
    icon: "sun",
    color: "var(--color-link)",
  },
  {
    id: "CME",
    label: "Coronal Mass Ejections",
    shortLabel: "Ejeções de Massa Coronal",
    description:
      "Grandes libertações de plasma e campo magnético solar.",
    icon: "waves",
    color: "var(--color-link)",
  },
  {
    id: "GST",
    label: "Geomagnetic Storms",
    shortLabel: "Tempestades Geomagnéticas",
    description:
      "Perturbações no campo magnético da Terra.",
    icon: "magnet",
    color: "var(--color-link)",
  },
  {
    id: "SEP",
    label: "Solar Energetic Particles",
    shortLabel: "Partículas Energéticas Solares",
    description:
      "Partículas de alta energia ejetadas pelo Sol.",
    icon: "sparkles",
    color: "var(--color-link)",
  },
  {
    id: "HSS",
    label: "High Speed Streams",
    shortLabel: "Fluxos de Vento Solar",
    description:
      "Correntes rápidas de vento solar vindas de buracos coronais.",
    icon: "wind",
    color: "var(--color-link)",
  },
  {
    id: "NOTIFICATIONS",
    label: "Notifications",
    shortLabel: "Notificações",
    description:
      "Alertas e relatórios oficiais do serviço DONKI.",
    icon: "bell",
    color: "var(--color-link)",
  },
];

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function toLocalISODate(date) {
  const year = date.getFullYear();
  const month = padDatePart(date.getMonth() + 1);
  const day = padDatePart(date.getDate());

  return `${year}-${month}-${day}`;
}

function validateDate(date, label) {
  if (!date) {
    throw new Error(`É necessário indicar a ${label}.`);
  }

  if (!DATE_PATTERN.test(date)) {
    throw new Error(
      `A ${label} deve estar no formato AAAA-MM-DD.`
    );
  }

  const [year, month, day] = date
    .split("-")
    .map(Number);

  const parsedDate = new Date(
    year,
    month - 1,
    day
  );

  const isValid =
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day;

  if (!isValid) {
    throw new Error(`A ${label} não é válida.`);
  }
}

function validateDateRange(startDate, endDate) {
  validateDate(startDate, "data inicial");
  validateDate(endDate, "data final");

  if (startDate > endDate) {
    throw new Error(
      "A data inicial não pode ser posterior à data final."
    );
  }
}

export function getDefaultDateRange(daysBack = 7) {
  const safeDaysBack =
    Number.isInteger(daysBack) && daysBack >= 0
      ? daysBack
      : 7;

  const endDate = new Date();
  const startDate = new Date();

  startDate.setDate(
    startDate.getDate() - safeDaysBack
  );

  return {
    startDate: toLocalISODate(startDate),
    endDate: toLocalISODate(endDate),
  };
}

export async function fetchDonkiEvents(
  type,
  startDate,
  endDate
) {
  const endpoint = DONKI_ENDPOINTS[type];

  if (!endpoint) {
    throw new Error(
      `Tipo de evento DONKI desconhecido: ${type}`
    );
  }

  validateDateRange(startDate, endDate);

  const { data } = await nasaApi.get(endpoint, {
    params: {
      startDate,
      endDate,
    },
  });

  const events = Array.isArray(data)
    ? data
    : [];

  return events.map((event, index) =>
    normalizeEvent(type, event, index)
  );
}

function formatDateTime(value) {
  if (!value) {
    return "N/D";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function joinInstruments(instruments) {
  if (!Array.isArray(instruments)) {
    return "N/D";
  }

  const names = instruments
    .map((instrument) => instrument?.displayName)
    .filter(Boolean);

  return names.length > 0
    ? names.join(", ")
    : "N/D";
}

function createFallbackId(type, event, index) {
  const date =
    event.startTime ||
    event.beginTime ||
    event.eventTime ||
    event.messageIssueTime ||
    "sem-data";

  return `${type}-${date}-${index}`;
}

function normalizeEvent(type, event, index) {
  const fallbackId = createFallbackId(
    type,
    event,
    index
  );

  switch (type) {
    case "FLR":
      return {
        id: event.flrID || fallbackId,
        type,
        title: `Erupção Solar ${
          event.classType ?? ""
        }`.trim(),
        date:
          event.peakTime ||
          event.beginTime ||
          null,
        badge: event.classType || null,
        meta: [
          {
            label: "Início",
            value: formatDateTime(
              event.beginTime
            ),
          },
          {
            label: "Pico",
            value: formatDateTime(
              event.peakTime
            ),
          },
          {
            label: "Fim",
            value: formatDateTime(
              event.endTime
            ),
          },
          {
            label: "Região Ativa",
            value:
              event.activeRegionNum ?? "N/D",
          },
          {
            label: "Instrumentos",
            value: joinInstruments(
              event.instruments
            ),
          },
        ],
        link: event.link || null,
        raw: event,
      };

    case "CME": {
      const analysis =
        event.cmeAnalyses?.find(
          (item) => item.isMostAccurate
        ) ||
        event.cmeAnalyses?.[0] ||
        null;

      return {
        id: event.activityID || fallbackId,
        type,
        title: "Ejeção de Massa Coronal",
        date: event.startTime || null,
        badge: analysis?.type || null,
        meta: [
          {
            label: "Início",
            value: formatDateTime(
              event.startTime
            ),
          },
          {
            label: "Localização",
            value:
              event.sourceLocation || "N/D",
          },
          {
            label: "Velocidade",
            value:
              analysis?.speed != null
                ? `${analysis.speed} km/s`
                : "N/D",
          },
          {
            label: "Instrumentos",
            value: joinInstruments(
              event.instruments
            ),
          },
        ],
        link: event.link || null,
        raw: event,
      };
    }

    case "GST": {
      const kpIndexes = Array.isArray(
        event.allKpIndex
      )
        ? event.allKpIndex
        : [];

      const maxKp = kpIndexes.reduce(
        (maximum, current) =>
          current.kpIndex >
          (maximum?.kpIndex ?? -Infinity)
            ? current
            : maximum,
        null
      );

      return {
        id: event.gstID || fallbackId,
        type,
        title: "Tempestade Geomagnética",
        date: event.startTime || null,
        badge:
          maxKp?.kpIndex != null
            ? `Kp ${maxKp.kpIndex}`
            : null,
        meta: [
          {
            label: "Início",
            value: formatDateTime(
              event.startTime
            ),
          },
          {
            label: "Índice Kp máximo",
            value:
              maxKp?.kpIndex ?? "N/D",
          },
          {
            label: "Eventos associados",
            value: Array.isArray(
              event.linkedEvents
            )
              ? event.linkedEvents.length
              : 0,
          },
        ],
        link: event.link || null,
        raw: event,
      };
    }

    case "SEP":
      return {
        id: event.sepID || fallbackId,
        type,
        title:
          "Evento de Partículas Energéticas Solares",
        date: event.eventTime || null,
        badge: null,
        meta: [
          {
            label: "Início",
            value: formatDateTime(
              event.eventTime
            ),
          },
          {
            label: "Instrumentos",
            value: joinInstruments(
              event.instruments
            ),
          },
          {
            label: "Eventos associados",
            value: Array.isArray(
              event.linkedEvents
            )
              ? event.linkedEvents.length
              : 0,
          },
        ],
        link: event.link || null,
        raw: event,
      };

    case "HSS":
      return {
        id: event.hssID || fallbackId,
        type,
        title:
          "Fluxo de Vento Solar de Alta Velocidade",
        date: event.eventTime || null,
        badge: null,
        meta: [
          {
            label: "Início",
            value: formatDateTime(
              event.eventTime
            ),
          },
          {
            label: "Instrumentos",
            value: joinInstruments(
              event.instruments
            ),
          },
        ],
        link: event.link || null,
        raw: event,
      };

    case "NOTIFICATIONS":
      return {
        id: event.messageID || fallbackId,
        type,
        title:
          event.messageType ||
          "Notificação DONKI",
        date:
          event.messageIssueTime || null,
        badge: event.messageType || null,
        meta: [
          {
            label: "Emitida em",
            value: formatDateTime(
              event.messageIssueTime
            ),
          },
          {
            label: "ID da mensagem",
            value:
              event.messageID || "N/D",
          },
        ],
        body: event.messageBody || null,
        link: event.messageURL || null,
        raw: event,
      };

    default:
      return {
        id: fallbackId,
        type,
        title: "Evento DONKI",
        date: null,
        badge: null,
        meta: [],
        link: null,
        raw: event,
      };
  }
}