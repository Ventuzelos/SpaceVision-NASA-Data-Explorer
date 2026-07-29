import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";

import "./EpicDscovrInfo.css";

export default function EpicDscovrInfo() {
  const { t } = useTranslation();

  const [open, setOpen] =
    useState(false);

  const ref = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  return (
    <div
      className="dscovr-info"
      ref={ref}
    >
      <button
        type="button"
        className="dscovr-info__tag"
        onClick={() =>
          setOpen(
            (current) => !current
          )
        }
        aria-expanded={open}
        aria-controls="dscovr-info-popover"
        aria-label={t(
          "epic.dscovrInfo.buttonAria"
        )}
      >
        {t("epic.dscovrInfo.tag")}

        <Info
          size={14}
          className="dscovr-info__icon"
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id="dscovr-info-popover"
          className="dscovr-info__popover"
          role="dialog"
          aria-label={t(
            "epic.dscovrInfo.dialogAria"
          )}
        >
          <p className="dscovr-info__title">
            {t(
              "epic.dscovrInfo.title"
            )}
          </p>

          <p>
            {t(
              "epic.dscovrInfo.description"
            )}
          </p>

          <p>
            {t(
              "epic.dscovrInfo.instruments"
            )}
          </p>
        </div>
      )}
    </div>
  );
}