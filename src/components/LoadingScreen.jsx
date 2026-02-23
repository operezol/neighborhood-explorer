import { Loader2 } from 'lucide-react';

export function LoadingScreen({ translations }) {
  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col items-center justify-center z-[3000]">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-black text-neon-green text-glow mb-8 animate-pulse">
          {translations.welcome}
        </h1>
        <Loader2 className="animate-spin text-neon-cyan mx-auto" size={48} />
        <p className="text-gray-400 mt-4">{translations.loading}</p>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <div className="inline-block px-6 py-3 border-2 border-neon-green/30 rounded-lg">
          <p className="text-xs text-gray-500">
            PWA • Client-Side • No Backend
          </p>
        </div>
      </div>
    </div>
  );
}
