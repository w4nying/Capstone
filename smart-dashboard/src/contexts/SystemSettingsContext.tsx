import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { httpClient } from '../providers/dataProvider';

export type SettingRecord = {
  id: string | number;
  category?: string;
  name?: string;
  value?: string;
  description?: string;
  modifiedBy?: string;
  lastModified?: string;
};

type SystemSettingsMap = Record<string, string>;

type SystemSettingsContextType = {
  settings: SettingRecord[];
  settingsMap: SystemSettingsMap;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  getSetting: (name: string, fallback?: string) => string;
  getBooleanSetting: (name: string, fallback?: boolean) => boolean;
};

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(
  undefined
);

const normalizeName = (name: string) => name.trim().toLowerCase();

export const SystemSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setSettings] = useState<SettingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await httpClient.get('/settings');
      setSettings(data ?? []);
    } catch (error) {
      console.error('Failed to load system settings', error);
      setSettings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const settingsMap = useMemo(() => {
    return settings.reduce<SystemSettingsMap>((acc, setting) => {
      if (setting.name) {
        acc[normalizeName(setting.name)] = String(setting.value ?? '');
      }
      return acc;
    }, {});
  }, [settings]);

  const getSetting = useCallback(
    (name: string, fallback = '') => {
      return settingsMap[normalizeName(name)] ?? fallback;
    },
    [settingsMap]
  );

  const getBooleanSetting = useCallback(
    (name: string, fallback = false) => {
      const value = settingsMap[normalizeName(name)];
      if (value === undefined) return fallback;
      return value.toLowerCase() === 'true';
    },
    [settingsMap]
  );

  return (
    <SystemSettingsContext.Provider
      value={{
        settings,
        settingsMap,
        loading,
        refreshSettings,
        getSetting,
        getBooleanSetting,
      }}
    >
      {children}
    </SystemSettingsContext.Provider>
  );
};

export const useSystemSettings = () => {
  const context = useContext(SystemSettingsContext);

  if (!context) {
    throw new Error('useSystemSettings must be used within SystemSettingsProvider');
  }

  return context;
};