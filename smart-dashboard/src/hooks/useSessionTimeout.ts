import { useEffect, useRef } from 'react';

export const useSessionTimeout = (
  enabled: boolean,
  timeoutMinutes: number,
  onTimeout: () => void
) => {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || timeoutMinutes <= 0) return;

    const resetTimer = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        onTimeout();
      }, timeoutMinutes * 60 * 1000);
    };

    const events: Array<keyof WindowEventMap> = [
      'mousemove',
      'keydown',
      'click',
      'scroll',
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });

      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [enabled, timeoutMinutes, onTimeout]);
};