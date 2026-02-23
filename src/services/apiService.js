const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const THEMEALDB_URL = 'https://www.themealdb.com/api/json/v1/1';

const HEALTHY_CATEGORIES = ['Seafood', 'Vegetarian', 'Chicken', 'Beef'];
const MAX_SEEN_ITEMS = 50;
const COOLDOWN_HOURS = 24;

export const apiService = {
  async fetchNearbyShops(lat, lng, radius = 500) {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="marketplace"](around:${radius},${lat},${lng});
        node["shop"="greengrocer"](around:${radius},${lat},${lng});
        node["shop"="supermarket"](around:${radius},${lat},${lng});
        node["shop"="convenience"](around:${radius},${lat},${lng});
        node["shop"="bakery"](around:${radius},${lat},${lng});
        node["leisure"="park"](around:${radius},${lat},${lng});
        way["amenity"="marketplace"](around:${radius},${lat},${lng});
        way["shop"="greengrocer"](around:${radius},${lat},${lng});
        way["shop"="supermarket"](around:${radius},${lat},${lng});
        way["shop"="bakery"](around:${radius},${lat},${lng});
        way["leisure"="park"](around:${radius},${lat},${lng});
      );
      out center;
    `;

    try {
      const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }

      const data = await response.json();
      return this.convertOSMToShops(data.elements);
    } catch (error) {
      console.error('Error fetching shops from Overpass API:', error);
      return [];
    }
  },

  fisherYatesShuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  cleanExpiredItems(storageKey) {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const now = Date.now();
      const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;
      
      const active = stored.filter(item => {
        return (now - item.timestamp) < cooldownMs;
      });
      
      localStorage.setItem(storageKey, JSON.stringify(active));
      return active;
    } catch (error) {
      console.error('Error cleaning expired items:', error);
      return [];
    }
  },

  getFreshContent(apiData, storageKey, idField = 'code') {
    this.cleanExpiredItems(storageKey);
    
    const seenItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const seenIds = new Set(seenItems.map(item => item.id));
    
    const fresh = apiData.filter(item => {
      const itemId = item[idField] || item.name || item.id;
      return !seenIds.has(itemId);
    });
    
    if (fresh.length === 0) {
      localStorage.setItem(storageKey, JSON.stringify([]));
      return this.fisherYatesShuffle(apiData);
    }
    
    return this.fisherYatesShuffle(fresh);
  },

  markAsSeen(itemId, storageKey) {
    try {
      const seen = JSON.parse(localStorage.getItem(storageKey) || '[]');
      seen.push({
        id: itemId,
        timestamp: Date.now()
      });
      localStorage.setItem(storageKey, JSON.stringify(seen.slice(-MAX_SEEN_ITEMS)));
    } catch (error) {
      console.error('Error marking item as seen:', error);
    }
  },

  async fetchHealthyProducts(count = 3, language = 'es', fetchAll = false) {
    const baseUrl = language === 'es' 
      ? 'https://es.openfoodfacts.org/api/v2/search'
      : 'https://world.openfoodfacts.org/api/v2/search';

    const params = new URLSearchParams({
      nutriscore_grade: 'a',
      nova_group: '1',
      fields: 'code,product_name,brands,nutriscore_grade,nova_group,image_url,categories_tags,nutriments',
      page_size: fetchAll ? 50 : count * 3,
      json: 1
    });

    params.append('nutriments.salt_100g', '<0.3');

    try {
      const response = await fetch(`${baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Open Food Facts API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.products || data.products.length === 0) {
        return this.getFallbackProducts(language);
      }

      const validProducts = data.products
        .filter(p => p.product_name && p.nutriscore_grade === 'a')
        .map(product => ({
          code: product.code,
          name: product.product_name,
          brand: product.brands || '',
          nutriscore: product.nutriscore_grade,
          nova: product.nova_group,
          image: product.image_url || null,
          categories: product.categories_tags || [],
          salt: product.nutriments?.salt_100g || 0
        }));

      if (fetchAll) {
        return validProducts;
      }

      const fresh = this.getFreshContent(validProducts, 'seen_products', 'code');
      const selected = fresh.slice(0, count);
      
      selected.forEach(product => {
        this.markAsSeen(product.code, 'seen_products');
      });

      return selected;
    } catch (error) {
      console.error('Error fetching products from Open Food Facts:', error);
      return this.getFallbackProducts(language);
    }
  },

  getFallbackProducts(language = 'es') {
    const products = {
      es: [
        {
          name: 'Tomates frescos',
          brand: 'Producto local',
          nutriscore: 'a',
          nova: 1,
          image: null,
          categories: ['vegetables']
        },
        {
          name: 'Manzanas',
          brand: 'Producto local',
          nutriscore: 'a',
          nova: 1,
          image: null,
          categories: ['fruits']
        },
        {
          name: 'Brócoli fresco',
          brand: 'Producto local',
          nutriscore: 'a',
          nova: 1,
          image: null,
          categories: ['vegetables']
        }
      ],
      en: [
        {
          name: 'Fresh tomatoes',
          brand: 'Local product',
          nutriscore: 'a',
          nova: 1,
          image: null,
          categories: ['vegetables']
        },
        {
          name: 'Apples',
          brand: 'Local product',
          nutriscore: 'a',
          nova: 1,
          image: null,
          categories: ['fruits']
        },
        {
          name: 'Fresh broccoli',
          brand: 'Local product',
          nutriscore: 'a',
          nova: 1,
          image: null,
          categories: ['vegetables']
        }
      ]
    };

    return products[language] || products.es;
  },

  convertOSMToShops(elements) {
    const shops = [];

    elements.forEach((element) => {
      const tags = element.tags || {};
      const name = tags.name || tags['name:es'] || tags['name:en'];
      
      if (!name) return;

      let lat, lng;
      if (element.type === 'node') {
        lat = element.lat;
        lng = element.lon;
      } else if (element.center) {
        lat = element.center.lat;
        lng = element.center.lon;
      } else {
        return;
      }

      const shopType = this.determineShopType(tags);
      if (!shopType) return;

      shops.push({
        id: `osm_${element.id}`,
        osmId: element.id,
        name,
        type: shopType,
        coords: [parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6))],
        tags
      });
    });

    return shops;
  },

  determineShopType(tags) {
    if (tags.amenity === 'marketplace') return 'market';
    if (tags.shop === 'greengrocer') return 'greengrocer';
    if (tags.shop === 'supermarket' || tags.shop === 'convenience') return 'supermarket';
    if (tags.shop === 'bakery') return 'bakery';
    if (tags.leisure === 'park') return 'park';
    return null;
  },

  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  },

  shouldFetchNewData(currentPos, lastFetchPos, threshold = 200) {
    if (!lastFetchPos) return true;
    const distance = this.calculateDistance(
      currentPos.lat,
      currentPos.lng,
      lastFetchPos.lat,
      lastFetchPos.lng
    );
    return distance > threshold;
  },

  async fetchHealthyRecipe(language = 'es') {
    try {
      this.cleanExpiredItems('seen_recipes');
      
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        const response = await fetch(`${THEMEALDB_URL}/random.php`);
        
        if (!response.ok) {
          throw new Error(`TheMealDB API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.meals || data.meals.length === 0) {
          attempts++;
          continue;
        }

        const meal = data.meals[0];
        
        if (HEALTHY_CATEGORIES.includes(meal.strCategory)) {
          const seenRecipes = JSON.parse(localStorage.getItem('seen_recipes') || '[]');
          const seenIds = new Set(seenRecipes.map(item => item.id));
          
          if (!seenIds.has(meal.idMeal)) {
            const recipe = this.convertMealToRecipe(meal, language);
            this.markAsSeen(meal.idMeal, 'seen_recipes');
            return recipe;
          }
        }
        
        attempts++;
      }
      
      return this.getFallbackRecipe(language);
    } catch (error) {
      console.error('Error fetching recipe from TheMealDB:', error);
      return this.getFallbackRecipe(language);
    }
  },

  convertMealToRecipe(meal, language) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure} ${ingredient}`.trim());
      }
    }

    const saltFreeTip = {
      es: "💡 TIP SIN SAL: Usa especias como ajo, cebolla, pimienta, limón o hierbas aromáticas para dar sabor sin añadir sal.",
      en: "💡 SALT-FREE TIP: Use spices like garlic, onion, pepper, lemon or aromatic herbs to add flavor without salt."
    };

    return {
      id: meal.idMeal,
      name: meal.strMeal,
      category: meal.strCategory,
      area: meal.strArea,
      image: meal.strMealThumb,
      instructions: meal.strInstructions,
      ingredients,
      video: meal.strYoutube,
      saltFreeTip: saltFreeTip[language] || saltFreeTip.es,
      source: 'TheMealDB'
    };
  },

  getFallbackRecipe(language) {
    const recipes = {
      es: {
        id: 'fallback_1',
        name: 'Ensalada Mediterránea',
        category: 'Vegetarian',
        area: 'Mediterranean',
        image: null,
        instructions: 'Mezcla lechuga, tomate, pepino, aceitunas y queso fresco. Aliña con limón y aceite de oliva virgen extra.',
        ingredients: ['Lechuga', 'Tomate', 'Pepino', 'Aceitunas', 'Queso fresco', 'Limón', 'AOVE'],
        video: null,
        saltFreeTip: "💡 TIP SIN SAL: El limón y las aceitunas ya aportan sabor intenso. No necesitas sal.",
        source: 'Local'
      },
      en: {
        id: 'fallback_1',
        name: 'Mediterranean Salad',
        category: 'Vegetarian',
        area: 'Mediterranean',
        image: null,
        instructions: 'Mix lettuce, tomato, cucumber, olives and fresh cheese. Dress with lemon and extra virgin olive oil.',
        ingredients: ['Lettuce', 'Tomato', 'Cucumber', 'Olives', 'Fresh cheese', 'Lemon', 'EVOO'],
        video: null,
        saltFreeTip: "💡 SALT-FREE TIP: Lemon and olives already provide intense flavor. You don't need salt.",
        source: 'Local'
      }
    };

    return recipes[language] || recipes.es;
  },

  getUniqueProduct(apiResults) {
    const seen = JSON.parse(localStorage.getItem('seen_products') || '[]');
    const available = apiResults.filter(p => !seen.includes(p.code || p.name));
    
    if (available.length === 0) {
      localStorage.setItem('seen_products', JSON.stringify([]));
      return apiResults[0];
    }
    
    const selected = available[Math.floor(Math.random() * available.length)];
    
    const productId = selected.code || selected.name;
    const newSeen = [productId, ...seen].slice(0, MAX_SEEN_ITEMS);
    localStorage.setItem('seen_products', JSON.stringify(newSeen));
    
    return selected;
  },

  isRecipeSeen(recipeId) {
    const seen = JSON.parse(localStorage.getItem('seen_recipes') || '[]');
    return seen.includes(recipeId);
  },

  markRecipeAsSeen(recipeId) {
    const seen = JSON.parse(localStorage.getItem('seen_recipes') || '[]');
    const newSeen = [recipeId, ...seen].slice(0, MAX_SEEN_ITEMS);
    localStorage.setItem('seen_recipes', JSON.stringify(newSeen));
  },

  resetSeenItems() {
    localStorage.setItem('seen_products', JSON.stringify([]));
    localStorage.setItem('seen_recipes', JSON.stringify([]));
  }
};
