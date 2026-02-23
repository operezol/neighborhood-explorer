import { useState, useEffect, useCallback } from 'react';
import { MapView } from './components/MapView';
import { LanguageSwitch } from './components/LanguageSwitch';
import { BackpackV4 } from './components/BackpackV4';
import { LoadingScreen } from './components/LoadingScreen';
import { SimulationPad } from './components/SimulationPad';
import { PlayerHUD } from './components/PlayerHUD';
import { POINotification } from './components/POINotification';
import { ShareModal } from './components/ShareModal';
import { DiscoveryModal } from './components/DiscoveryModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StorageManager } from './utils/StorageManager';
import { generatePOIsNearPosition } from './utils/POIGenerator';
import { fetchNearbyPOIs, shouldFetchNewPOIs } from './utils/OverpassAPI';
import { appData } from './data';

function calculateDistance(lat1, lng1, lat2, lng2) {
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
}

function App() {
  const [language, setLanguage] = useState(() => StorageManager.getLanguage());
  const [userPosition, setUserPosition] = useState(null);
  const [visitedCells, setVisitedCells] = useState(() => StorageManager.getVisitedCells());
  const [discoveredPOIs, setDiscoveredPOIs] = useState(() => StorageManager.getDiscoveredPOIs());
  const [playerStats, setPlayerStats] = useState(() => StorageManager.getPlayerStats());
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);
  const [isSimMode, setIsSimMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [watchId, setWatchId] = useState(null);
  const [newPOI, setNewPOI] = useState(null);
  const [allPOIs, setAllPOIs] = useState([...appData.mockPOIs]);
  const [shareModalPOI, setShareModalPOI] = useState(null);
  const [lastFetchPosition, setLastFetchPosition] = useState(null);
  const [isLoadingPOIs, setIsLoadingPOIs] = useState(false);
  const [discoveryModalData, setDiscoveryModalData] = useState(null);
  const [pantryProducts, setPantryProducts] = useState(() => StorageManager.getPantryProducts());
  const [favoriteRecipes, setFavoriteRecipes] = useState(() => StorageManager.getFavoriteRecipes());
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('fog_welcomed'));

  const translations = appData.translations[language];

  const handleLanguageChange = useCallback((newLang) => {
    setLanguage(newLang);
    StorageManager.setLanguage(newLang);
  }, []);

  const loadRealPOIs = useCallback(async (position) => {
    if (isLoadingPOIs) return;
    if (!shouldFetchNewPOIs(position, lastFetchPosition, 200)) return;

    setIsLoadingPOIs(true);
    try {
      const realPOIs = await fetchNearbyPOIs(position.lat, position.lng, 500);
      
      setAllPOIs(prevPOIs => {
        const existingIds = new Set(prevPOIs.map(p => p.id));
        const newPOIs = realPOIs.filter(poi => !existingIds.has(poi.id));
        return [...prevPOIs, ...newPOIs];
      });
      
      setLastFetchPosition(position);
    } catch (error) {
      console.error('Error loading real POIs:', error);
    } finally {
      setIsLoadingPOIs(false);
    }
  }, [isLoadingPOIs, lastFetchPosition]);

  const checkPOIDiscovery = useCallback((position) => {
    allPOIs.forEach(poi => {
      const distance = calculateDistance(
        position.lat,
        position.lng,
        poi.coords[0],
        poi.coords[1]
      );

      if (distance < 30) {
        const isNew = StorageManager.discoverPOI(poi);
        if (isNew) {
          setDiscoveredPOIs(prev => [...prev, { ...poi, discoveredAt: Date.now() }]);
          setPlayerStats(prev => {
            const newStats = {
              ...prev,
              poisDiscovered: prev.poisDiscovered + 1,
            };
            StorageManager.updatePlayerStats(newStats);
            return newStats;
          });

          setNewPOI(poi);
          setDiscoveryModalData({ shop: poi, recipe: poi.recipe });

          try {
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
          } catch (error) {
            console.log('Vibration not available (user interaction required)');
          }
        }
      }
    });
  }, [allPOIs]);

  const handleCellVisit = useCallback(() => {
    setVisitedCells(StorageManager.getVisitedCells());
    setPlayerStats(prev => {
      const cellCount = Object.keys(StorageManager.getVisitedCells()).length;
      const newLevel = StorageManager.calculateLevel(cellCount);
      const newStats = {
        ...prev,
        cellsExplored: cellCount,
        level: newLevel,
      };
      StorageManager.updatePlayerStats(newStats);
      return newStats;
    });
  }, []);

  const handleSimMove = useCallback((delta) => {
    if (!userPosition) return;
    const newPosition = {
      lat: userPosition.lat + delta.lat,
      lng: userPosition.lng + delta.lng,
    };
    setUserPosition(newPosition);
    checkPOIDiscovery(newPosition);
  }, [userPosition, checkPOIDiscovery]);

  useEffect(() => {
    if (!isSimMode && 'geolocation' in navigator) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserPosition(newPos);
          
          loadRealPOIs(newPos);
          
          if (allPOIs.length === appData.mockPOIs.length) {
            const generatedPOIs = generatePOIsNearPosition(newPos.lat, newPos.lng, 15, 500);
            setAllPOIs([...appData.mockPOIs, ...generatedPOIs]);
          }
          
          checkPOIDiscovery(newPos);
          setIsLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setUserPosition({ lat: 41.4036, lng: 2.1744 });
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
      setWatchId(id);

      return () => {
        if (id) {
          navigator.geolocation.clearWatch(id);
        }
      };
    } else if (isSimMode) {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      if (!userPosition) {
        const defaultPos = { lat: 41.4036, lng: 2.1744 };
        setUserPosition(defaultPos);
        
        loadRealPOIs(defaultPos);
        
        if (allPOIs.length === appData.mockPOIs.length) {
          const generatedPOIs = generatePOIsNearPosition(defaultPos.lat, defaultPos.lng, 15, 500);
          setAllPOIs([...appData.mockPOIs, ...generatedPOIs]);
        }
      }
      setIsLoading(false);
    } else {
      const defaultPos = { lat: 41.4036, lng: 2.1744 };
      setUserPosition(defaultPos);
      
      loadRealPOIs(defaultPos);
      
      if (allPOIs.length === appData.mockPOIs.length) {
        const generatedPOIs = generatePOIsNearPosition(defaultPos.lat, defaultPos.lng, 15, 500);
        setAllPOIs([...appData.mockPOIs, ...generatedPOIs]);
      }
      
      setIsLoading(false);
    }
  }, [isSimMode, checkPOIDiscovery, loadRealPOIs]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen translations={translations} />;
  }

  return (
    <div className="h-full w-full relative">
      <MapView
        userPosition={userPosition}
        visitedCells={visitedCells}
        onCellVisit={handleCellVisit}
        isSimMode={isSimMode}
        pois={allPOIs}
        discoveredPOIs={discoveredPOIs}
      />

      <LanguageSwitch
        currentLang={language}
        onLanguageChange={handleLanguageChange}
      />

      <PlayerHUD
        stats={playerStats}
        translations={translations}
        onOpenBackpack={() => setIsBackpackOpen(true)}
        onToggleSimulation={() => setIsSimMode(!isSimMode)}
        isSimMode={isSimMode}
      />

      <SimulationPad
        onMove={handleSimMove}
        isActive={isSimMode}
      />

      <BackpackV4
        isOpen={isBackpackOpen}
        onClose={() => setIsBackpackOpen(false)}
        discoveries={discoveredPOIs}
        pantryProducts={pantryProducts}
        favoriteRecipes={favoriteRecipes}
        translations={translations}
        language={language}
        onToggleFavorite={(recipe) => {
          StorageManager.toggleFavoriteRecipe(recipe);
          setFavoriteRecipes(StorageManager.getFavoriteRecipes());
        }}
      />

      <POINotification
        poi={newPOI}
        onClose={() => setNewPOI(null)}
        onShare={(poi) => setShareModalPOI(poi)}
        language={language}
      />

      <ShareModal
        poi={shareModalPOI}
        stats={playerStats}
        language={language}
        onClose={() => setShareModalPOI(null)}
      />

      {discoveryModalData && (
        <DiscoveryModal
          shop={discoveryModalData.shop}
          recipe={discoveryModalData.recipe}
          language={language}
          onClose={() => setDiscoveryModalData(null)}
          onProductAdded={(products) => {
            setPantryProducts(StorageManager.getPantryProducts());
          }}
          onRecipeToggled={(recipe, isFavorite) => {
            setFavoriteRecipes(StorageManager.getFavoriteRecipes());
          }}
        />
      )}

      {showWelcome && (
        <WelcomeScreen
          language={language}
          onStart={() => {
            localStorage.setItem('fog_welcomed', 'true');
            setShowWelcome(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
