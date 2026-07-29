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
    shortLabelKey:
      "donki.eventTypes.flr.label",
    descriptionKey:
      "donki.eventTypes.flr.description",
    icon: "sun",
    color: "var(--color-link)",
  },
  {
    id: "CME",
    label: "Coronal Mass Ejections",
    shortLabelKey:
      "donki.eventTypes.cme.label",
    descriptionKey:
      "donki.eventTypes.cme.description",
    icon: "waves",
    color: "var(--color-link)",
  },
  {
    id: "GST",
    label: "Geomagnetic Storms",
    shortLabelKey:
      "donki.eventTypes.gst.label",
    descriptionKey:
      "donki.eventTypes.gst.description",
    icon: "magnet",
    color: "var(--color-link)",
  },
  {
    id: "SEP",
    label: "Solar Energetic Particles",
    shortLabelKey:
      "donki.eventTypes.sep.label",
    descriptionKey:
      "donki.eventTypes.sep.description",
    icon: "sparkles",
    color: "var(--color-link)",
  },
  {
    id: "HSS",
    label: "High Speed Streams",
    shortLabelKey:
      "donki.eventTypes.hss.label",
    descriptionKey:
      "donki.eventTypes.hss.description",
    icon: "wind",
    color: "var(--color-link)",
  },
  {
    id: "NOTIFICATIONS",
    label: "Notifications",
    shortLabelKey:
      "donki.eventTypes.notifications.label",
    descriptionKey:
      "donki.eventTypes.notifications.description",
    icon: "bell",
    color: "var(--color-link)",
  },
];

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function toLocalISODate(date) {
  const year = date.getFullYear();
  const month = padDatePart(
    date.getMonth() + 1
  );
  const day = padDatePart(date.getDate());

  return `${year}-${month}-${day}`;
}

function validateDate(date, label) {
  if (!date) {
    throw new Error(
      `É necessário indicar a ${label}.`
    );
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
    throw new Error(
      `A ${label} não é válida.`
    );
  }
}

function validateDateRange(
  startDate,
  endDate
) {
  validateDate(
    startDate,
    "data inicial"
  );

  validateDate(
    endDate,
    "data final"
  );

  if (startDate > endDate) {
    throw new Error(
      "A data inicial não pode ser posterior à data final."
    );
  }
}

export function getDefaultDateRange(
  daysBack = 7
) {
  const safeDaysBack =
    Number.isInteger(daysBack) &&
    daysBack >= 0
      ? daysBack
      : 7;

  const endDate = new Date();
  const startDate = new Date();

  startDate.setDate(
    startDate.getDate() - safeDaysBack
  );

  return {
    startDate:
      toLocalISODate(startDate),
    endDate:
      toLocalISODate(endDate),
  };
}

export async function fetchDonkiEvents(
  type,
  startDate,
  endDate
) {
  const endpoint =
    DONKI_ENDPOINTS[type];

  if (!endpoint) {
    throw new Error(
      `Tipo de evento DONKI desconhecido: ${type}`
    );
  }

  validateDateRange(
    startDate,
    endDate
  );

  const { data } =
    await nasaApi.get(endpoint, {
      params: {
        startDate,
        endDate,
      },
    });

  const events = Array.isArray(data)
    ? data
    : [];

  return events.map(
    (event, index) =>
      normalizeEvent(
        type,
        event,
        index
      )
  );
}

function joinInstruments(instruments) {
  if (!Array.isArray(instruments)) {
    return null;
  }

  const names = instruments
    .map(
      (instrument) =>
        instrument?.displayName
    )
    .filter(Boolean);

  return names.length > 0
    ? names.join(", ")
    : null;
}

function createFallbackId(
  type,
  event,
  index
) {
  const date =
    event.startTime ||
    event.beginTime ||
    event.eventTime ||
    event.messageIssueTime ||
    "no-date";

  return `${type}-${date}-${index}`;
}

function createDateMeta(
  labelKey,
  value
) {
  return {
    labelKey,
    value: value || null,
    valueType: "dateTime",
  };
}

