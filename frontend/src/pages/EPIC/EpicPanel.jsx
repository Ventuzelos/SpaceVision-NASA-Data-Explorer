//ESte componente é responsável por exibir o painel de fotos do EPIC, incluindo controles de data, grade de miniaturas e detalhes da foto selecionada.

import { useState, useEffect, useCallback } from 'react';
import { fetchEpicLatest, fetchEpicByDate } from '../../services/epicService';
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

  return (
    <div className="panel">
      <div className="card">
        <EpicDateControls
          date={date}
          onDateChange={setDate}
          onLoad={() => loadByDate(date)}
          onLatest={loadLatest}
        />

        {loading && <p>A carregar...</p>}
        {error && <p>ERRO: {error}</p>}
        {!loading && !error && (
          <EpicThumbnailGrid photos={photos} date={date} onSelect={setSelected} />
        )}
      </div>

      <EpicDetail photo={selected} date={date} onOpenLightbox={onOpenLightbox} />
    </div>
  );
}


//notas:
// Este componente utiliza hooks do React para gerenciar o estado e efeitos colaterais, como carregamento de dados. Ele também utiliza componentes filhos para separar a lógica de controles de data, grade de miniaturas e detalhes da foto selecionada.
// O componente lida com carregamento de dados, erros e seleção de fotos, proporcionando uma experiência de usuário interativa e responsiva.
// O componente espera receber uma função onOpenLightbox como prop, que é chamada quando o usuário deseja abrir a foto selecionada em um lightbox.
// O componente também utiliza o hook useCallback para memorizar as funções de carregamento de dados, evitando recriações desnecessárias em cada renderização.
