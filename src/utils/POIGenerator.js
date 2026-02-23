const POI_TEMPLATES = {
  km0: [
    { 
      name: { es: "Frutería {name}", en: "{name} Fruit Shop" }, 
      reward: { es: "10% descuento en fruta de temporada", en: "10% discount on seasonal fruit" }, 
      recipe: { 
        title: { es: "Ensalada de Frutas", en: "Fruit Salad" }, 
        time: "5 min", 
        steps: { es: "Corta fruta fresca, añade zumo de limón y menta.", en: "Cut fresh fruit, add lemon juice and mint." }
      }
    },
    { 
      name: { es: "Verdulería {name}", en: "{name} Vegetable Store" }, 
      reward: { es: "Receta: Verduras al vapor", en: "Recipe: Steamed Vegetables" }, 
      recipe: { 
        title: { es: "Verduras al Vapor sin Sal", en: "Salt-Free Steamed Vegetables" }, 
        time: "15 min", 
        steps: { es: "Cocina al vapor brócoli, zanahoria y calabacín. Aliña con AOVE y limón.", en: "Steam broccoli, carrot and zucchini. Dress with EVOO and lemon." }
      }
    },
    { 
      name: { es: "Panadería {name}", en: "{name} Bakery" }, 
      reward: { es: "Pan integral sin sal", en: "Whole grain bread without salt" }, 
      recipe: { 
        title: { es: "Tostadas Saludables", en: "Healthy Toast" }, 
        time: "3 min", 
        steps: { es: "Tuesta pan integral, añade aguacate y tomate.", en: "Toast whole grain bread, add avocado and tomato." }
      }
    },
    { 
      name: { es: "Mercado {name}", en: "{name} Market" }, 
      reward: { es: "Cupón 15% productos frescos", en: "15% coupon for fresh products" }, 
      recipe: { 
        title: { es: "Gazpacho Andaluz", en: "Andalusian Gazpacho" }, 
        time: "10 min", 
        steps: { es: "Tritura tomate, pepino, pimiento, ajo y AOVE. Sirve frío.", en: "Blend tomato, cucumber, pepper, garlic and EVOO. Serve cold." }
      }
    },
    { 
      name: { es: "Tienda Ecológica {name}", en: "{name} Organic Store" }, 
      reward: { es: "Descuento en productos km0", en: "Discount on local products" }, 
      recipe: { 
        title: { es: "Hummus Casero", en: "Homemade Hummus" }, 
        time: "8 min", 
        steps: { es: "Tritura garbanzos, tahini, limón y ajo. Sin sal añadida.", en: "Blend chickpeas, tahini, lemon and garlic. No added salt." }
      }
    },
  ],
  bakery: [
    { 
      name: { es: "Panadería {name}", en: "{name} Bakery" }, 
      reward: { es: "Pan integral sin sal", en: "Whole grain bread without salt" }, 
      recipe: { 
        title: { es: "Tostadas Saludables", en: "Healthy Toast" }, 
        time: "3 min", 
        steps: { es: "Tuesta pan integral, añade aguacate y tomate.", en: "Toast whole grain bread, add avocado and tomato." }
      }
    },
    { 
      name: { es: "Horno {name}", en: "{name} Bakery" }, 
      reward: { es: "Pan de centeno artesanal", en: "Artisan rye bread" }, 
      recipe: { 
        title: { es: "Tostadas con Aguacate", en: "Avocado Toast" }, 
        time: "3 min", 
        steps: { es: "Tuesta pan integral, machaca aguacate, añade tomate cherry y pimienta negra.", en: "Toast whole grain bread, mash avocado, add cherry tomatoes and black pepper." }
      }
    },
  ],
  health: [
    { 
      name: { es: "Parque {name}", en: "{name} Park" }, 
      reward: { es: "Consejo: 30 min de caminata diaria reduce hipertensión", en: "Tip: 30 min daily walk reduces hypertension" }
    },
    { 
      name: { es: "Zona Verde {name}", en: "{name} Green Area" }, 
      reward: { es: "Tip: El ejercicio al aire libre mejora la salud cardiovascular", en: "Tip: Outdoor exercise improves cardiovascular health" }
    },
    { 
      name: { es: "Plaza {name}", en: "{name} Square" }, 
      reward: { es: "Consejo: Caminar después de comer ayuda a la digestión", en: "Tip: Walking after meals aids digestion" }
    },
    { 
      name: { es: "Jardín {name}", en: "{name} Garden" }, 
      reward: { es: "Tip: El contacto con la naturaleza reduce el estrés", en: "Tip: Contact with nature reduces stress" }
    },
  ],
  water: [
    { 
      name: { es: "Fuente {name}", en: "{name} Fountain" }, 
      reward: { es: "Hidratación: Bebe 2L de agua al día", en: "Hydration: Drink 2L of water daily" }, 
      recipe: { 
        title: { es: "Agua Saborizada", en: "Flavored Water" }, 
        time: "2 min", 
        steps: { es: "Añade rodajas de limón, pepino y menta al agua.", en: "Add lemon slices, cucumber and mint to water." }
      }
    },
  ]
};

