import React, { useEffect, useState } from "react";

const DEFAULT_ROLES = [
  { name: 'Judge', icon: '⚖️', ability: 'Extra protection from penalties', color: '#8b5cf6' },
  { name: 'Citizen', icon: '👤', ability: 'Bonus points for correct answers', color: '#10b981' },
  { name: 'Activist', icon: '✊', ability: 'Can challenge more frequently', color: '#f59e0b' },
  { name: 'Scholar', icon: '📚', ability: 'Sees hint for first wrong answer', color: '#3b82f6' }
];

export default function RoleSelectionModal({
  open = false,
  names = [],
  roles = DEFAULT_ROLES,
  preselected = [],           // array of role indices or role objects
  onConfirm,                  // (selectedRoles) => void
  onClose,                    // () => void
  uniqueRoles = false,        // when true, prevent duplicates across players
}) {
  const [selectedIdx, setSelectedIdx] = useState([]);

  // Initialize or re-seed selected indices when inputs change
  useEffect(() => {
    const count = Array.isArray(names) ? names.length : 0;
    const safeIdx = Array.from({ length: count }, (_, i) => {
      const preset = preselected?.[i];
      if (typeof preset === 'number') return Math.min(Math.max(preset, 0), roles.length - 1);
      if (preset && typeof preset === 'object') {
        const found = roles.findIndex(r => r.name === preset.name);
        return found >= 0 ? found : (i % roles.length);
      }
      return i % roles.length;
    });
    setSelectedIdx(safeIdx);
  }, [names, roles, preselected]);

  if (!open) return null;

  const confirm = () => {
    const chosen = (selectedIdx || []).map(i => roles[i]);
    onConfirm?.(chosen);
  };

  const isTaken = (roleIdx) => uniqueRoles && selectedIdx.includes(roleIdx);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" aria-hidden="true" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Choose Player Roles</h2>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {(names || []).map((name, playerIdx) => (
            <div key={playerIdx} className="p-4 bg-gray-50 rounded-lg border">
              <div className="mb-2 font-semibold">{name || `Player ${playerIdx + 1}`}</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {roles.map((role, rIdx) => {
                  const checked = selectedIdx[playerIdx] === rIdx;
                  const taken = isTaken(rIdx) && !checked; // block if unique and chosen by others
                  return (
                    <label
                      key={`${playerIdx}-${role.name}`}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${
                        checked
                          ? 'border-blue-500 bg-blue-50'
                          : taken
                            ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                            : 'border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`role-${playerIdx}`}
                        className="mt-1"
                        checked={checked}
                        disabled={taken}
                        onChange={() => {
                          setSelectedIdx(prev => {
                            const next = [...prev];
                            next[playerIdx] = rIdx;
                            return next;
                          });
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{role.icon}</span>
                          <span className="font-medium">{role.name}</span>
                          <span className="w-3 h-3 rounded-full" style={{ background: role.color }} aria-hidden="true" />
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{role.ability}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <button onClick={onClose} className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Back</button>
          <button onClick={confirm} className="w-1/2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">Confirm Roles</button>
        </div>
      </div>
    </>
  );
}
