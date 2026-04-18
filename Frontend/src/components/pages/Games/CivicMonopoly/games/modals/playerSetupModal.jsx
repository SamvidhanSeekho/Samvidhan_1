import React, { useEffect, useMemo, useState } from "react";

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4'];

const PlayerSetupModal = ({
  open = false,
  minPlayers = 2,
  maxPlayers = 4,
  initialCount = 2,
  initialNames = [],
  defaultSound = true,
  onStart,            // ({ players, soundEnabled }) => void
  onClose,            // () => void
  onChooseRoles,      // optional: () => void
  selectedRoles = []
}) => {
  const [count, setCount] = useState(Math.min(Math.max(initialCount, minPlayers), maxPlayers));
  const [soundEnabled, setSoundEnabled] = useState(!!defaultSound);
  const [names, setNames] = useState([]);

  // Ensure names array length matches count
  useEffect(() => {
    const filled = Array.from({ length: count }, (_, i) => {
      const existing = initialNames[i] ?? names[i];
      return (existing && existing.trim()) || `Player ${i + 1}`;
    });
    setNames(filled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const canStart = useMemo(() => {
    if (count < minPlayers || count > maxPlayers) return false;
    const trimmed = names.map(n => (n || '').trim());
    if (trimmed.some(n => n.length === 0)) return false;
    const unique = new Set(trimmed);
    return unique.size === trimmed.length;
  }, [count, names, minPlayers, maxPlayers]);

  const handleNameChange = (i, val) => {
    setNames(prev => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  };

  const handleStart = () => {
    if (!canStart) return;
    const players = Array.from({ length: count }, (_, i) => ({
      id: i,
      name: (names[i] || `Player ${i + 1}`).trim(),
      position: 0,
      score: 0,
      ownedTiles: [],
      powerCards: [],
      tokenColor: COLORS[i % COLORS.length],
      // role: null, // fill later via roles modal if you use onChooseRoles
      role: selectedRoles?.[i] || null,
    }));
    onStart?.({ players, soundEnabled });
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Setup Your Game</h2>

        <div className="mb-4">
          <label htmlFor="player-count" className="block text-gray-700 text-sm font-bold mb-2">
            Number of Players ({minPlayers}-{maxPlayers}):
          </label>
          <input
            type="number"
            id="player-count"
            min={minPlayers}
            max={maxPlayers}
            value={count}
            onChange={(e) => {
              const v = parseInt(e.target.value || `${minPlayers}`, 10);
              setCount(Math.min(Math.max(v, minPlayers), maxPlayers));
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Enable Sound Effects</span>
          </label>
        </div> */}

        <div className="mb-6 space-y-2">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
                aria-hidden="true"
                title={`Token ${i + 1}`}
              />
              <input
                type="text"
                value={names[i] || `Player ${i + 1}`}
                onChange={(e) => handleNameChange(i, e.target.value)}
                placeholder={`Player ${i + 1} Name`}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          ))}
        </div>

        {onChooseRoles && (
          <button
            onClick={() => onChooseRoles({count, names})}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mb-2"
          >
            Choose Roles
          </button>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            Back
          </button>
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`w-1/2 font-bold py-2 px-4 rounded-lg text-white ${
              canStart
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            title={!canStart ? 'Enter unique, non-empty names' : 'Start Game'}
          >
            Start Game
          </button>
        </div>
      </div>
    </>
  );
};

export default PlayerSetupModal;