const PLACE_NAMES = [
  "del Sol", "de la Luna", "Central", "del Norte", "del Sur", "del Este", "del Oeste",
  "Mayor", "Real", "Nueva", "Vieja", "Moderna", "Tradicional", "La Esquina",
  "El Rincón", "La Plaza", "El Mercado", "La Huerta", "El Jardín", "La Fuente",
  "San Juan", "Santa María", "San Pedro", "Santa Ana", "San José",
  "dels Àngels", "de Gràcia", "del Carme", "de la Pau", "de l'Esperança"
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomOffset(maxDistanceMeters = 500) {
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * maxDistanceMeters;
  
  const latOffset = (distance * Math.cos(angle)) / 111320;
  const lngOffset = (distance * Math.sin(angle)) / (111320 * Math.cos(0));
  
  return { latOffset, lngOffset };
}

export function generatePOIsNearPosition(centerLat, centerLng, count = 20, maxDistance = 500) {
  const pois = [];
  const usedNames = new Set();
  
  for (let i = 0; i < count; i++) {
    const type = getRandomElement(['km0', 'km0', 'km0', 'health', 'water']);
    const templates = POI_TEMPLATES[type];
    const template = getRandomElement(templates);
    
    let placeName;
    do {
      placeName = getRandomElement(PLACE_NAMES);
    } while (usedNames.has(placeName) && usedNames.size < PLACE_NAMES.length);
    usedNames.add(placeName);
    
    const name = {
      es: template.name.es.replace('{name}', placeName),
      en: template.name.en.replace('{name}', placeName)
    };
    
    const { latOffset, lngOffset } = generateRandomOffset(maxDistance);
    const coords = [
      parseFloat((centerLat + latOffset).toFixed(6)),
      parseFloat((centerLng + lngOffset).toFixed(6))
    ];
    
    const poi = {
      id: `generated_${i}_${Date.now()}`,
      type,
      coords,
      name,
      reward: template.reward,
      recipe: template.recipe ? {
        title: template.recipe.title,
        time: template.recipe.time,
        steps: template.recipe.steps
      } : null,
      isGenerated: true
    };
    
    pois.push(poi);
  }
  
  return pois;
}

export function generateDensePOIGrid(centerLat, centerLng, gridSize = 5, spacing = 100) {
  const pois = [];
  const halfGrid = Math.floor(gridSize / 2);
  let idCounter = 0;
  
  for (let i = -halfGrid; i <= halfGrid; i++) {
    for (let j = -halfGrid; j <= halfGrid; j++) {
      if (i === 0 && j === 0) continue;
      
      const latOffset = (i * spacing) / 111320;
      const lngOffset = (j * spacing) / (111320 * Math.cos(centerLat * Math.PI / 180));
      
      const type = getRandomElement(['km0', 'km0', 'health']);
      const templates = POI_TEMPLATES[type];
      const template = getRandomElement(templates);
      const placeName = getRandomElement(PLACE_NAMES);
      const name = template.name.replace('{name}', placeName);
      
      const coords = [
        parseFloat((centerLat + latOffset).toFixed(6)),
        parseFloat((centerLng + lngOffset).toFixed(6))
      ];
      
      pois.push({
        id: `grid_${idCounter++}_${Date.now()}`,
        type,
        coords,
        name,
        reward: template.reward,
        recipe: template.recipe || null,
        isGenerated: true
      });
    }
  }
  
  return pois;
}
