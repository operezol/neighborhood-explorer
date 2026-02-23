import { X, Gift, ShoppingBag, ChefHat, Heart, Leaf } from 'lucide-react';
import { useState } from 'react';

export function BackpackV4({ isOpen, onClose, discoveries, pantryProducts, favoriteRecipes, translations, language = 'es', onToggleFavorite }) {
  const [activeTab, setActiveTab] = useState('coupons');

  if (!isOpen) return null;

  const getPOIText = (poi, field) => {
    if (!poi[field]) return '';
    return typeof poi[field] === 'object' && poi[field][language] 
      ? poi[field][language] 
      : poi[field];
  };

  const tabs = {
    es: {
      coupons: 'Cupones',
      pantry: 'Despensa',
      kitchen: 'Cocina'
    },
    en: {
      coupons: 'Coupons',
      pantry: 'Pantry',
      kitchen: 'Kitchen'
    }
  };

  const t = tabs[language] || tabs.es;

  const emptyMessages = {
    es: {
      coupons: 'Aún no has descubierto tiendas. ¡Sal a explorar!',
      pantry: 'Tu despensa está vacía. Descubre tiendas para obtener productos saludables.',
      kitchen: 'No tienes recetas favoritas. Marca las que te gusten con ❤️'
    },
    en: {
      coupons: 'You haven\'t discovered any shops yet. Go explore!',
      pantry: 'Your pantry is empty. Discover shops to get healthy products.',
      kitchen: 'You have no favorite recipes. Mark the ones you like with ❤️'
    }
  };

  const em = emptyMessages[language] || emptyMessages.es;

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

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('coupons')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'coupons'
                  ? 'bg-neon-green text-dark-900'
                  : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
              }`}
            >
              <Gift size={20} />
              {t.coupons}
            </button>
            <button
              onClick={() => setActiveTab('pantry')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'pantry'
                  ? 'bg-neon-cyan text-dark-900'
                  : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
              }`}
            >
              <ShoppingBag size={20} />
              {t.pantry}
            </button>
            <button
              onClick={() => setActiveTab('kitchen')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'kitchen'
                  ? 'bg-neon-pink text-dark-900'
                  : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
              }`}
            >
              <ChefHat size={20} />
              {t.kitchen}
            </button>
          </div>

          {activeTab === 'coupons' && (
            <div className="space-y-4">
              {discoveries.length === 0 ? (
                <div className="card-dark text-center py-12">
                  <p className="text-gray-400">{em.coupons}</p>
                </div>
              ) : (
                discoveries.map((poi) => (
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
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(poi.discoveredAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'pantry' && (
            <div className="space-y-4">
              {pantryProducts.length === 0 ? (
                <div className="card-dark text-center py-12">
                  <p className="text-gray-400">{em.pantry}</p>
                </div>
              ) : (
                pantryProducts.map((product, index) => (
                  <div key={index} className="card-dark">
                    <div className="flex items-start gap-3">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">
                          {product.name}
                        </h3>
                        {product.brand && (
                          <p className="text-sm text-gray-400 mb-2">{product.brand}</p>
                        )}
                        <div className="flex gap-2">
                          <span className="text-xs bg-neon-green/20 text-neon-green px-2 py-1 rounded">
                            Nutriscore: {product.nutriscore?.toUpperCase() || 'A'}
                          </span>
                          <span className="text-xs bg-neon-cyan/20 text-neon-cyan px-2 py-1 rounded flex items-center gap-1">
                            <Leaf size={12} />
                            NOVA: {product.nova || 1}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(product.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'kitchen' && (
            <div className="space-y-4">
              {favoriteRecipes.length === 0 ? (
                <div className="card-dark text-center py-12">
                  <p className="text-gray-400">{em.kitchen}</p>
                </div>
              ) : (
                favoriteRecipes.map((recipe) => (
                  <div key={recipe.id} className="card-dark">
                    <div className="flex items-start gap-3">
                      {recipe.image && (
                        <img 
                          src={recipe.image} 
                          alt={recipe.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-neon-pink mb-1">
                            {recipe.name}
                          </h3>
                          <button
                            onClick={() => onToggleFavorite && onToggleFavorite(recipe)}
                            className="text-neon-pink hover:scale-110 transition-transform"
                          >
                            <Heart size={20} fill="currentColor" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">
                          {recipe.category} • {recipe.area}
                        </p>
                        <p className="text-xs text-neon-cyan mb-2">
                          {recipe.saltFreeTip}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(recipe.favoritedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
