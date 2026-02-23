const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const RECIPE_TEMPLATES = {
  market: [
    {
      title: { es: "Ensalada Mediterránea", en: "Mediterranean Salad" },
      time: "8 min",
      steps: { 
        es: "Mezcla lechuga, tomate, pepino, aceitunas y queso fresco. Aliña con limón y AOVE.",
        en: "Mix lettuce, tomato, cucumber, olives and fresh cheese. Dress with lemon and EVOO."
      }
    },
    {
      title: { es: "Gazpacho Andaluz", en: "Andalusian Gazpacho" },
      time: "10 min",
      steps: { 
        es: "Tritura tomate, pepino, pimiento, ajo y AOVE. Sirve frío.",
        en: "Blend tomato, cucumber, pepper, garlic and EVOO. Serve cold."
      }
    }
  ],
  greengrocer: [
    {
      title: { es: "Ensalada de Frutas", en: "Fruit Salad" },
      time: "5 min",
      steps: { 
        es: "Corta fruta fresca, añade zumo de limón y menta.",
        en: "Cut fresh fruit, add lemon juice and mint."
      }
    },
    {
      title: { es: "Carpaccio de Tomate y Albahaca", en: "Tomato and Basil Carpaccio" },
      time: "5 min",
      steps: { 
        es: "Cortar fino, añadir AOVE y pimienta. ¡Evita la sal!",
        en: "Slice thinly, add EVOO and pepper. Avoid salt!"
      }
    }
  ],
  supermarket: [
    {
      title: { es: "Verduras al Vapor sin Sal", en: "Salt-Free Steamed Vegetables" },
      time: "15 min",
      steps: { 
        es: "Cocina al vapor brócoli, zanahoria y calabacín. Aliña con AOVE y limón.",
        en: "Steam broccoli, carrot and zucchini. Dress with EVOO and lemon."
      }
    },
    {
      title: { es: "Hummus Casero", en: "Homemade Hummus" },
      time: "8 min",
      steps: { 
        es: "Tritura garbanzos, tahini, limón y ajo. Sin sal añadida.",
        en: "Blend chickpeas, tahini, lemon and garlic. No added salt."
      }
    }
  ]
};

function getRandomRecipe(type) {
  const recipes = RECIPE_TEMPLATES[type] || RECIPE_TEMPLATES.market;
  return recipes[Math.floor(Math.random() * recipes.length)];
}

export async function fetchNearbyPOIs(lat, lng, radius = 500, retries = 2) {
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="marketplace"](around:${radius},${lat},${lng});
      node["shop"="greengrocer"](around:${radius},${lat},${lng});
      node["shop"="supermarket"](around:${radius},${lat},${lng});
      node["shop"="bakery"](around:${radius},${lat},${lng});
      node["leisure"="park"](around:${radius},${lat},${lng});
    );
    out body;
  `;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 504 || response.status === 429) {
          if (attempt < retries) {
            console.log(`Overpass API ${response.status}, retrying in ${(attempt + 1) * 2}s...`);
            await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 2000));
            continue;
          }
        }
        throw new Error(`Overpass API error: ${response.status}`);
      }

      const data = await response.json();
      const pois = convertOSMToPOIs(data.elements, lat, lng);
      
      if (pois.length > 0) {
        console.log(`✅ Loaded ${pois.length} real POIs from Overpass API`);
      }
      
      return pois;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`Overpass API timeout on attempt ${attempt + 1}`);
      } else {
        console.error(`Error fetching POIs from Overpass API (attempt ${attempt + 1}):`, error);
      }
      
      if (attempt === retries) {
        console.log('⚠️ Overpass API unavailable, using generated POIs only');
        return [];
      }
    }
  }
  
  return [];
}

function convertOSMToPOIs(elements, lat, lng) {
  const pois = [];

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

    const poiType = determinePOIType(tags);
    if (!poiType) return;

    const poi = createPOIFromOSM(element.id, name, lat, lng, poiType, tags);
    if (poi) {
      pois.push(poi);
    }
  });

  return pois;
}

function determinePOIType(tags) {
  if (tags.amenity === 'marketplace') return 'market';
  if (tags.shop === 'greengrocer') return 'greengrocer';
  if (tags.shop === 'supermarket' || tags.shop === 'convenience') return 'supermarket';
  if (tags.shop === 'bakery') return 'bakery';
  if (tags.leisure === 'park') return 'park';
  return null;
}

function createPOIFromOSM(id, name, lat, lng, type, tags) {
  const coords = [parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6))];

  if (type === 'park') {
    return {
      id: `osm_${id}`,
      type: 'health',
      coords,
      name: {
        es: name,
        en: name
      },
      reward: {
        es: "Consejo: 30 min de caminata diaria reduce hipertensión",
        en: "Tip: 30 min daily walk reduces hypertension"
      },
      recipe: null,
      isReal: true,
      osmId: id
    };
  }

  const recipe = getRandomRecipe(type);
  const rewardTexts = {
    market: {
      es: "15% descuento en productos frescos",
      en: "15% discount on fresh products"
    },
    greengrocer: {
      es: "10% descuento en fruta de temporada",
      en: "10% discount on seasonal fruit"
    },
    supermarket: {
      es: "Cupón descuento en productos saludables",
      en: "Discount coupon for healthy products"
    },
    bakery: {
      es: "Pan integral sin sal añadida",
      en: "Whole grain bread without added salt"
    }
  };

  return {
    id: `osm_${id}`,
    type: 'km0',
    coords,
    name: {
      es: name,
      en: name
    },
    reward: rewardTexts[type] || rewardTexts.market,
    recipe,
    isReal: true,
    osmId: id
  };
}

export function shouldFetchNewPOIs(currentPos, lastFetchPos, threshold = 200) {
  if (!lastFetchPos) return true;

  const R = 6371e3;
  const φ1 = currentPos.lat * Math.PI / 180;
  const φ2 = lastFetchPos.lat * Math.PI / 180;
  const Δφ = (lastFetchPos.lat - currentPos.lat) * Math.PI / 180;
  const Δλ = (lastFetchPos.lng - currentPos.lng) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance > threshold;
}
