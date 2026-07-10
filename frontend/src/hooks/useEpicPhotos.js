import { useCallback, useState } from "react";
import {
  buildImageUrl,
  fetchEpicByDate,
  fetchEpicLatest,
} from "../services/epicService";
import getApiErrorMessage from "../utils/getApiErrorMessage";

function todayString() {
  return new Date().toISOString().split("T")[0];
}

function toDetail(photo, date) {
  const time =
    photo.date?.split(" ")[1]?.substring(0, 5) || "";

  return {
    image: photo.image,
    date,
    url: buildImageUrl(photo, date),
    caption:
      photo.caption ||
      `Vista completa da Terra captada pela EPIC${
        time ? ` às ${time} UTC` : ""
      }`,
    time,
    lat:
      photo.centroid_coordinates?.lat?.toFixed(1) || "",
    lon:
      photo.centroid_coordinates?.lon?.toFixed(1) || "",
  };
}

export function useEpicPhotos() {
  const [photos, setPhotos] = useState([]);
  const [date, setDate] = useState(todayString());
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");
  const [lastRequest, setLastRequest] = useState({
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
      setPhotos(data);
      setDate(activeDate);
      setSelected(toDetail(data[0], activeDate));
      setError("");
      setEmptyMessage("");
    },
    []
  );

  const loadLatest = useCallback(async () => {
    setLastRequest({
      type: "latest",
      date: "",
    });

    setLoading(true);
    resetResults();

    try {
      const data = await fetchEpicLatest();

      if (!Array.isArray(data) || data.length === 0) {
        setEmptyMessage(
          "Ainda não existem imagens recentes disponíveis."
        );
        return;
      }

      const latestDate = data[0].date.split(" ")[0];

      applyPhotos(data, latestDate);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Não foi possível carregar as imagens mais recentes da Terra."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [applyPhotos, resetResults]);

  const loadByDate = useCallback(
    async (targetDate) => {
      if (!targetDate) {
        setError("É necessário selecionar uma data.");
        return;
      }

      setLastRequest({
        type: "date",
        date: targetDate,
      });

      setLoading(true);
      resetResults();
      setDate(targetDate);

      try {
        const data = await fetchEpicByDate(targetDate);

        if (!Array.isArray(data) || data.length === 0) {
          setEmptyMessage(
            "Não existem imagens EPIC para esta data. Experimenta selecionar outro dia."
          );
          return;
        }

        applyPhotos(data, targetDate);
      } catch (requestError) {
        setError(
          getApiErrorMessage(
            requestError,
            "Não foi possível carregar as imagens desta data."
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [applyPhotos, resetResults]
  );

  const retryLastRequest = useCallback(() => {
    if (
      lastRequest.type === "date" &&
      lastRequest.date
    ) {
      return loadByDate(lastRequest.date);
    }

    return loadLatest();
  }, [lastRequest, loadByDate, loadLatest]);

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