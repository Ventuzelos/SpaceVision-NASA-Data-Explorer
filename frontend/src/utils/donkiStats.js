const FLR_CLASS_RANK = { A: 1, B: 2, C: 3, M: 4, X: 5 };

function getFlrSeverity(badge) {
  if (!badge) return -1;

  const letter = badge.charAt(0).toUpperCase();
  const magnitude = parseFloat(badge.slice(1)) || 0;
  const rank = FLR_CLASS_RANK[letter];

  if (!rank) return -1;

  return rank * 100 + magnitude;
}

function getGstSeverity(badge) {
  if (!badge) return -1;

  const match = badge.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : -1;
}

const SEVERITY_GETTERS = {
  FLR: getFlrSeverity,
  GST: getGstSeverity,
};

export function getEventStats(events, type) {
  if (!events.length) {
    return { mostIntense: null, latestDate: null };
  }

  const severityGetter = SEVERITY_GETTERS[type];

  let mostIntense = null;

  if (severityGetter) {
    let bestScore = -Infinity;

    events.forEach((event) => {
      const score = severityGetter(event.badge);

      if (score > bestScore) {
        bestScore = score;
        mostIntense = event.badge;
      }
    });
  }

  const latestDate = events.reduce((latest, event) => {
    if (!event.date) return latest;
    if (!latest) return event.date;

    return new Date(event.date) > new Date(latest)
      ? event.date
      : latest;
  }, null);

  return { mostIntense, latestDate };
}

function extractCmeSpeed(rawEvent) {
  const analysis =
    rawEvent?.cmeAnalyses?.find((a) => a.isMostAccurate) ||
    rawEvent?.cmeAnalyses?.[0];

  return analysis?.speed || 0;
}

const ACTIVITY_COUNT_THRESHOLDS = {
  SEP: { moderate: 1, critical: 3 },
  HSS: { moderate: 1, critical: 3 },
  NOTIFICATIONS: { moderate: 3, critical: 6 },
};

function classifySeverityLevel(events, type) {
  if (!events.length) return "normal";

  if (type === "FLR") {
    let worstScore = -1;

    events.forEach((event) => {
      const score = getFlrSeverity(event.badge);
      if (score > worstScore) worstScore = score;
    });

    const rank = Math.floor(worstScore / 100);

    if (rank >= 5) return "critical";
    if (rank === 4) return "moderate";
    return "normal";
  }

  if (type === "GST") {
    let maxKp = -1;

    events.forEach((event) => {
      const score = getGstSeverity(event.badge);
      if (score > maxKp) maxKp = score;
    });

    if (maxKp >= 7) return "critical";
    if (maxKp >= 5) return "moderate";
    return "normal";
  }

  if (type === "CME") {
    let maxSpeed = 0;

    events.forEach((event) => {
      const speed = extractCmeSpeed(event.raw);
      if (speed > maxSpeed) maxSpeed = speed;
    });

    if (maxSpeed >= 1000) return "critical";
    if (maxSpeed >= 500) return "moderate";
    return maxSpeed > 0 ? "normal" : "moderate";
  }

  const thresholds = ACTIVITY_COUNT_THRESHOLDS[type] || {
    moderate: 1,
    critical: 4,
  };

  if (events.length >= thresholds.critical) return "critical";
  if (events.length >= thresholds.moderate) return "moderate";
  return "normal";
}

function isToday(dateValue, todayKey) {
  if (!dateValue) return false;

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return false;

  return (
    parsed.toLocaleDateString("en-CA") === todayKey
  );
}

export function getTodaySeverity(events, type) {
  const todayKey = new Date().toLocaleDateString("en-CA");

  const todaysEvents = events.filter((event) =>
    isToday(event.date, todayKey)
  );

  return {
    count: todaysEvents.length,
    level: classifySeverityLevel(todaysEvents, type),
  };
}
