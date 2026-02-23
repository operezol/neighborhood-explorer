import { Backpack, Gamepad2 } from 'lucide-react';

export function PlayerHUD({ stats, translations, onOpenBackpack, onToggleSimulation, isSimMode }) {
  const progress = (stats.cellsExplored % 10) * 10;

  return (
    <>
      <div className="fixed top-4 left-4 z-[1000] card-dark min-w-[200px]">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{translations.level}</span>
            <span className="text-lg font-bold text-neon-green">{stats.level}</span>
          </div>
          
          <div className="w-full bg-dark-900 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-green to-neon-cyan transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="text-xs text-gray-400 space-y-1">
            <div>{translations.cells_explored}: <span className="text-neon-cyan">{stats.cellsExplored}</span></div>
            <div>{translations.pois_discovered}: <span className="text-neon-pink">{stats.poisDiscovered}</span></div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-4 right-4 z-[1000] flex justify-between items-end">
        <button
          onClick={onToggleSimulation}
          className={`${isSimMode ? 'btn-neon-pink' : 'btn-neon'} flex items-center gap-2`}
          aria-label={translations.toggle_sim}
        >
          <Gamepad2 size={20} />
          <span className="text-xs">{translations.simulation_mode}</span>
        </button>

        <button
          onClick={onOpenBackpack}
          className="btn-neon flex items-center gap-2"
          aria-label={translations.inventory}
        >
          <Backpack size={24} />
          {stats.poisDiscovered > 0 && (
            <span className="absolute -top-2 -right-2 bg-neon-pink text-dark-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {stats.poisDiscovered}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
