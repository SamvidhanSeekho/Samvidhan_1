import React from 'react';

const GameLog = ({ logs }) => {
    return (
        <div className="max-w-4xl mx-auto mt-4 p-4 bg-slate-800/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg">
            <h4 className="text-sm font-bold text-cyan-300 mb-2">Game Log</h4>
            <div className="bg-gray-900/50 rounded-lg p-3 max-h-32 overflow-y-auto space-y-1">
                {logs.slice(-5).reverse().map((log, idx) => (
                    <div key={idx} className="text-xs text-gray-400">{log}</div>
                ))}
                {logs.length === 0 && (
                    <div className="text-xs text-gray-500 italic">No moves yet...</div>
                )}
            </div>
        </div>
    );
};

export default GameLog;