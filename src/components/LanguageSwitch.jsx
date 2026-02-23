import { Languages } from 'lucide-react';

export function LanguageSwitch({ currentLang, onLanguageChange }) {
  const toggleLanguage = () => {
    const newLang = currentLang === 'es' ? 'en' : 'es';
    onLanguageChange(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-[1000] btn-neon flex items-center gap-2"
      aria-label="Change language"
    >
      <Languages size={20} />
      <span className="text-sm font-bold">{currentLang.toUpperCase()}</span>
    </button>
  );
}
