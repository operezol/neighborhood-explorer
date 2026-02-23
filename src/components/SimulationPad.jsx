import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export function SimulationPad({ onMove, isActive }) {
  if (!isActive) return null;

  const handleMove = (direction) => {
    const delta = 0.0001;
    const movements = {
      up: { lat: delta, lng: 0 },
      down: { lat: -delta, lng: 0 },
      left: { lat: 0, lng: -delta },
      right: { lat: 0, lng: delta },
    };
    onMove(movements[direction]);
  };

  return (
    <div className="fixed bottom-24 right-4 z-[1000]">
      <div className="grid grid-cols-3 gap-2">
        <div className="col-start-2">
          <button
            onClick={() => handleMove('up')}
            className="btn-neon p-3"
            aria-label="Move up"
          >
            <ArrowUp size={20} />
          </button>
        </div>
        
        <div className="col-start-1 row-start-2">
          <button
            onClick={() => handleMove('left')}
            className="btn-neon p-3"
            aria-label="Move left"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        
        <div className="col-start-3 row-start-2">
          <button
            onClick={() => handleMove('right')}
            className="btn-neon p-3"
            aria-label="Move right"
          >
            <ArrowRight size={20} />
          </button>
        </div>
        
        <div className="col-start-2 row-start-3">
          <button
            onClick={() => handleMove('down')}
            className="btn-neon p-3"
            aria-label="Move down"
          >
            <ArrowDown size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
