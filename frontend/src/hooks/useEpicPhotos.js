// Hook que centraliza o estado e a lógica de fetch da EPIC.
// Devolve as fotos do dia, a foto selecionada (detalhe), e funções
// para carregar por data ou carregar a mais recente.

import { useState, useCallback } from 'react';
import { fetchEpicLatest, fetchEpicByDate, buildImageUrl } from '../services/epicService';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function toDetail(photo, date) {
  const time = photo.date ? photo.date.split(' ')[1]?.substring(0, 5) : '';
  return {
    image: photo.image,
    date,
    url: buildImageUrl(photo, date),
    caption: photo.caption || `Vista completa da Terra captada pela EPIC${time ? ` às ${time} UTC` : ''}`,
    time,
    lat: photo.centroid_coordinates?.lat?.toFixed(1) || '',
    lon: photo.centroid_coordinates?.lon?.toFixed(1) || '',
  };
}

// Tenta extrair a mensagem de erro real devolvida pela API da NASA
// (ex: rate limit da chave), com fallback para a mensagem genérica do erro.
function extractErrorMessage(err) {
  return (
    err?.response?.data?.error?.message ||
    err?.message ||
    'Erro desconhecido ao contactar a EPIC API.'
  );
}

export function useEpicPhotos() {
  const [photos, setPhotos] = useState([]);
  const [date, setDate] = useState(todayStr());
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyPhotos = useCallback((data, activeDate) => {
    setPhotos(data);
    setDate(activeDate);
    setSelected(toDetail(data[0], activeDate));
  }, []);

  const loadLatest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEpicLatest();
      if (!Array.isArray(data) || !data.length) {
        throw new Error('Sem imagens disponíveis.');
      }
      const latestDate = data[0].date.split(' ')[0];
      applyPhotos(data, latestDate);
    } catch (err) {
      setError(extractErrorMessage(err));
      setPhotos([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  }, [applyPhotos]);

  const loadByDate = useCallback(async (targetDate) => {
    if (!targetDate) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEpicByDate(targetDate);
      if (!Array.isArray(data) || !data.length) {
        throw new Error('Sem imagens para esta data. Tenta outra data.');
      }
      applyPhotos(data, targetDate);
    } catch (err) {
      setError(extractErrorMessage(err));
      setPhotos([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  }, [applyPhotos]);

  return {
    photos,
    date,
    selected,
    setSelected,
    loading,
    error,
    loadLatest,
    loadByDate,
  };
}