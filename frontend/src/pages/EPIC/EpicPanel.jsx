// Página principal do painel EPIC — orquestra o serviço, a grid e o cartão de detalhe.
import { useState, useEffect } from 'react';
import EpicThumbnailGrid from '../../components/EPIC/EpicThumbnailGrid';
import EpicCard from '../../components/EPIC/EpicCard';
import epicService from '../../services/epicService';

export default function EpicPanel() {
  const [photos, setPhotos] = useState([]);
  const [date, setDate] = useState('');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadLatest() {
    setLoading(true);
    setError('');
    try {
      const data = await epicService.fetchEpicLatest();
      const latestDate = data[0].date.split(' ')[0];
      setDate(latestDate);
      setPhotos(data);
      selectFirst(data, latestDate);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadByDate(selectedDate) {
    if (!selectedDate) return;
    setLoading(true);
    setError('');
    try {
      const data = await epicService.fetchEpicByDate(selectedDate);
      setDate(selectedDate);
      setPhotos(data);
      selectFirst(data, selectedDate);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function selectFirst(data, selectedDate) {
    const p0 = data[0];
    setDetail({
      url: epicService.buildImageUrl(p0, selectedDate),
      caption: p0.caption || p0.image,
      time: p0.date?.split(' ')[1]?.substring(0, 5) || '',
      lat: p0.centroid_coordinates?.lat?.toFixed(1) || '',
      lon: p0.centroid_coordinates?.lon?.toFixed(1) || '',
    });
  }

  useEffect(() => {
    loadLatest();
  }, []);

  return (
    <div className="panel active">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Earth Polychromatic Imaging Camera</span>
          <span className="card-label">GET /EPIC/api/natural</span>
        </div>

        <div className="date-controls">
          <label style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text2)' }}>
            DATA:
          </label>
          <input
            type="date"
            className="date-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="btn btn-sm" onClick={() => loadByDate(date)}>
            CARREGAR
          </button>
          <button className="btn btn-sm btn-cyan" onClick={loadLatest}>
            ● MAIS RECENTE
          </button>
        </div>

        {loading && (
          <div className="apod-loading" style={{ height: '160px' }}>
            <div className="spinner" />
            <div className="apod-loading-text" style={{ fontSize: '11px' }}>
              A CONTACTAR O DSCOVR...
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="apod-error">
            <div style={{ color: 'var(--red)', fontFamily: 'var(--mono)', fontSize: '12px' }}>
              ERRO: {error}
            </div>
            <button className="btn btn-sm" style={{ marginTop: '12px' }} onClick={loadLatest}>
              ↺ TENTAR DE NOVO
            </button>
          </div>
        )}

        {!loading && !error && (
          <EpicThumbnailGrid photos={photos} date={date} onSelect={setDetail} />
        )}
      </div>

      <EpicCard detail={detail} />
    </div>
  );
}