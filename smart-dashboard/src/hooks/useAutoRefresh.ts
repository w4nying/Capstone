import { useEffect } from 'react';
import { useRefresh } from 'react-admin';

const parseRefreshIntervalSeconds = (value: string, fallback = 60) => {
  const match = String(value).match(/\d+/);
  const seconds = match ? Number(match[0]) : fallback;
  return Number.isFinite(seconds) && seconds > 0 ? seconds : fallback;
};

export const useAutoRefresh = (enabled: boolean, refreshIntervalValue?: string) => {
  const refresh = useRefresh();

  useEffect(() => {
    if (!enabled) return;

    const seconds = parseRefreshIntervalSeconds(refreshIntervalValue || '60 seconds');
    const intervalId = window.setInterval(() => {
      refresh();
    }, seconds * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enabled, refreshIntervalValue, refresh]);
};