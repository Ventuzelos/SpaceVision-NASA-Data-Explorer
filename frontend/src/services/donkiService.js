import nasaApi from "./nasaApi";

const DONKI_ENDPOINTS = {
  FLR: "/donki/FLR",
  CME: "/donki/CME",
  GST: "/donki/GST",
  SEP: "/donki/SEP",
  HSS: "/donki/HSS",
  NOTIFICATIONS: "/donki/notifications",
};

export const donkiEventTypes = [
  {
    id: "FLR",
    label: "Solar Flares",
    shortLabel: "Erupções Solares",
    description:
      "Explosões de radiação intensa na superfície do Sol.",
    icon: "sun",
    color: "var(--color-donki-flr)",
  },
  {
    id: "CME",
    label: "Coronal Mass Ejections",
    shortLabel: "Ejeções de Massa Coronal",
    description:
      "Grandes libertações de plasma e campo magnético solar.",
    icon: "waves",
    color: "var(--color-donki-cme)",
  },
  {
    id: "GST",
    label: "Geomagnetic Storms",
    shortLabel: "Tempestades Geomagnéticas",
    description:
      "Perturbações no campo magnético da Terra.",
    icon: "magnet",
    color: "var(--color-donki-gst)",
  },
  {
    id: "SEP",
    label: "Solar Energetic Particles",
    shortLabel: "Partículas Energéticas Solares",
    description:
      "Partículas de alta energia ejetadas pelo Sol.",
    icon: "sparkles",
    color: "var(--color-donki-sep)",
  },
  {
    id: "HSS",
    label: "High Speed Streams",
    shortLabel: "Fluxos de Vento Solar",
    description:
      "Correntes rápidas de vento solar vindas de buracos coronais.",
    icon: "wind",
    color: "var(--color-donki-hss)",
  },
  {
    id: "NOTIFICATIONS",
    label: "Notifications",
    shortLabel: "Notificações",
    description:
      "Alertas e relatórios oficiais do serviço DONKI.",
    icon: "bell",
    color: "var(--color-donki-notifications)",
  },
];

function toISODate(date) {
  return date.toISOString().split("T")[0];
}

export function getDefaultDateRange(daysBack = 7) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  return {
    startDate: toISODate(startDate),
    endDate: toISODate(endDate),
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

  if (!startDate || !endDate) {
    throw new Error(
      "É necessário indicar um intervalo de datas."
    );
  }

  const { data } = await nasaApi.get(endpoint, {
    params: {
      startDate,
      endDate,
    },
  });

  const events = Array.isArray(data) ? data : [];

  return events.map((event) =>
    normalizeEvent(type, event)
  );
}

function formatDateTime(value) {
  if (!value) return "N/D";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function joinInstruments(instruments) {
  return instruments?.map((i) => i.displayName).join(", ") || "N/D";
}

function normalizeEvent(type, event) {
  switch (type) {
    case "FLR":
      return {
        id: event.flrID,
        type,
        title: `Erupção Solar ${event.classType ?? ""}`.trim(),
        date: event.peakTime || event.beginTime,
        badge: event.classType || null,
        meta: [
          { label: "Início", value: formatDateTime(event.beginTime) },
          { label: "Pico", value: formatDateTime(event.peakTime) },
          { label: "Fim", value: formatDateTime(event.endTime) },
          { label: "Região Ativa", value: event.activeRegionNum ?? "N/D" },
          { label: "Instrumentos", value: joinInstruments(event.instruments) },
        ],
        link: event.link,
        raw: event,
      };

    case "CME": {
      const analysis =
        event.cmeAnalyses?.find((a) => a.isMostAccurate) ||
        event.cmeAnalyses?.[0];

      return {
        id: event.activityID,
        type,
        title: "Ejeção de Massa Coronal",
        date: event.startTime,
        badge: analysis?.type || null,
        meta: [
          { label: "Início", value: formatDateTime(event.startTime) },
          { label: "Localização", value: event.sourceLocation || "N/D" },
          {
            label: "Velocidade",
            value: analysis?.speed ? `${analysis.speed} km/s` : "N/D",
          },
          { label: "Instrumentos", value: joinInstruments(event.instruments) },
        ],
        link: event.link,
        raw: event,
      };
    }

    case "GST": {
      const maxKp = event.allKpIndex?.reduce(
        (max, k) => (k.kpIndex > (max?.kpIndex ?? -Infinity) ? k : max),
        null
      );

      return {
        id: event.gstID,
        type,
        title: "Tempestade Geomagnética",
        date: event.startTime,
        badge: maxKp ? `Kp ${maxKp.kpIndex}` : null,
        meta: [
          { label: "Início", value: formatDateTime(event.startTime) },
          {
            label: "Índice Kp máximo",
            value: maxKp ? maxKp.kpIndex : "N/D",
          },
          {
            label: "Eventos associados",
            value: event.linkedEvents?.length ?? 0,
          },
        ],
        link: event.link,
        raw: event,
      };
    }

    case "SEP":
      return {
        id: event.sepID,
        type,
        title: "Evento de Partículas Energéticas Solares",
        date: event.eventTime,
        badge: null,
        meta: [
          { label: "Início", value: formatDateTime(event.eventTime) },
          { label: "Instrumentos", value: joinInstruments(event.instruments) },
          {
            label: "Eventos associados",
            value: event.linkedEvents?.length ?? 0,
          },
        ],
        link: event.link,
        raw: event,
      };

    case "HSS":
      return {
        id: event.hssID,
        type,
        title: "Fluxo de Vento Solar de Alta Velocidade",
        date: event.eventTime,
        badge: null,
        meta: [
          { label: "Início", value: formatDateTime(event.eventTime) },
          { label: "Instrumentos", value: joinInstruments(event.instruments) },
        ],
        link: event.link,
        raw: event,
      };

    case "NOTIFICATIONS":
      return {
        id: event.messageID,
        type,
        title: event.messageType || "Notificação DONKI",
        date: event.messageIssueTime,
        badge: event.messageType || null,
        meta: [
          { label: "Emitida em", value: formatDateTime(event.messageIssueTime) },
          { label: "ID da mensagem", value: event.messageID || "N/D" },
        ],
        body: event.messageBody,
        link: event.messageURL,
        raw: event,
      };

    default:
      return {
        id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
        type,
        title: "Evento DONKI",
        date: null,
        badge: null,
        meta: [],
        raw: event,
      };
  }
}
