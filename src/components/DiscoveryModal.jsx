import { useEffect, useState } from 'react';
import { X, Gift, Heart, ShoppingBag, Leaf, ChefHat, ExternalLink, RefreshCw } from 'lucide-react';
import { apiService } from '../services/apiService';
import { translateService } from '../services/translateService';
import { StorageManager } from '../utils/StorageManager';

export function DiscoveryModal({ shop, recipe, onClose, language = 'es', onProductAdded, onRecipeToggled }) {
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [mealDBRecipe, setMealDBRecipe] = useState(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [productIndex, setProductIndex] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (shop && shop.type !== 'park') {
      loadAllProducts();
      loadHealthyRecipe();
    }
  }, [shop]);

  useEffect(() => {
    if (mealDBRecipe) {
      setIsFavorite(StorageManager.isRecipeFavorite(mealDBRecipe.id));
      translateRecipeIfNeeded();
    }
  }, [mealDBRecipe, language]);

  const loadAllProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const healthyProducts = await apiService.fetchHealthyProducts(3, language, true);
      setAllProducts(healthyProducts);
      
      const initial = healthyProducts.slice(0, 3);
      setProducts(initial);
      setProductIndex(3);
      
      initial.forEach(product => {
        StorageManager.addPantryProduct(product);
      });
      
      if (onProductAdded) {
        onProductAdded(initial);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const refreshProducts = () => {
    if (allProducts.length === 0) return;
    
    const nextIndex = productIndex + 3;
    
    if (nextIndex >= allProducts.length) {
      const shuffled = apiService.fisherYatesShuffle(allProducts);
      setAllProducts(shuffled);
      const newProducts = shuffled.slice(0, 3);
      setProducts(newProducts);
      setProductIndex(3);
      
      newProducts.forEach(product => {
        StorageManager.addPantryProduct(product);
      });
      
      if (onProductAdded) {
        onProductAdded(newProducts);
      }
    } else {
      const newProducts = allProducts.slice(productIndex, nextIndex);
      setProducts(newProducts);
      setProductIndex(nextIndex);
      
      newProducts.forEach(product => {
        StorageManager.addPantryProduct(product);
      });
      
      if (onProductAdded) {
        onProductAdded(newProducts);
      }
    }
  };

  const loadHealthyRecipe = async () => {
    setIsLoadingRecipe(true);
    try {
      const recipe = await apiService.fetchHealthyRecipe('en');
      setMealDBRecipe(recipe);
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  const translateRecipeIfNeeded = async () => {
    if (!mealDBRecipe || language === 'en' || mealDBRecipe.translatedTo === language) return;
    
    setIsTranslating(true);
    try {
      const translated = await translateService.translateRecipe(mealDBRecipe, language);
      setMealDBRecipe(translated);
    } catch (error) {
      console.error('Error translating recipe:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleToggleFavorite = () => {
    if (mealDBRecipe) {
      const newFavoriteState = StorageManager.toggleFavoriteRecipe(mealDBRecipe);
      setIsFavorite(newFavoriteState);
      
      if (onRecipeToggled) {
        onRecipeToggled(mealDBRecipe, newFavoriteState);
      }
    }
  };

  if (!shop) return null;

  const getPOIText = (field) => {
    if (!shop[field]) return '';
    return typeof shop[field] === 'object' && shop[field][language] 
      ? shop[field][language] 
      : shop[field];
  };

  const getRecipeText = (field) => {
    if (!recipe || !recipe[field]) return '';
    return typeof recipe[field] === 'object' && recipe[field][language] 
      ? recipe[field][language] 
      : recipe[field];
  };

  const titles = {
    es: {
      discovered: '¡Lugar Descubierto!',
      healthyProducts: 'Productos Saludables Recomendados',
      recipe: 'Receta Saludable',
      time: 'Tiempo',
      steps: 'Pasos',
      reward: 'Recompensa',
      loading: 'Cargando productos...',
      noProducts: 'No se encontraron productos',
      nutriscore: 'Nutriscore',
      nova: 'NOVA',
      healthTip: 'Consejo de Salud',
      refreshProducts: 'Cambiar Productos',
      translating: 'Traduciendo receta...',
      lowSalt: 'Bajo en sal'
    },
    en: {
      discovered: 'Place Discovered!',
      healthyProducts: 'Recommended Healthy Products',
      recipe: 'Healthy Recipe',
      time: 'Time',
      steps: 'Steps',
      reward: 'Reward',
      loading: 'Loading products...',
      noProducts: 'No products found',
      nutriscore: 'Nutriscore',
      nova: 'NOVA',
      healthTip: 'Health Tip',
      refreshProducts: 'Refresh Products',
      translating: 'Translating recipe...',
      lowSalt: 'Low salt'
    }
  };

  const t = titles[language] || titles.es;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="card-dark max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4 sticky top-0 bg-dark-800 pb-3 border-b border-neon-green/30">
          <h2 className="text-2xl font-bold text-neon-green text-glow flex items-center gap-2">
            {shop.type === 'park' ? <Heart size={28} /> : <Gift size={28} />}
            {t.discovered}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              {getPOIText('name')}
            </h3>
            <p className="text-neon-cyan">
              {t.reward}: {getPOIText('reward')}
            </p>
          </div>

          {shop.type !== 'park' && (
            <div className="bg-dark-900 rounded-lg p-4 border border-neon-green/20">
              <h4 className="text-lg font-bold text-neon-green mb-3 flex items-center gap-2">
                <ShoppingBag size={20} />
                {t.healthyProducts}
              </h4>
              
              {isLoadingProducts ? (
                <p className="text-gray-400 text-center py-4">{t.loading}</p>
              ) : products.length > 0 ? (
                <div className="space-y-3">
                  {products.map((product, index) => (
                    <div key={index} className="bg-dark-800 rounded p-3 border border-neon-green/10">
                      <div className="flex items-start gap-3">
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-white">{product.name}</p>
                          {product.brand && (
                            <p className="text-sm text-gray-400">{product.brand}</p>
                          )}
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <span className="text-xs bg-neon-green/20 text-neon-green px-2 py-1 rounded">
                              {t.nutriscore}: {product.nutriscore?.toUpperCase() || 'A'}
                            </span>
                            <span className="text-xs bg-neon-cyan/20 text-neon-cyan px-2 py-1 rounded flex items-center gap-1">
                              <Leaf size={12} />
                              {t.nova}: {product.nova || 1}
                            </span>
                            {product.salt !== undefined && product.salt < 0.3 && (
                              <span className="text-xs bg-neon-pink/20 text-neon-pink px-2 py-1 rounded">
                                {t.lowSalt}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={refreshProducts}
                    disabled={isLoadingProducts}
                    className="btn-neon-cyan w-full py-2 text-sm flex items-center justify-center gap-2 mt-3"
                  >
                    <RefreshCw size={16} />
                    {t.refreshProducts}
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">{t.noProducts}</p>
              )}
            </div>
          )}

          {mealDBRecipe && (
            <div className="bg-dark-900 rounded-lg p-4 border border-neon-pink/20">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-bold text-neon-pink flex items-center gap-2">
                  <ChefHat size={20} />
                  {t.recipe}
                </h4>
                <button
                  onClick={handleToggleFavorite}
                  className={`transition-all ${
                    isFavorite ? 'text-neon-pink scale-110' : 'text-gray-400 hover:text-neon-pink'
                  }`}
                >
                  <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
              
              {isLoadingRecipe ? (
                <p className="text-gray-400 text-center py-4">{t.loading}</p>
              ) : isTranslating ? (
                <p className="text-gray-400 text-center py-4">{t.translating}</p>
              ) : (
                <>
                  {mealDBRecipe.image && (
                    <img 
                      src={mealDBRecipe.image} 
                      alt={mealDBRecipe.name}
                      className="w-full h-48 object-cover rounded mb-3"
                    />
                  )}
                  <p className="text-white font-bold text-lg mb-1">
                    {mealDBRecipe.name}
                  </p>
                  <p className="text-sm text-gray-400 mb-3">
                    {mealDBRecipe.category} • {mealDBRecipe.area}
                  </p>
                  
                  <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded p-3 mb-3">
                    <p className="text-sm text-neon-cyan">
                      {mealDBRecipe.saltFreeTip}
                    </p>
                  </div>

                  {mealDBRecipe.ingredients && mealDBRecipe.ingredients.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-bold text-white mb-2">
                        {language === 'es' ? 'Ingredientes:' : 'Ingredients:'}
                      </p>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {mealDBRecipe.ingredients.slice(0, 5).map((ingredient, i) => (
                          <li key={i}>• {ingredient}</li>
                        ))}
                        {mealDBRecipe.ingredients.length > 5 && (
                          <li className="text-gray-500">
                            ... {language === 'es' ? 'y más' : 'and more'}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {mealDBRecipe.video && (
                    <a
                      href={mealDBRecipe.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neon-pink hover:underline flex items-center gap-1"
                    >
                      <ExternalLink size={14} />
                      {language === 'es' ? 'Ver video en YouTube' : 'Watch video on YouTube'}
                    </a>
                  )}
                </>
              )}
            </div>
          )}

          <button
            onClick={onClose}
            className="btn-neon w-full py-3 text-lg"
          >
            {language === 'es' ? '¡Entendido!' : 'Got it!'}
          </button>
        </div>
      </div>
    </div>
  );
}