function createValueMeta(
  labelKey,
  value
) {
  return {
    labelKey,
    value:
      value === undefined
        ? null
        : value,
    valueType: "text",
  };
}

function normalizeEvent(
  type,
  event,
  index
) {
  const fallbackId =
    createFallbackId(
      type,
      event,
      index
    );

  switch (type) {
    case "FLR": {
      const originalNote =
        event.original_note ||
        event.note ||
        "";

      const translatedNote =
        event.translated_note || "";

      const displayNote =
        translatedNote ||
        originalNote;

      return {
        id:
          event.flrID ||
          fallbackId,
        type,
        titleKey:
          "donki.eventData.titles.flr",
        titleOptions: {
          classType:
            event.classType || "",
        },
        date:
          event.peakTime ||
          event.beginTime ||
          null,
        badge:
          event.classType || null,
        meta: [
          createDateMeta(
            "donki.eventData.meta.start",
            event.beginTime
          ),
          createDateMeta(
            "donki.eventData.meta.peak",
            event.peakTime
          ),
          createDateMeta(
            "donki.eventData.meta.end",
            event.endTime
          ),
          createValueMeta(
            "donki.eventData.meta.activeRegion",
            event.activeRegionNum
          ),
          createValueMeta(
            "donki.eventData.meta.instruments",
            joinInstruments(
              event.instruments
            )
          ),
        ],
        body:
          displayNote || null,
        originalBody:
          originalNote || null,
        translatedBody:
          translatedNote || null,
        hasAutomaticTranslation:
          Boolean(
            translatedNote
          ) &&
          translatedNote !==
            originalNote,
        link:
          event.link || null,
        raw: event,
      };
    }

    case "CME": {
      const analysis =
        event.cmeAnalyses?.find(
          (item) =>
            item.isMostAccurate
        ) ||
        event.cmeAnalyses?.[0] ||
        null;

      const originalNote =
        event.original_note ||
        event.note ||
        "";

      const translatedNote =
        event.translated_note || "";

      const originalAnalysisNote =
        analysis?.original_note ||
        analysis?.note ||
        "";

      const translatedAnalysisNote =
        analysis?.translated_note ||
        "";

      const originalBody = [
        originalNote,
        originalAnalysisNote,
      ]
        .filter(Boolean)
        .join("\n\n");

      const translatedBody = [
        translatedNote ||
          originalNote,
        translatedAnalysisNote ||
          originalAnalysisNote,
      ]
        .filter(Boolean)
        .join("\n\n");

      const hasAutomaticTranslation =
        (Boolean(
          translatedNote
        ) &&
          translatedNote !==
            originalNote) ||
        (Boolean(
          translatedAnalysisNote
        ) &&
          translatedAnalysisNote !==
            originalAnalysisNote);

      return {
        id:
          event.activityID ||
          fallbackId,
        type,
        titleKey:
          "donki.eventData.titles.cme",
        titleOptions: {},
        date:
          event.startTime ||
          null,
        badge:
          analysis?.type ||
          null,
        meta: [
          createDateMeta(
            "donki.eventData.meta.start",
            event.startTime
          ),
          createValueMeta(
            "donki.eventData.meta.location",
            event.sourceLocation
          ),
          createValueMeta(
            "donki.eventData.meta.speed",
            analysis?.speed != null
              ? `${analysis.speed} km/s`
              : null
          ),
          createValueMeta(
            "donki.eventData.meta.instruments",
            joinInstruments(
              event.instruments
            )
          ),
        ],
        body:
          translatedBody || null,
        originalBody:
          originalBody || null,
        translatedBody:
          translatedBody || null,
        hasAutomaticTranslation,
        link:
          event.link || null,
        raw: event,
      };
    }

    case "GST": {
      const kpIndexes =
        Array.isArray(
          event.allKpIndex
        )
          ? event.allKpIndex
          : [];

      const maxKp =
        kpIndexes.reduce(
          (
            maximum,
            current
          ) =>
            current.kpIndex >
            (maximum?.kpIndex ??
              -Infinity)
              ? current
              : maximum,
          null
        );

      return {
        id:
          event.gstID ||
          fallbackId,
        type,
        titleKey:
          "donki.eventData.titles.gst",
        titleOptions: {},
        date:
          event.startTime ||
          null,
        badge:
          maxKp?.kpIndex != null
            ? `Kp ${maxKp.kpIndex}`
            : null,
        meta: [
          createDateMeta(
            "donki.eventData.meta.start",
            event.startTime
          ),
          createValueMeta(
            "donki.eventData.meta.maximumKp",
            maxKp?.kpIndex
          ),
          createValueMeta(
            "donki.eventData.meta.linkedEvents",
            Array.isArray(
              event.linkedEvents
            )
              ? event.linkedEvents.length
              : 0
          ),
        ],
        body: null,
        originalBody: null,
        translatedBody: null,
        hasAutomaticTranslation: false,
        link:
          event.link || null,
        raw: event,
      };
    }

    case "SEP":
      return {
        id:
          event.sepID ||
          fallbackId,
        type,
        titleKey:
          "donki.eventData.titles.sep",
        titleOptions: {},
        date:
          event.eventTime ||
          null,
        badge: null,
        meta: [
          createDateMeta(
            "donki.eventData.meta.start",
            event.eventTime
          ),
          createValueMeta(
            "donki.eventData.meta.instruments",
            joinInstruments(
              event.instruments
            )
          ),
          createValueMeta(
            "donki.eventData.meta.linkedEvents",
            Array.isArray(
              event.linkedEvents
            )
              ? event.linkedEvents.length
              : 0
          ),
        ],
        body: null,
        originalBody: null,
        translatedBody: null,
        hasAutomaticTranslation: false,
        link:
          event.link || null,
        raw: event,
      };

    case "HSS":
      return {
        id:
          event.hssID ||
          fallbackId,
        type,
        titleKey:
          "donki.eventData.titles.hss",
        titleOptions: {},
        date:
          event.eventTime ||
          null,
        badge: null,
        meta: [
          createDateMeta(
            "donki.eventData.meta.start",
            event.eventTime
          ),
          createValueMeta(
            "donki.eventData.meta.instruments",
            joinInstruments(
              event.instruments
            )
          ),
        ],
        body: null,
        originalBody: null,
        translatedBody: null,
        hasAutomaticTranslation: false,
        link:
          event.link || null,
        raw: event,
      };

    case "NOTIFICATIONS": {
      const originalBody =
        event.original_message_body ||
        event.messageBody ||
        null;

      const translatedBody =
        event.translated_message_body ||
        originalBody;

      const hasAutomaticTranslation =
        Boolean(
          event.translated_message_body &&
            event.translated_message_body !==
              originalBody
        );

      return {
        id:
          event.messageID ||
          fallbackId,
        type,
        title:
          event.messageType ||
          null,
        titleKey:
          event.messageType
            ? null
            : "donki.eventData.titles.notification",
        titleOptions: {},
        date:
          event.messageIssueTime ||
          null,
        badge:
          event.messageType ||
          null,
        meta: [
          createDateMeta(
            "donki.eventData.meta.issuedAt",
            event.messageIssueTime
          ),
          createValueMeta(
            "donki.eventData.meta.messageId",
            event.messageID
          ),
        ],
        body:
          translatedBody || null,
        originalBody,
        translatedBody:
          translatedBody || null,
        hasAutomaticTranslation,
        link:
          event.messageURL ||
          null,
        raw: event,
      };
    }

    default:
      return {
        id: fallbackId,
        type,
        titleKey:
          "donki.defaultEventTitle",
        titleOptions: {},
        date: null,
        badge: null,
        meta: [],
        body: null,
        originalBody: null,
        translatedBody: null,
        hasAutomaticTranslation: false,
        link: null,
        raw: event,
      };
  }
}