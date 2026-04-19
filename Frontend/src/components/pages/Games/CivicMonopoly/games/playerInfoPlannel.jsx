import React from 'react';

const PlayerInfoPanel = ({ players = [], currentPlayerIndex = 0, onEndTurn, isRolling }) => {
    // Safety check
    if (!Array.isArray(players) || players.length === 0) {
        return (
            <div className="max-w-4xl mx-auto mt-6 p-4 bg-slate-800/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg">
                <h3 className="text-xl font-bold text-cyan-300">No players yet</h3>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-6 p-4 bg-slate-800/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-cyan-300">Players</h3>
                <button
                    onClick={onEndTurn}
                    disabled={isRolling}
                    className="bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400 text-purple-300 font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    End Turn
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {players.map((player, idx) => {
                    // Convert any values to strings safely
                    const playerName = String(player?.name || 'Unknown');
                    const playerPosition = Number(player?.position ?? 0);
                    const playerScore = Number(player?.score ?? 0);
                    const playerColor = String(player?.tokenColor || '#ef4444');
                    
                    return (
                        <div
                            key={player?.id || idx}
                            className={`p-3 rounded-lg border-2 ${
                                idx === currentPlayerIndex
                                    ? 'border-cyan-400 bg-cyan-500/10'
                                    : 'border-gray-600 bg-gray-700/50'
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: playerColor }}
                                />
                                <span className="font-semibold text-sm text-white">{playerName}</span>
                            </div>
                            <div className="text-xs text-gray-300">Position: {playerPosition}</div>
                            <div className="text-xs text-gray-300">Score: {playerScore}</div>
                            {player?.role && typeof player.role === 'object' && player.role.name && (
                                <div className="text-xs text-cyan-400 mt-1">
                                    <span>{String(player.role.icon || '')}</span>
                                    {' '}
                                    <span>{String(player.role.name)}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlayerInfoPanel;