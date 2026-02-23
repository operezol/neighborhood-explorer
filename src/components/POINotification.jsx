import { useEffect, useState } from 'react';
import { Gift, X, Share2 } from 'lucide-react';

export function POINotification({ poi, onClose, onShare, language = 'es' }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (poi) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [poi, onClose]);

  if (!poi) return null;

  const getPOIText = (field) => {
    if (!poi[field]) return '';
    return typeof poi[field] === 'object' && poi[field][language] 
      ? poi[field][language] 
      : poi[field];
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleShare = () => {
    if (onShare) {
      onShare(poi);
    }
  };

  const discoveredText = language === 'es' ? '¡Descubierto!' : 'Discovered!';
  const shareText = language === 'es' ? 'Compartir' : 'Share';

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[2000] max-w-sm w-full px-4 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="card-dark border-neon-pink shadow-neon-strong">
        <div className="flex items-start gap-3">
          <Gift className="text-neon-pink flex-shrink-0 mt-1" size={24} />
          <div className="flex-1">
            <h3 className="font-bold text-neon-pink text-lg mb-1">
              {discoveredText}
            </h3>
            <p className="text-white font-bold mb-1">{getPOIText('name')}</p>
            <p className="text-sm text-gray-300 mb-2">{getPOIText('reward')}</p>
            
            <button
              onClick={handleShare}
              className="btn-neon-pink text-xs px-3 py-1 flex items-center gap-1"
            >
              <Share2 size={14} />
              {shareText}
            </button>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
