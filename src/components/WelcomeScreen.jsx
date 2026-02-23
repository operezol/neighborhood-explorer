import { Heart, MapPin, ShoppingBag, ChefHat, Footprints } from 'lucide-react';

export function WelcomeScreen({ onStart, language = 'es' }) {
  const content = {
    es: {
      title: "Fog of Discovery",
      subtitle: "Tu Aventura de Salud Cardiovascular",
      intro: "Bienvenido a una forma revolucionaria de cuidar tu salud mientras exploras tu barrio.",
      benefits: [
        {
          icon: Heart,
          title: "Reduce tu Hipertensión",
          description: "Caminar 30 minutos al día puede reducir tu presión arterial en 5-6 mmHg. Cada celda que descubres es un paso hacia tu salud."
        },
        {
          icon: MapPin,
          title: "Descubre Lugares Reales",
          description: "Encuentra mercados, fruterías y tiendas saludables cerca de ti. Datos reales de OpenStreetMap."
        },
        {
          icon: ShoppingBag,
          title: "Productos Saludables",
          description: "Recibe recomendaciones de productos con Nutriscore A y sin procesar (NOVA 1) de Open Food Facts."
        },
        {
          icon: ChefHat,
          title: "Recetas Sin Sal",
          description: "Desbloquea recetas saludables de TheMealDB con tips especiales para cocinar sin sal añadida."
        },
        {
          icon: Footprints,
          title: "Gamificación Saludable",
          description: "Limpia la niebla del mapa caminando. Cada paso cuenta para tu salud y tu progreso en el juego."
        }
      ],
      howItWorks: "¿Cómo funciona?",
      steps: [
        "🗺️ Activa tu GPS y empieza a caminar",
        "👣 Cada 20x20m que camines limpiará la niebla del mapa",
        "🏪 Descubre tiendas reales cerca de ti",
        "🥗 Obtén productos saludables y recetas sin sal",
        "❤️ Guarda tus recetas favoritas en tu cocina virtual",
        "📊 Sube de nivel mientras mejoras tu salud"
      ],
      healthNote: "💡 Nota de Salud",
      healthText: "Esta app está diseñada específicamente para personas con hipertensión. Todas las recetas incluyen consejos para cocinar sin sal, y los productos recomendados son de máxima calidad nutricional.",
      privacy: "🔒 Privacidad",
      privacyText: "Todos tus datos se guardan localmente en tu dispositivo. No enviamos información a ningún servidor.",
      startButton: "¡Comenzar Aventura!"
    },
    en: {
      title: "Fog of Discovery",
      subtitle: "Your Cardiovascular Health Adventure",
      intro: "Welcome to a revolutionary way to take care of your health while exploring your neighborhood.",
      benefits: [
        {
          icon: Heart,
          title: "Reduce Your Hypertension",
          description: "Walking 30 minutes a day can reduce your blood pressure by 5-6 mmHg. Every cell you discover is a step towards your health."
        },
        {
          icon: MapPin,
          title: "Discover Real Places",
          description: "Find markets, greengrocers and healthy shops near you. Real data from OpenStreetMap."
        },
        {
          icon: ShoppingBag,
          title: "Healthy Products",
          description: "Get recommendations for products with Nutriscore A and unprocessed (NOVA 1) from Open Food Facts."
        },
        {
          icon: ChefHat,
          title: "Salt-Free Recipes",
          description: "Unlock healthy recipes from TheMealDB with special tips for cooking without added salt."
        },
        {
          icon: Footprints,
          title: "Healthy Gamification",
          description: "Clear the fog from the map by walking. Every step counts for your health and your game progress."
        }
      ],
      howItWorks: "How does it work?",
      steps: [
        "🗺️ Turn on your GPS and start walking",
        "👣 Every 20x20m you walk will clear the fog from the map",
        "🏪 Discover real shops near you",
        "🥗 Get healthy products and salt-free recipes",
        "❤️ Save your favorite recipes in your virtual kitchen",
        "📊 Level up while improving your health"
      ],
      healthNote: "💡 Health Note",
      healthText: "This app is specifically designed for people with hypertension. All recipes include tips for cooking without salt, and recommended products are of maximum nutritional quality.",
      privacy: "🔒 Privacy",
      privacyText: "All your data is saved locally on your device. We don't send any information to any server.",
      startButton: "Start Adventure!"
    }
  };

  const t = content[language] || content.es;

  return (
    <div className="fixed inset-0 z-[4000] bg-dark-900 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 pb-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-neon-green text-glow mb-2">
            {t.title}
          </h1>
          <p className="text-xl text-neon-cyan">
            {t.subtitle}
          </p>
        </div>

        <div className="card-dark mb-6">
          <p className="text-gray-300 text-lg leading-relaxed">
            {t.intro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {t.benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="card-dark">
                <div className="flex items-start gap-3">
                  <Icon className="text-neon-pink flex-shrink-0 mt-1" size={28} />
                  <div>
                    <h3 className="font-bold text-white mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card-dark mb-6">
          <h2 className="text-2xl font-bold text-neon-green mb-4">
            {t.howItWorks}
          </h2>
          <div className="space-y-2">
            {t.steps.map((step, index) => (
              <p key={index} className="text-gray-300">
                {step}
              </p>
            ))}
          </div>
        </div>

        <div className="card-dark bg-neon-cyan/10 border-neon-cyan/30 mb-6">
          <h3 className="font-bold text-neon-cyan mb-2">
            {t.healthNote}
          </h3>
          <p className="text-gray-300 text-sm">
            {t.healthText}
          </p>
        </div>

        <div className="card-dark bg-neon-green/10 border-neon-green/30 mb-6">
          <h3 className="font-bold text-neon-green mb-2">
            {t.privacy}
          </h3>
          <p className="text-gray-300 text-sm">
            {t.privacyText}
          </p>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-900 via-dark-900 to-transparent">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={onStart}
              className="btn-neon w-full py-4 text-xl font-bold"
            >
              {t.startButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
