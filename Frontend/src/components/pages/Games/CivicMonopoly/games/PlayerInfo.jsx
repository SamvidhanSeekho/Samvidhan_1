// # Player stats panel 
import React from "react";

const PlayerInfo = ({ players = [], currentPlayerIndex = 0, onSelectPlayer = () => { } }) => {
  return (
    <>
      <aside className="w-full md:w-64 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
        <h2 className="text-sm font-semibold text-gray-100 mb-2">Players</h2>
        <ul className="space-y-2">
          {players.map((p, i) => (
            <li
              key={p.id ?? i}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-white/3 transition ${i === currentPlayerIndex ? 'ring-2 ring-indigo-400 bg-white/6' : ''
                }`}
              onClick={() => onSelectPlayer(p, i)}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: p.tokenColor || '#6b7280' }}
                aria-hidden={true}
              >
                {p.name?.charAt(0) ?? 'P'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white truncate">{p.name || `Player ${i + 1}`}</span>
                  <span className="text-xs text-gray-300">Points: {p.score ?? 0}</span>
                  <span className="text-xs text-gray-300">
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                    {p.role && typeof p.role === 'object' ? (p.role.icon || '') : ''}
                  {/* <span className="text-xs text-gray-400">•</span> */}
                  {/* <span className="text-xs text-gray-300">{(p.properties?.length) ?? 0} props</span> */}
                </div>
              </div>

              <div className="text-xs text-gray-100/60">{i === currentPlayerIndex ? 'Turn' : ''}</div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default PlayerInfo;