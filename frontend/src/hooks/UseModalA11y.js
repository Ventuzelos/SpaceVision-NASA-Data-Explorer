import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), ' +
  'select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Encapsulates the standard accessibility behaviour every modal/lightbox
 * in the app should have:
 *  - Escape closes it
 *  - body scroll is locked while it's open
 *  - focus is trapped inside it (Tab/Shift+Tab cycle through its focusable elements)
 *  - focus returns to whatever element opened it, once it closes
 *
 * @param {Object} params
 * @param {boolean} params.isOpen - whether the modal is currently open
 * @param {() => void} params.onClose - called when Escape is pressed
 * @param {React.RefObject} [params.initialFocusRef] - element to focus on open;
 *        defaults to the first focusable element inside the modal
 * @returns {React.RefObject} ref to attach to the modal's outer container
 */
export function useModalA11y({ isOpen, onClose, initialFocusRef }) {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previousFocusRef.current = document.activeElement;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const getFocusable = () =>
      Array.from(
        containerRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) ?? []
      ).filter((el) => el.offsetParent !== null);

    const focusTarget = initialFocusRef?.current ?? getFocusable()[0];
    focusTarget?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const isShiftTab = event.shiftKey;

      if (isShiftTab && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!isShiftTab && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!containerRef.current?.contains(document.activeElement)) {
        // Focus somehow escaped the modal (e.g. programmatic focus elsewhere)
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose, initialFocusRef]);

  return containerRef;
}

export default useModalA11y;