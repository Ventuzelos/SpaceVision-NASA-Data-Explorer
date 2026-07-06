// Componente responsável por exibir o painel de fotos do EPIC, incluindo controles de data, grade de miniaturas e detalhes da foto selecionada.
import React, { useState, useEffect, useCallback } from 'react';
import { fetchEpicLatest, fetchEpicByDate } from '../../services/epicService';
import EPICSkeleton from './EPICSkeleton';
import EpicDateControls from './EpicDateControls';
import EpicThumbnailGrid from './EpicThumbnailGrid';
import EpicDetail from './EpicDetail';

export default function EpicPanel({ onOpenLightbox }) {
  const [photos, setPhotos] = useState([]);
  const [date, setDate] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadLatest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEpicLatest();
      setDate(data[0].date.split(' ')[0]);
      setPhotos(data);
      setSelected(data[0]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadByDate = useCallback(async (dataEscolhida) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEpicByDate(dataEscolhida);
      setDate(dataEscolhida);
      setPhotos(data);
      setSelected(data[0]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLatest();
  }, [loadLatest]);

  // Se estiver a carregar, exibe o Skeleton animado no lugar do painel
  if (loading) {
    return <EPICSkeleton />;
  }

  return (
    <div className="panel">
      <div className="card">
        <EpicDateControls
          date={date}
          onDateChange={setDate}
          onLoad={() => loadByDate(date)}
          onLatest={loadLatest}
        />

        {error && <p className="error-text" style={{ color: 'var(--color-error, red)' }}>ERRO: {error}</p>}
        
        {!error && (
          <EpicThumbnailGrid photos={photos} date={date} onSelect={setSelected} />
        )}
      </div>

      {!error && (
        <EpicDetail photo={selected} date={date} onOpenLightbox={onOpenLightbox} />
      )}
    </div>
  );
}
