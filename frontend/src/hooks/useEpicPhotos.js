import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  buildImageUrl,
  fetchEpicByDate,
  fetchEpicLatest,
} from "../services/epicService";

import getApiErrorMessage from "../utils/getApiErrorMessage";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function todayString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = padDatePart(
    today.getMonth() + 1
  );
  const day = padDatePart(
    today.getDate()
  );

  return `${year}-${month}-${day}`;
}

function isValidDate(value) {
  if (
    !value ||
    !DATE_PATTERN.test(value)
  ) {
    return false;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  const parsedDate = new Date(
    year,
    month - 1,
    day
  );

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
}

function getPhotoDate(photo, fallbackDate) {
  const photoDate =
    typeof photo?.date === "string"
      ? photo.date.split(" ")[0]
      : "";

  return photoDate || fallbackDate;
}

function toDetail(photo, fallbackDate) {
  if (!photo) {
    return null;
  }

  const activeDate = getPhotoDate(
    photo,
    fallbackDate
  );

  const time =
    typeof photo.date === "string"
      ? photo.date
          .split(" ")[1]
          ?.substring(0, 5) || ""
      : "";

  const latitude =
    photo.centroid_coordinates?.lat;

  const longitude =
    photo.centroid_coordinates?.lon;

  return {
    ...photo,
    image: photo.image || "",
    date: activeDate,
    url: buildImageUrl(
      photo,
      activeDate
    ),
    caption:
      photo.caption ||
      `Vista completa da Terra captada pela EPIC${
        time ? ` às ${time} UTC` : ""
      }`,
    time,
    lat:
      typeof latitude === "number"
        ? latitude.toFixed(1)
        : "",
    lon:
      typeof longitude === "number"
        ? longitude.toFixed(1)
        : "",
  };
}

export function useEpicPhotos() {
  const [photos, setPhotos] = useState([]);
  const [date, setDate] = useState(
    todayString()
  );

  const [selected, setSelected] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    emptyMessage,
    setEmptyMessage,
  ] = useState("");

  const requestIdRef = useRef(0);

  const lastRequestRef = useRef({
    type: "latest",
    date: "",
  });

  const resetResults = useCallback(() => {
    setPhotos([]);
    setSelected(null);
    setError("");
    setEmptyMessage("");
  }, []);

  const applyPhotos = useCallback(
    (data, activeDate) => {
      const normalizedPhotos = data
        .map((photo) =>
          toDetail(photo, activeDate)
        )
        .filter(Boolean);

      if (
        normalizedPhotos.length === 0
      ) {
        setPhotos([]);
        setSelected(null);
        setDate(activeDate);
        setError("");
        setEmptyMessage(
          "Não existem imagens EPIC válidas para apresentar."
        );

        return;
      }

      setPhotos(normalizedPhotos);
      setDate(activeDate);
      setSelected(
        normalizedPhotos[0]
      );
      setError("");
      setEmptyMessage("");
    },
    []
  );

  const loadLatest = useCallback(
    async () => {
      const requestId =
        ++requestIdRef.current;

      lastRequestRef.current = {
        type: "latest",
        date: "",
      };

      setLoading(true);
      resetResults();

      try {
        const data =
          await fetchEpicLatest();

        if (
          requestIdRef.current !==
          requestId
        ) {
          return;
        }

        if (
          !Array.isArray(data) ||
          data.length === 0
        ) {
          setEmptyMessage(
            "Ainda não existem imagens recentes disponíveis."
          );

          return;
        }

        const latestDate =
          getPhotoDate(
            data[0],
            todayString()
          );

        applyPhotos(
          data,
          latestDate
        );
      } catch (requestError) {
        if (
          requestIdRef.current !==
          requestId
        ) {
          return;
        }

        setError(
          getApiErrorMessage(
            requestError,
            "Não foi possível carregar as imagens mais recentes da Terra."
          )
        );
      } finally {
        if (
          requestIdRef.current ===
          requestId
        ) {
          setLoading(false);
        }
      }
    },
    [
      applyPhotos,
      resetResults,
    ]
  );

  const loadByDate = useCallback(
    async (targetDate) => {
      if (!targetDate) {
        setError(
          "É necessário selecionar uma data."
        );

        return;
      }

      if (!isValidDate(targetDate)) {
        setError(
          "A data selecionada não é válida."
        );

        return;
      }

      if (
        targetDate > todayString()
      ) {
        setError(
          "Não é possível consultar uma data futura."
        );

        return;
      }

      const requestId =
        ++requestIdRef.current;

      lastRequestRef.current = {
        type: "date",
        date: targetDate,
      };

      setLoading(true);
      resetResults();
      setDate(targetDate);

      try {
        const data =
          await fetchEpicByDate(
            targetDate
          );

        if (
          requestIdRef.current !==
          requestId
        ) {
          return;
        }

        if (
          !Array.isArray(data) ||
          data.length === 0
        ) {
          setEmptyMessage(
            "Não existem imagens EPIC para esta data. Experimenta selecionar outro dia."
          );

          return;
        }

        applyPhotos(
          data,
          targetDate
        );
      } catch (requestError) {
        if (
          requestIdRef.current !==
          requestId
        ) {
          return;
        }

        setError(
          getApiErrorMessage(
            requestError,
            "Não foi possível carregar as imagens desta data."
          )
        );
      } finally {
        if (
          requestIdRef.current ===
          requestId
        ) {
          setLoading(false);
        }
      }
    },
    [
      applyPhotos,
      resetResults,
    ]
  );

  const retryLastRequest =
    useCallback(() => {
      const lastRequest =
        lastRequestRef.current;

      if (
        lastRequest.type === "date" &&
        lastRequest.date
      ) {
        return loadByDate(
          lastRequest.date
        );
      }

      return loadLatest();
    }, [
      loadByDate,
      loadLatest,
    ]);

  return {
    photos,
    date,
    selected,
    setSelected,
    loading,
    error,
    emptyMessage,
    loadLatest,
    loadByDate,
    retryLastRequest,
  };
}