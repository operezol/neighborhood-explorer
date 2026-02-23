import { useState } from 'react';
import { Share2, X, Copy, Check } from 'lucide-react';
import { shareDiscovery, generateShareText, copyToClipboard } from '../utils/ShareHelper';

export function ShareModal({ poi, stats, language, onClose }) {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!poi) return null;

  const handleShare = async () => {
    setIsSharing(true);
    const success = await shareDiscovery(poi, stats, language);
    setIsSharing(false);
    
    if (success) {
      setTimeout(onClose, 500);
    }
  };

  const handleCopy = async () => {
    const text = generateShareText(poi, stats, language);
    const success = await copyToClipboard(text);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = generateShareText(poi, stats, language);

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/70">
      <div className="card-dark max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-neon-green flex items-center gap-2">
            <Share2 size={24} />
            {language === 'es' ? 'Compartir Descubrimiento' : 'Share Discovery'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-dark-900 rounded border border-neon-green/20">
          <p className="text-sm text-gray-300 whitespace-pre-line">
            {shareText}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="btn-neon flex-1 flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            {isSharing 
              ? (language === 'es' ? 'Compartiendo...' : 'Sharing...') 
              : (language === 'es' ? 'Compartir' : 'Share')}
          </button>

          <button
            onClick={handleCopy}
            className="btn-neon px-4 flex items-center gap-2"
            title={language === 'es' ? 'Copiar texto' : 'Copy text'}
          >
            {copied ? <Check size={18} className="text-neon-green" /> : <Copy size={18} />}
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          {language === 'es' 
            ? '💡 Se incluirá una captura del mapa si tu dispositivo lo permite' 
            : '💡 A map screenshot will be included if your device supports it'}
        </div>
      </div>
    </div>
  );
}
