export async function captureScreenshot() {
  try {
    const mapElement = document.querySelector('.leaflet-container');
    if (!mapElement) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const mapCanvas = mapElement.querySelector('canvas');
    if (mapCanvas) {
      ctx.drawImage(mapCanvas, 0, 0);
    }

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
}

export async function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}

export function generateShareText(poi, stats, language = 'es') {
  const poiName = typeof poi.name === 'object' && poi.name[language] 
    ? poi.name[language] 
    : poi.name;

  const texts = {
    es: {
      discovered: `¡Acabo de descubrir "${poiName}" en Neighborhood Explorer! 🎉`,
      stats: `📍 Nivel ${stats.level} | 🗺️ ${stats.cellsExplored} celdas exploradas | 🎁 ${stats.poisDiscovered} lugares descubiertos`,
      hashtags: '#NeighborhoodExplorer #SaludCardiovascular #CaminaSinSal #Km0',
      cta: '¡Únete a la aventura de explorar tu barrio de forma saludable!'
    },
    en: {
      discovered: `I just discovered "${poiName}" in Neighborhood Explorer! 🎉`,
      stats: `📍 Level ${stats.level} | 🗺️ ${stats.cellsExplored} cells explored | 🎁 ${stats.poisDiscovered} places discovered`,
      hashtags: '#NeighborhoodExplorer #HeartHealth #WalkMore #LocalFood',
      cta: 'Join the adventure of exploring your neighborhood in a healthy way!'
    }
  };

  const t = texts[language] || texts.es;
  return `${t.discovered}\n\n${t.stats}\n\n${t.cta}\n\n${t.hashtags}`;
}

export async function shareDiscovery(poi, stats, language = 'es') {
  const text = generateShareText(poi, stats, language);
  const url = window.location.href;

  if (navigator.share) {
    try {
      const screenshot = await captureScreenshot();
      
      if (screenshot) {
        const blob = await fetch(screenshot).then(r => r.blob());
        const file = new File([blob], 'neighborhood-explorer.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'Neighborhood Explorer',
          text: text,
          files: [file]
        });
      } else {
        await navigator.share({
          title: 'Neighborhood Explorer',
          text: text,
          url: url
        });
      }
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return false;
    }
  } else {
    return shareViaFallback(text, url);
  }
}

function shareViaFallback(text, url) {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  
  const shareOptions = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    }
  ];

  return shareOptions;
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
      .then(() => true)
      .catch(() => false);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return Promise.resolve(success);
  }
}
