const STORAGE_KEYS = {
  VISITED_CELLS: 'fog_visited_cells',
  DISCOVERED_POIS: 'fog_discovered_pois',
  PLAYER_STATS: 'fog_player_stats',
  LANGUAGE: 'fog_language',
  PANTRY_PRODUCTS: 'fog_pantry_products',
  FAVORITE_RECIPES: 'fog_favorite_recipes',
};

export class StorageManager {
  static getCellKey(lat, lng) {
    const roundedLat = lat.toFixed(4);
    const roundedLng = lng.toFixed(4);
    return `cell_${roundedLat}_${roundedLng}`;
  }

  static getVisitedCells() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VISITED_CELLS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading visited cells:', error);
      return {};
    }
  }

  static saveVisitedCell(lat, lng) {
    try {
      const cells = this.getVisitedCells();
      const key = this.getCellKey(lat, lng);
      
      if (!cells[key]) {
        cells[key] = {
          lat,
          lng,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEYS.VISITED_CELLS, JSON.stringify(cells));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving visited cell:', error);
      return false;
    }
  }

  static getDiscoveredPOIs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISCOVERED_POIS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading discovered POIs:', error);
      return [];
    }
  }

  static discoverPOI(poi) {
    try {
      const discovered = this.getDiscoveredPOIs();
      
      if (!discovered.find(p => p.id === poi.id)) {
        discovered.push({
          ...poi,
          discoveredAt: Date.now(),
        });
        localStorage.setItem(STORAGE_KEYS.DISCOVERED_POIS, JSON.stringify(discovered));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error discovering POI:', error);
      return false;
    }
  }

  static getPlayerStats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
      return data ? JSON.parse(data) : {
        cellsExplored: 0,
        distanceWalked: 0,
        poisDiscovered: 0,
        level: 1,
      };
    } catch (error) {
      console.error('Error loading player stats:', error);
      return {
        cellsExplored: 0,
        distanceWalked: 0,
        poisDiscovered: 0,
        level: 1,
      };
    }
  }

  static updatePlayerStats(stats) {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error updating player stats:', error);
    }
  }

  static getLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'es';
    } catch (error) {
      return 'es';
    }
  }

  static setLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }

  static calculateLevel(cellsExplored) {
    return Math.floor(cellsExplored / 10) + 1;
  }

  static getProgressToNextLevel(cellsExplored) {
    const currentLevelCells = (this.calculateLevel(cellsExplored) - 1) * 10;
    const cellsInCurrentLevel = cellsExplored - currentLevelCells;
    return (cellsInCurrentLevel / 10) * 100;
  }

  static getPantryProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PANTRY_PRODUCTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading pantry products:', error);
      return [];
    }
  }

  static addPantryProduct(product) {
    try {
      const pantry = this.getPantryProducts();
      
      if (!pantry.find(p => (p.code || p.name) === (product.code || product.name))) {
        pantry.push({
          ...product,
          addedAt: Date.now(),
        });
        localStorage.setItem(STORAGE_KEYS.PANTRY_PRODUCTS, JSON.stringify(pantry));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding pantry product:', error);
      return false;
    }
  }

  static getFavoriteRecipes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITE_RECIPES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading favorite recipes:', error);
      return [];
    }
  }

  static toggleFavoriteRecipe(recipe) {
    try {
      const favorites = this.getFavoriteRecipes();
      const index = favorites.findIndex(r => r.id === recipe.id);
      
      if (index >= 0) {
        favorites.splice(index, 1);
        localStorage.setItem(STORAGE_KEYS.FAVORITE_RECIPES, JSON.stringify(favorites));
        return false;
      } else {
        favorites.push({
          ...recipe,
          favoritedAt: Date.now(),
        });
        localStorage.setItem(STORAGE_KEYS.FAVORITE_RECIPES, JSON.stringify(favorites));
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite recipe:', error);
      return false;
    }
  }

  static isRecipeFavorite(recipeId) {
    try {
      const favorites = this.getFavoriteRecipes();
      return favorites.some(r => r.id === recipeId);
    } catch (error) {
      return false;
    }
  }

  static clearAllData() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}
