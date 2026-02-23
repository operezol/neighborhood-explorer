import { X, Gift, Heart } from 'lucide-react';

export function Backpack({ isOpen, onClose, discoveries, translations, language = 'es' }) {
  if (!isOpen) return null;

  const getPOIText = (poi, field) => {
    if (!poi[field]) return '';
    return typeof poi[field] === 'object' && poi[field][language] 
      ? poi[field][language] 
      : poi[field];
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-sm">
      <div className="h-full w-full overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neon-green text-glow">
              {translations.inventory}
            </h2>
            <button
              onClick={onClose}
              className="btn-neon-pink"
              aria-label={translations.close_inventory}
            >
              <X size={24} />
            </button>
          </div>

          {discoveries.length === 0 ? (
            <div className="card-dark text-center py-12">
              <p className="text-gray-400">{translations.no_discoveries}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {discoveries.map((poi) => (
                <div key={poi.id} className="card-dark">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {poi.type === 'km0' ? (
                        <Gift className="text-neon-green" size={24} />
                      ) : (
                        <Heart className="text-neon-pink" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-neon-green mb-1">
                        {getPOIText(poi, 'name')}
                      </h3>
                      <p className="text-sm text-gray-300 mb-2">
                        <span className="text-neon-cyan">{translations.reward}:</span> {getPOIText(poi, 'reward')}
                      </p>
                      
                      {poi.recipe && (
                        <div className="mt-3 p-3 bg-dark-900 rounded border border-neon-green/20">
                          <h4 className="text-sm font-bold text-neon-cyan mb-1">
                            {translations.recipe}: {getPOIText(poi.recipe, 'title')}
                          </h4>
                          <p className="text-xs text-gray-400 mb-2">
                            {translations.time}: {poi.recipe.time}
                          </p>
                          <p className="text-sm text-gray-300">
                            {translations.steps}: {getPOIText(poi.recipe, 'steps')}
                          </p>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(poi.discoveredAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
