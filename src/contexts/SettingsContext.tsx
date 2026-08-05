import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import i18n from '../i18n';
import { AppLanguage } from '../types/settings';
import { loadPreferences, savePreferences } from '../utils/storage';

interface SettingsContextValue {
  ready: boolean;
  bgmEnabled: boolean;
  bgmVolumeLevel: number;
  language: AppLanguage;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  setBgmEnabled: (enabled: boolean) => void;
  setBgmVolumeLevel: (level: number) => void;
  setLanguage: (language: AppLanguage) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [bgmEnabled, setBgmEnabledState] = useState(true);
  const [bgmVolumeLevel, setBgmVolumeLevelState] = useState(2);
  const [language, setLanguageState] = useState<AppLanguage>('en');
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [hapticsEnabled, setHapticsEnabledState] = useState(true);

  useEffect(() => {
    loadPreferences().then((prefs) => {
      setBgmEnabledState(prefs.bgmEnabled);
      setBgmVolumeLevelState(prefs.bgmVolumeLevel);
      setLanguageState(prefs.language);
      setSoundEnabledState(prefs.soundEnabled);
      setHapticsEnabledState(prefs.hapticsEnabled);
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

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    void savePreferences({ soundEnabled: enabled });
  }, []);

  const setHapticsEnabled = useCallback((enabled: boolean) => {
    setHapticsEnabledState(enabled);
    void savePreferences({ hapticsEnabled: enabled });
  }, []);

  const value = useMemo(
    () => ({
      ready,
      bgmEnabled,
      bgmVolumeLevel,
      language,
      soundEnabled,
      hapticsEnabled,
      setBgmEnabled,
      setBgmVolumeLevel,
      setLanguage,
      setSoundEnabled,
      setHapticsEnabled,
    }),
    [
      ready,
      bgmEnabled,
      bgmVolumeLevel,
      language,
      soundEnabled,
      hapticsEnabled,
      setBgmEnabled,
      setBgmVolumeLevel,
      setLanguage,
      setSoundEnabled,
      setHapticsEnabled,
    ]
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
