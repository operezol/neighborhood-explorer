import { createContext, useContext, useState, useEffect } from 'react';
import { StorageManager } from '../utils/StorageManager';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => StorageManager.getLanguage());

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    StorageManager.setLanguage(newLang);
  };

  const value = {
    language,
    changeLanguage,
    t: (key, translations) => {
      if (!translations || !translations[language]) {
        return key;
      }
      return translations[language][key] || key;
    }
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
