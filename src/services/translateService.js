const LIBRETRANSLATE_URL = 'https://libretranslate.de/translate';

const INGREDIENT_DICTIONARY = {
  // Carnes y Proteínas
  'chicken': 'pollo',
  'beef': 'ternera',
  'pork': 'cerdo',
  'lamb': 'cordero',
  'turkey': 'pavo',
  'fish': 'pescado',
  'salmon': 'salmón',
  'tuna': 'atún',
  'cod': 'bacalao',
  'shrimp': 'gambas',
  'prawns': 'langostinos',
  'egg': 'huevo',
  'eggs': 'huevos',
  
  // Verduras
  'tomato': 'tomate',
  'tomatoes': 'tomates',
  'onion': 'cebolla',
  'onions': 'cebollas',
  'garlic': 'ajo',
  'potato': 'patata',
  'potatoes': 'patatas',
  'carrot': 'zanahoria',
  'carrots': 'zanahorias',
  'pepper': 'pimiento',
  'peppers': 'pimientos',
  'lettuce': 'lechuga',
  'spinach': 'espinacas',
  'broccoli': 'brócoli',
  'cucumber': 'pepino',
  'zucchini': 'calabacín',
  'eggplant': 'berenjena',
  'mushroom': 'champiñón',
  'mushrooms': 'champiñones',
  'celery': 'apio',
  'cabbage': 'col',
  'cauliflower': 'coliflor',
  
  // Frutas
  'apple': 'manzana',
  'apples': 'manzanas',
  'orange': 'naranja',
  'oranges': 'naranjas',
  'lemon': 'limón',
  'lemons': 'limones',
  'lime': 'lima',
  'banana': 'plátano',
  'bananas': 'plátanos',
  'strawberry': 'fresa',
  'strawberries': 'fresas',
  'grape': 'uva',
  'grapes': 'uvas',
  'peach': 'melocotón',
  'pear': 'pera',
  'avocado': 'aguacate',
  
  // Lácteos
  'milk': 'leche',
  'cheese': 'queso',
  'butter': 'mantequilla',
  'cream': 'nata',
  'yogurt': 'yogur',
  
  // Granos y Legumbres
  'rice': 'arroz',
  'pasta': 'pasta',
  'bread': 'pan',
  'flour': 'harina',
  'beans': 'judías',
  'lentils': 'lentejas',
  'chickpeas': 'garbanzos',
  
  // Condimentos y Especias
  'salt': 'sal',
  'pepper': 'pimienta',
  'olive oil': 'aceite de oliva',
  'oil': 'aceite',
  'vinegar': 'vinagre',
  'sugar': 'azúcar',
  'honey': 'miel',
  'oregano': 'orégano',
  'basil': 'albahaca',
  'parsley': 'perejil',
  'thyme': 'tomillo',
  'rosemary': 'romero',
  'cumin': 'comino',
  'paprika': 'pimentón',
  'cinnamon': 'canela',
  
  // Otros
  'water': 'agua',
  'stock': 'caldo',
  'broth': 'caldo',
  'sauce': 'salsa',
  'fresh': 'fresco',
  'dried': 'seco',
  'chopped': 'picado',
  'sliced': 'en rodajas',
  'diced': 'en dados',
  'minced': 'picado fino',
  'grated': 'rallado',
  'boiled': 'hervido',
  'fried': 'frito',
  'baked': 'horneado',
  'grilled': 'a la plancha',
  'steamed': 'al vapor'
};

const CATEGORY_DICTIONARY = {
  'Seafood': 'Pescado y Marisco',
  'Vegetarian': 'Vegetariano',
  'Chicken': 'Pollo',
  'Beef': 'Ternera',
  'Pork': 'Cerdo',
  'Lamb': 'Cordero',
  'Pasta': 'Pasta',
  'Dessert': 'Postre',
  'Breakfast': 'Desayuno',
  'Side': 'Acompañamiento',
  'Starter': 'Entrante',
  'Vegan': 'Vegano'
};

export const translateService = {
  async translateText(text, targetLang = 'es') {
    if (!text || targetLang === 'en') return text;

    return this.quickTranslateIngredients(text);
  },

  translateIngredient(ingredient) {
    if (!ingredient) return '';
    
    const lowerIngredient = ingredient.toLowerCase();
    
    for (const [en, es] of Object.entries(INGREDIENT_DICTIONARY)) {
      const regex = new RegExp(`\\b${en}\\b`, 'gi');
      if (regex.test(lowerIngredient)) {
        return ingredient.replace(regex, es);
      }
    }
    
    return ingredient;
  },

  translateIngredientsList(ingredients) {
    if (!Array.isArray(ingredients)) return [];
    return ingredients.map(ing => this.translateIngredient(ing));
  },

  translateCategory(category) {
    return CATEGORY_DICTIONARY[category] || category;
  },

  async translateRecipe(recipe, targetLang = 'es') {
    if (!recipe || targetLang === 'en') return recipe;

    const translatedRecipe = { ...recipe };

    translatedRecipe.name = this.quickTranslateIngredients(recipe.name);
    translatedRecipe.instructions = this.quickTranslateIngredients(recipe.instructions);
    translatedRecipe.category = this.translateCategory(recipe.category);
    
    if (recipe.ingredients) {
      translatedRecipe.ingredients = this.translateIngredientsList(recipe.ingredients);
    }

    translatedRecipe.translatedFrom = 'en';
    translatedRecipe.translatedTo = targetLang;
    translatedRecipe.translationMethod = 'dictionary';

    return translatedRecipe;
  },

  quickTranslateIngredients(text) {
    if (!text) return text;
    
    let translatedText = text;
    
    for (const [en, es] of Object.entries(INGREDIENT_DICTIONARY)) {
      const regex = new RegExp(`\\b${en}\\b`, 'gi');
      translatedText = translatedText.replace(regex, es);
    }
    
    return translatedText;
  },

  getTranslateButtonUrl(text, targetLang = 'es') {
    const encodedText = encodeURIComponent(text);
    return `https://translate.google.com/?sl=en&tl=${targetLang}&text=${encodedText}&op=translate`;
  }
};
