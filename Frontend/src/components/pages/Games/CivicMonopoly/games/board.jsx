import React, { useMemo } from 'react';

const Board = ({ tiles, players, onTileClick, animatingPlayer }) => {
    const tilePositions = useMemo(() => ([
        { gridColumn: '11 / 12', gridRow: '11 / 12' ,rotate: 270},
        { gridColumn: '10 / 11', gridRow: '11 / 12' },
        { gridColumn: '9 / 10', gridRow: '11 / 12' },
        { gridColumn: '8 / 9', gridRow: '11 / 12' },
        { gridColumn: '7 / 8', gridRow: '11 / 12' },
        { gridColumn: '6 / 7', gridRow: '11 / 12' },
        { gridColumn: '5 / 6', gridRow: '11 / 12' },
        { gridColumn: '4 / 5', gridRow: '11 / 12' },
        { gridColumn: '3 / 4', gridRow: '11 / 12' },
        { gridColumn: '2 / 3', gridRow: '11 / 12' },
        { gridColumn: '1 / 2', gridRow: '11 / 12', rotate: 0 },
        { gridColumn: '1 / 2', gridRow: '10 / 11' },
        { gridColumn: '1 / 2', gridRow: '9 / 10' },
        { gridColumn: '1 / 2', gridRow: '8 / 9' },
        { gridColumn: '1 / 2', gridRow: '7 / 8' },
        { gridColumn: '1 / 2', gridRow: '6 / 7' },
        { gridColumn: '1 / 2', gridRow: '5 / 6' },
        { gridColumn: '1 / 2', gridRow: '4 / 5' },
        { gridColumn: '1 / 2', gridRow: '3 / 4' },
        { gridColumn: '1 / 2', gridRow: '2 / 3' },
        { gridColumn: '1 / 2', gridRow: '1 / 2', rotate: 90 },
        { gridColumn: '2 / 3', gridRow: '1 / 2' },
        { gridColumn: '3 / 4', gridRow: '1 / 2' },
        { gridColumn: '4 / 5', gridRow: '1 / 2' },
        { gridColumn: '5 / 6', gridRow: '1 / 2' },
        { gridColumn: '6 / 7', gridRow: '1 / 2' },
        { gridColumn: '7 / 8', gridRow: '1 / 2' },
        { gridColumn: '8 / 9', gridRow: '1 / 2' },
        { gridColumn: '9 / 10', gridRow: '1 / 2' },
        { gridColumn: '10 / 11', gridRow: '1 / 2' },
        { gridColumn: '11 / 12', gridRow: '1 / 2', rotate: 180 },
        { gridColumn: '11 / 12', gridRow: '2 / 3' },
        { gridColumn: '11 / 12', gridRow: '3 / 4' },
        { gridColumn: '11 / 12', gridRow: '4 / 5' },
        { gridColumn: '11 / 12', gridRow: '5 / 6' },
        { gridColumn: '11 / 12', gridRow: '6 / 7' },
        { gridColumn: '11 / 12', gridRow: '7 / 8' },
        { gridColumn: '11 / 12', gridRow: '8 / 9' },
        { gridColumn: '11 / 12', gridRow: '9 / 10' },
        { gridColumn: '11 / 12', gridRow: '10 / 11' }
    ]), []);

    console.log('🎲 Board render:', { 
        animatingPlayer, 
        playerCount: players.length,
        playerPositions: players.map(p => p.position)
    }); 

    const getColorClass = (tile) => {
        switch (tile?.type) {
            case 'right': return 'bg-green-50 border-green-200';
            case 'duty': return 'bg-yellow-50 border-yellow-200';
            case 'institution': return 'bg-blue-50 border-blue-200';
            case 'event': return 'bg-purple-50 border-purple-200';
            case 'challenge': return 'bg-red-50 border-red-200';
            case 'corner': return 'bg-white border-gray-300 rounded-lg';
            default: return 'bg-gray-50 border-gray-200';
        }
    };

    const getBarClass = (tile) => {
        switch (tile?.type) {
            case 'right': return 'bg-green-500';
            case 'duty': return 'bg-yellow-500';
            case 'institution': return 'bg-blue-500';
            case 'event': return 'bg-purple-500';
            case 'challenge': return 'bg-red-500';
            default: return 'bg-gray-300';
        }
    };

    const tokenOffset = (idx, count) => {
        if (count <= 1) return { transform: 'translate(0px,0px)' };
        const angle = (idx / count) * Math.PI * 2;
        const r = 16;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        return { transform: `translate(${x}px, ${y}px)` };
    };

    return (
        <div
            className="board relative h-screen"
            style={{
                display: 'grid',
                gridTemplateColumns: '100px repeat(9, 1fr) 100px',
                gridTemplateRows: '100px repeat(9, 1fr) 100px',
                gap: '2px',
                width: '130vmin',
                height: '90vmin',
                maxWidth: '900px',
                maxHeight: '900px',
                margin: '2.5vmin auto',
                backgroundColor: '#1a202c',
                borderRadius: 8,
                border: '4px solid #2d3748'
            }}
        >
            {tiles.map((tile, i) => {
                const pos = tilePositions[i] || {};
                const rotateStyle = pos.rotate ? { transform: `rotate(${pos.rotate}deg)` } : {};
                const isCorner = tile.type === 'corner';
                const tokens = players.filter(p => (p.position ?? 0) === i);

                if (tokens.length > 0) {
                    console.log(`Tile ${i} has tokens:`, tokens.map(p => ({ 
                        id: p.id, 
                        name: p.name,
                        playerIndex: players.findIndex(player => player.id === p.id)
                    })));
                }

                return (
                    <div
                        key={i}
                        onClick={() => onTileClick(i)}
                        className={`tile relative flex flex-col justify-between items-center p-1 text-center text-[12px] leading-tight overflow-hidden cursor-pointer border ${getColorClass(tile)}`}
                        style={{ ...pos, ...rotateStyle }}
                    >
                        {isCorner ? (
                            <div className="corner font-bold text-sm">
                                {tile.corner === 'start' && <div className="text-base">We The People<br /><span className="text-xs text-blue-600">START</span></div>}
                                {tile.corner === 'amendment' && <div>Amendment Zone</div>}
                                {tile.corner === 'parking' && <div>Free Parking</div>}
                                {tile.corner === 'go_to_challenge' && <div>Go To<br />Challenge</div>}
                            </div>
                        ) : (
                            <>
                                <div className={`color-bar w-full h-[20%] ${getBarClass(tile)}`} />
                                <div className={`title font-semibold p-1 flex-1 flex items-center text-[10px] justify-center ${((i > 10 && i < 20) || (i > 30 && i < 40)) ? 'writing-mode-vertical' : ''}`}>
                                    {tile.name}
                                </div>
                            </>
                        )}

                        {tile.owner != null && (
                            <div className="owner-indicator" style={{ position: 'absolute', bottom: 4, left: 4, width: 14, height: 14, borderRadius: '50%', backgroundColor: tile.ownerColor || '#000', border: '1px solid #fff' }} />
                        )}

                        {/* ✅ FIXED TOKEN RENDERING - Remove duplicate code */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {tokens.map((p, idx) => {
                                // Find player index in main players array
                                const playerIndex = players.findIndex(player => player.id === p.id);
                                const isAnimating = animatingPlayer === playerIndex;
                                
                                return (
                                    <div
                                        key={p.id}
                                        title={p.name}
                                        className={`
                                            transition-all duration-300
                                            ${isAnimating ? 'animate-bounce scale-125 z-50' : 'z-10'}
                                        `}
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            backgroundColor: p.tokenColor || p.color || '#ef4444',
                                            border: '2px solid white',
                                            boxShadow: isAnimating 
                                                ? '0 0 15px rgba(59, 130, 246, 0.8)' 
                                                : '0 0 5px rgba(0,0,0,0.5)',
                                            position: 'absolute',
                                            ...tokenOffset(idx, tokens.length)
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Board;