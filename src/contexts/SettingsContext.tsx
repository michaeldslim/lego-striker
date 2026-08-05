import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import i18n from '../i18n';
import { AppLanguage } from '../types/settings';
import { loadPreferences, savePreferences } from '../utils/storage';

interface SettingsContextValue {
  ready: boolean;
  bgmEnabled: boolean;
  bgmVolumeLevel: number;
  language: AppLanguage;
  setBgmEnabled: (enabled: boolean) => void;
  setBgmVolumeLevel: (level: number) => void;
  setLanguage: (language: AppLanguage) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [bgmEnabled, setBgmEnabledState] = useState(true);
  const [bgmVolumeLevel, setBgmVolumeLevelState] = useState(2);
  const [language, setLanguageState] = useState<AppLanguage>('en');

  useEffect(() => {
    loadPreferences().then((prefs) => {
      setBgmEnabledState(prefs.bgmEnabled);
      setBgmVolumeLevelState(prefs.bgmVolumeLevel);
      setLanguageState(prefs.language);
      void i18n.changeLanguage(prefs.language);
      setReady(true);
    });
  }, []);

  const setBgmEnabled = useCallback((enabled: boolean) => {
    setBgmEnabledState(enabled);
    void savePreferences({ bgmEnabled: enabled });
  }, []);

  const setBgmVolumeLevel = useCallback((level: number) => {
    setBgmVolumeLevelState(level);
    void savePreferences({ bgmVolumeLevel: level });
  }, []);

  const setLanguage = useCallback((next: AppLanguage) => {
    setLanguageState(next);
    void i18n.changeLanguage(next);
    void savePreferences({ language: next });
  }, []);

  const value = useMemo(
    () => ({
      ready,
      bgmEnabled,
      bgmVolumeLevel,
      language,
      setBgmEnabled,
      setBgmVolumeLevel,
      setLanguage,
    }),
    [ready, bgmEnabled, bgmVolumeLevel, language, setBgmEnabled, setBgmVolumeLevel, setLanguage]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}
