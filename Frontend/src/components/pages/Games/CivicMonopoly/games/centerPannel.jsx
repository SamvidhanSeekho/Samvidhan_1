import React from 'react';

const CenterPanel = ({ currentPlayer, diceValues, isRolling, onRollDice, onUsePowerCard }) => {
    return (
        <div
            className="center-area bg-gray-100 rounded-lg flex flex-col justify-center items-center p-5"
            style={{ gridColumn: '2 / 11', gridRow: '2 / 11', position: 'absolute', inset: 0, margin: 'auto', width: 'fit-content', height: 'fit-content' }}
        >
            <h1 className="logo text-3xl font-extrabold text-gray-800 mb-4">Civic Monopoly</h1>

            <div className="dice-container mb-4 flex gap-3">
                <div className={`dice w-12 h-12 bg-white border-2 border-gray-600 rounded-lg flex items-center justify-center text-2xl font-bold ${isRolling ? 'animate-bounce' : ''}`}>
                    {diceValues[0]}
                </div>
                <div className={`dice w-12 h-12 bg-white border-2 border-gray-600 rounded-lg flex items-center justify-center text-2xl font-bold ${isRolling ? 'animate-bounce' : ''}`}>
                    {diceValues[1]}
                </div>
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
                <button 
                    onClick={onRollDice} 
                    disabled={isRolling}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isRolling ? 'Rolling...' : 'Roll Dice'}
                </button>
                {/* <button 
                    onClick={onUsePowerCard}
                    disabled={isRolling}
                    className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-3 rounded-lg shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Use Power Card
                </button> */}
            </div>

            <p className="mt-4 text-gray-700 text-center font-semibold">
                Current: {currentPlayer?.name || '—'}
            </p>
        </div>
    );
};

export default CenterPanel;