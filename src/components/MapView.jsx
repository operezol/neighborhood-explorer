import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { StorageManager } from '../utils/StorageManager';

const GRID_SIZE = 20;
const FOG_CLEAR_RADIUS = 25;

function FogCanvas({ userPosition, visitedCells, onCellVisit }) {
  const map = useMap();
  const canvasRef = useRef(null);
  const layerRef = useRef(null);
  const dataRef = useRef({ userPosition, visitedCells });

  useEffect(() => {
    dataRef.current = { userPosition, visitedCells };
  }, [userPosition, visitedCells]);

  const drawFog = useCallback(() => {
    if (!canvasRef.current || !map) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { userPosition: currentUserPos, visitedCells: currentCells } = dataRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'destination-out';

    if (currentCells && Object.keys(currentCells).length > 0) {
      Object.keys(currentCells).forEach(key => {
        const cell = currentCells[key];
        const point = map.latLngToContainerPoint([cell.lat, cell.lng]);
        const radiusInPixels = FOG_CLEAR_RADIUS / 
          (156543.03392 * Math.cos(cell.lat * Math.PI / 180) / Math.pow(2, map.getZoom()));
        
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, radiusInPixels
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radiusInPixels, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    if (currentUserPos) {
      const userPoint = map.latLngToContainerPoint(currentUserPos);
      const userRadiusInPixels = FOG_CLEAR_RADIUS / 
        (156543.03392 * Math.cos(currentUserPos.lat * Math.PI / 180) / Math.pow(2, map.getZoom()));
      
      const userGradient = ctx.createRadialGradient(
        userPoint.x, userPoint.y, 0,
        userPoint.x, userPoint.y, userRadiusInPixels
      );
      userGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      userGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.8)');
      userGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = userGradient;
      ctx.beginPath();
      ctx.arc(userPoint.x, userPoint.y, userRadiusInPixels, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
  }, [map]);

  useEffect(() => {
    if (!map || layerRef.current) return;

    const CanvasLayer = L.Layer.extend({
      onAdd: function(mapInstance) {
        const canvas = L.DomUtil.create('canvas');
        const size = mapInstance.getSize();
        canvas.width = size.x;
        canvas.height = size.y;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '400';
        
        this._canvas = canvas;
        canvasRef.current = canvas;
        mapInstance.getPanes().overlayPane.appendChild(canvas);
        
        this._redraw = () => {
          const size = mapInstance.getSize();
          const bounds = mapInstance.getBounds();
          const topLeft = mapInstance.latLngToContainerPoint(bounds.getNorthWest());

          L.DomUtil.setPosition(canvas, topLeft);
          canvas.width = size.x;
          canvas.height = size.y;

          drawFog();
        };

        mapInstance.on('moveend', this._redraw);
        mapInstance.on('zoomend', this._redraw);
        mapInstance.on('resize', this._redraw);
        
        this._redraw();
      },

      onRemove: function(mapInstance) {
        mapInstance.off('moveend', this._redraw);
        mapInstance.off('zoomend', this._redraw);
        mapInstance.off('resize', this._redraw);
        L.DomUtil.remove(this._canvas);
      },

      redraw: function() {
        if (this._redraw) {
          this._redraw();
        }
      }
    });

    const layer = new CanvasLayer();
    layer.addTo(map);
    layerRef.current = layer;

    return () => {
      if (layerRef.current && map) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, drawFog]);

  useEffect(() => {
    if (layerRef.current && map) {
      setTimeout(() => {
        if (layerRef.current) {
          layerRef.current.redraw();
        }
      }, 100);
    }
  }, [map]);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.redraw();
      
      if (userPosition) {
        const cellKey = StorageManager.getCellKey(userPosition.lat, userPosition.lng);
        if (!visitedCells[cellKey]) {
          const isNew = StorageManager.saveVisitedCell(userPosition.lat, userPosition.lng);
          if (isNew && onCellVisit) {
            onCellVisit();
          }
        }
      }
    }
  }, [userPosition, visitedCells, onCellVisit]);

  return null;
}

function MapController({ userPosition, isSimMode }) {
  const map = useMap();

  useEffect(() => {
    if (userPosition && !isSimMode) {
      map.setView(userPosition, map.getZoom(), { animate: true });
    }
  }, [userPosition, map, isSimMode]);

  return null;
}

function LocationMarker({ position }) {
  if (!position) return null;

  return (
    <Circle
      center={position}
      radius={5}
      pathOptions={{
        fillColor: '#39FF14',
        fillOpacity: 1,
        color: '#39FF14',
        weight: 3,
      }}
    />
  );
}

function POIMarkers({ pois, discoveredPOIs }) {
  const discoveredIds = new Set(discoveredPOIs.map(p => p.id));

  return (
    <>
      {pois.map(poi => {
        const isDiscovered = discoveredIds.has(poi.id);
        return (
          <Circle
            key={poi.id}
            center={poi.coords}
            radius={30}
            pathOptions={{
              fillColor: isDiscovered ? '#00FFFF' : '#FF10F0',
              fillOpacity: isDiscovered ? 0.3 : 0.5,
              color: isDiscovered ? '#00FFFF' : '#FF10F0',
              weight: 2,
              dashArray: isDiscovered ? '0' : '5, 5',
            }}
          />
        );
      })}
    </>
  );
}

export function MapView({ 
  userPosition, 
  visitedCells, 
  onCellVisit, 
  isSimMode,
  onMapClick,
  pois = [],
  discoveredPOIs = []
}) {
  const [mapCenter] = useState(userPosition || [41.4036, 2.1744]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={17}
      zoomControl={false}
      className="h-full w-full"
      whenReady={(map) => {
        if (userPosition) {
          map.target.setView(userPosition, 17);
        }
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <POIMarkers pois={pois} discoveredPOIs={discoveredPOIs} />
      
      <FogCanvas 
        userPosition={userPosition} 
        visitedCells={visitedCells}
        onCellVisit={onCellVisit}
      />
      
      <LocationMarker position={userPosition} />
      <MapController userPosition={userPosition} isSimMode={isSimMode} />
    </MapContainer>
  );
}
