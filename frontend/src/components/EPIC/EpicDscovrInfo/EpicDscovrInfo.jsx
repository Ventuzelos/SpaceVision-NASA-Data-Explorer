import { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import './EpicDscovrInfo.css';

export default function EpicDscovrInfo() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="dscovr-info" ref={ref}>
      <button
        type="button"
        className="dscovr-info__tag"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="dscovr-info-popover"
      >
        DSCOVR · L1
        <Info size={14} className="dscovr-info__icon" />
      </button>
      {open && (
        <div id="dscovr-info-popover"
          className="dscovr-info__popover"
          role="dialog"
          aria-label="Sobre o satélite DSCOVR">
          <p className="dscovr-info__title">Sobre o satélite DSCOVR</p>
          <p>
            Satélite de meteorologia espacial da NOAA — monitoriza vento solar e ejeções de
            massa coronal a partir do ponto de Lagrange L1.
          </p>
          <p>
            A EPIC é um dos dois instrumentos científicos a bordo; o outro, o NISTAR, mede o
            balanço radiativo da Terra.
          </p>
        </div>
      )}
    </div>
  );
}
