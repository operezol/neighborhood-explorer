export const appData = {
  translations: {
    es: {
      welcome: "Explorador de Barrio",
      level: "Nivel",
      unlocked: "¡Descubierto!",
      recipe_hint: "Receta saludable en 10 min",
      salt_free: "Sin sal añadida",
      km0_label: "Producto de proximidad",
      inventory: "Mochila",
      simulation_mode: "Modo Simulación",
      cells_explored: "Celdas exploradas",
      distance_walked: "Distancia recorrida",
      pois_discovered: "Lugares descubiertos",
      close_inventory: "Cerrar",
      no_discoveries: "Aún no has descubierto nada. ¡Sal a explorar!",
      enable_location: "Habilitar ubicación",
      location_required: "Necesitamos tu ubicación para jugar",
      health_tip: "Consejo de salud",
      recipe: "Receta",
      reward: "Recompensa",
      steps: "Pasos",
      time: "Tiempo",
      loading: "Cargando mapa...",
      toggle_sim: "Alternar simulación",
    },
    en: {
      welcome: "Neighborhood Explorer",
      level: "Level",
      unlocked: "Unlocked!",
      recipe_hint: "10-min Healthy Recipe",
      salt_free: "No added salt",
      km0_label: "Zero-Kilometer product",
      inventory: "Backpack",
      simulation_mode: "Sim Mode",
      cells_explored: "Cells explored",
      distance_walked: "Distance walked",
      pois_discovered: "Places discovered",
      close_inventory: "Close",
      no_discoveries: "You haven't discovered anything yet. Go explore!",
      enable_location: "Enable location",
      location_required: "We need your location to play",
      health_tip: "Health tip",
      recipe: "Recipe",
      reward: "Reward",
      steps: "Steps",
      time: "Time",
      loading: "Loading map...",
      toggle_sim: "Toggle simulation",
    }
  },
  
  mockPOIs: [
    {
      id: 1,
      type: "km0",
      coords: [41.4036, 2.1744],
      name: {
        es: "Frutería 'La Huerta'",
        en: "The Orchard Fruit Shop"
      },
      reward: {
        es: "10% Descuento en Tomates",
        en: "10% Discount on Tomatoes"
      },
      recipe: {
        title: {
          es: "Carpaccio de Tomate y Albahaca",
          en: "Tomato and Basil Carpaccio"
        },
        time: "5 min",
        steps: {
          es: "Cortar fino, añadir AOVE y pimienta. ¡Evita la sal!",
          en: "Slice thinly, add EVOO and pepper. Avoid salt!"
        }
      }
    },
    {
      id: 2,
      type: "km0",
      coords: [41.4046, 2.1754],
      name: {
        es: "Mercado de Santa Caterina",
        en: "Santa Caterina Market"
      },
      reward: {
        es: "Receta: Ensalada Mediterránea",
        en: "Recipe: Mediterranean Salad"
      },
      recipe: {
        title: {
          es: "Ensalada Mediterránea sin Sal",
          en: "Salt-Free Mediterranean Salad"
        },
        time: "8 min",
        steps: {
          es: "Mezcla lechuga, tomate, pepino, aceitunas y queso fresco. Aliña con limón y AOVE.",
          en: "Mix lettuce, tomato, cucumber, olives and fresh cheese. Dress with lemon and EVOO."
        }
      }
    },
    {
      id: 3,
      type: "health",
      coords: [41.4026, 2.1734],
      name: {
        es: "Parque de la Ciutadella",
        en: "Ciutadella Park"
      },
      reward: {
        es: "Consejo: Caminar 30 min/día reduce hipertensión",
        en: "Tip: Walking 30 min/day reduces hypertension"
      },
      recipe: null
    },
    {
      id: 4,
      type: "km0",
      coords: [41.4056, 2.1764],
      name: {
        es: "Panadería Artesanal",
        en: "Artisan Bakery"
      },
      reward: {
        es: "Pan integral sin sal añadida",
        en: "Whole grain bread without added salt"
      },
      recipe: {
        title: {
          es: "Tostadas con Aguacate",
          en: "Avocado Toast"
        },
        time: "3 min",
        steps: {
          es: "Tuesta pan integral, machaca aguacate, añade tomate cherry y pimienta negra.",
          en: "Toast whole grain bread, mash avocado, add cherry tomatoes and black pepper."
        }
      }
    }
  ],
  
  healthTips: [
    "Caminar reduce la presión arterial sistólica.",
    "El potasio de la fruta ayuda a eliminar sodio.",
    "30 minutos de caminata diaria mejoran la salud cardiovascular.",
    "Las verduras de hoja verde son ricas en magnesio, que regula la presión arterial.",
    "Reducir el sodio puede disminuir la presión arterial en 5-6 mmHg.",
    "El ejercicio regular fortalece el corazón y reduce el estrés."
  ]
};
