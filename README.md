# 🗺️ Neighborhood Explorer - Fog of War PWA

**Progressive Web App 100% Client-Side** para explorar tu barrio en la vida real y descubrir lugares saludables, recetas sin sal y consejos de bienestar.

## 🎮 Concepto

Camina por tu ciudad y despeja la "niebla de guerra" (Fog of War) en un mapa interactivo. Cada celda de 20m x 20m que visites se guarda en tu navegador. Descubre POIs (puntos de interés) ocultos cuando te acercas a menos de 30 metros.

## ✨ Características

- **🌫️ Fog of War**: Canvas overlay con `globalCompositeOperation = 'destination-out'` para borrar niebla
- **📍 Tracking GPS Real**: `navigator.geolocation.watchPosition` con alta precisión
- **🎮 Modo Simulación**: Pad de flechas para testear sin salir de casa
- **🗂️ Persistencia Local**: Todo en `localStorage` (celdas visitadas, POIs descubiertos, nivel)
- **🌍 i18n Manual**: Switch ES/EN sin librerías pesadas
- **🎨 UI Cyberpunk/Saludable**: Dark mode + colores neón (verde/cyan/rosa)
- **📱 Mobile-First**: Diseño responsive optimizado para móviles
- **💾 PWA**: Manifest + Service Worker para instalación offline

## 🛠️ Stack Técnico

- **React** (Vite)
- **Leaflet.js** + react-leaflet (mapas)
- **Tailwind CSS** (estilos)
- **Lucide React** (iconos)
- **LocalStorage** (persistencia)

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── MapView.jsx          # Mapa + Canvas fog overlay
│   ├── LanguageSwitch.jsx   # Switch ES/EN
│   ├── Backpack.jsx         # Inventario de descubrimientos
│   ├── LoadingScreen.jsx    # Pantalla de carga cyberpunk
│   ├── SimulationPad.jsx    # Pad de flechas para modo sim
│   └── PlayerHUD.jsx        # HUD con stats y botones
├── utils/
│   └── StorageManager.js    # Gestión de localStorage
├── data.js                  # Traducciones + POIs mockeados
├── App.jsx                  # Componente principal
└── index.css                # Estilos Tailwind + custom
```

## 🎯 Cómo Jugar

1. **Habilita la ubicación** cuando el navegador lo solicite
2. **Camina por tu barrio** para descubrir celdas (20m x 20m)
3. **Acércate a POIs** (< 30m) para desbloquear recetas y cupones
4. **Sube de nivel** cada 10 celdas descubiertas
5. **Abre la Mochila** para ver tus descubrimientos
6. **Activa el Modo Simulación** para testear sin GPS

## 🧪 Modo Simulación

Activa el botón "Modo Simulación" para usar el pad de flechas y mover tu marcador manualmente. Útil para:
- Testear el borrado de niebla
- Descubrir POIs sin salir de casa
- Debugging de la lógica de celdas

## 🗺️ Personalización de POIs

Edita `src/data.js` para añadir tus propios puntos de interés:

```javascript
{
  id: 5,
  type: "km0",
  coords: [LAT, LNG],
  name: "Tu lugar favorito",
  reward: "Descripción del premio",
  recipe: {
    title: "Nombre de la receta",
    time: "10 min",
    steps: "Instrucciones..."
  }
}
```

## 🌐 Traducciones

Añade nuevos idiomas en `src/data.js`:

```javascript
translations: {
  es: { ... },
  en: { ... },
  fr: { ... }  // Nuevo idioma
}
```

## 📱 Instalación como PWA

1. Abre la app en Chrome/Edge/Safari móvil
2. Toca "Añadir a pantalla de inicio"
3. Usa la app como nativa (sin barra de navegación)

## 🔒 Privacidad

- **Sin backend**: Todo funciona en el navegador
- **Sin tracking**: No se envían datos a servidores
- **GPS local**: La ubicación nunca sale de tu dispositivo
- **LocalStorage**: Los datos se guardan solo en tu navegador

## 🎨 Paleta de Colores

- **Dark 900**: `#0a0a0a` (fondo principal)
- **Dark 800**: `#121212` (cards)
- **Neon Green**: `#39FF14` (primario)
- **Neon Cyan**: `#00FFFF` (secundario)
- **Neon Pink**: `#FF10F0` (acentos)

## 📄 Licencia

MIT - Úsalo, modifícalo y compártelo libremente.

---

**Hecho con ❤️ para promover hábitos saludables y exploración urbana**
