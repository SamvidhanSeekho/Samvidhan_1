import React, { useState, useCallback, useEffect, useRef } from 'react';
import { tiles, REQUIRED_POINTS_TO_WIN } from '../data/gameData';
import { useNavigate } from 'react-router-dom';
import Board from './board';
import CenterPanel from './centerPannel';
import PlayerInfoPanel from './PlayerInfo';
import GameLog from './gameLog';
import QuestionModal from './modals/questionModel';
import SetupFlowGate from './components/SetupFlowGate';
import useGameSetupFlow, { getValidatedPlayers } from '../hooks/useGameSetupFlow';
import useGameLog from '../hooks/useGameLog';
import useTurnEngine from '../hooks/useTurnEngine';
import { RxExit } from "react-icons/rx";

const GameBoard = () => {
    const navigate = useNavigate();
    const {
        showIntro,
        showSetup,
        showRoles,
        setupNames,
        selectedRoles,
        gameStarted,
        openSetupFromIntro,
        closeIntro,
        closeSetup,
        openRoleSelection,
        closeRoleSelection,
        confirmRoles,
        completeGameStart
    } = useGameSetupFlow();

    const {
        gameLog,
        logGameStart,
        logRoll,
        logTurn,
        logAnswer
    } = useGameLog();

    // Game state
    const {
        players,
        currentPlayerIndex,
        currentPlayer,
        initPlayers,
        advanceTurn,
        movePlayerToPosition,
        applyCorrectAnswer,
        applyWrongAnswer
    } = useTurnEngine();

    const [diceValues, setDiceValues] = useState(['?', '?']);
    const [isRolling, setIsRolling] = useState(false);
    const [animatingPlayer, setAnimatingPlayer] = useState(null);
    const [showQuestion, setShowQuestion] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentTileIndex, setCurrentTileIndex] = useState(null);
    const [winner, setWinner] = useState(null);

    const rollTimeoutRef = useRef(null);

    useEffect(() => {
        if (winner) return;

        const winningPlayer = players.find((player) => (player.score || 0) >= REQUIRED_POINTS_TO_WIN);

        if (winningPlayer) {
            setWinner(winningPlayer);
            setShowQuestion(false);
            setCurrentQuestion(null);
            setCurrentTileIndex(null);
            setIsRolling(false);
            rollTimeoutRef.current = null;
        }
    }, [players, winner]);

    // Game Start 
    const handleGameStart = ({ players: newPlayers, soundEnabled: sound }) => {
        const validatedPlayers = getValidatedPlayers(newPlayers);

        initPlayers(validatedPlayers);
        completeGameStart({ soundEnabled: sound });

        logGameStart(validatedPlayers[0]?.name || 'Player 1');
        console.log('Game started with players:', validatedPlayers);
    };

    // ✅ MOVE nextTurn BEFORE rollDice so it can be used
    const nextTurn = useCallback(() => {
        if (winner) return;

        if (players.length === 0) return;

        const nextIndex = (currentPlayerIndex + 1) % players.length;
        const nextPlayerName = players[nextIndex]?.name || `Player ${nextIndex + 1}`;
        console.log(`🔄 Turn changed: Player ${currentPlayerIndex + 1} → Player ${nextIndex + 1}`);

        logTurn(nextPlayerName);
        advanceTurn();

        // Reset dice for next player
        setDiceValues(['?', '?']);
    }, [players, currentPlayerIndex, logTurn, advanceTurn, winner]);

    const handleQuestionAnswer = useCallback((isCorrect) => {
        if (winner) return;

        const playerName = players[currentPlayerIndex]?.name || 'Player';
        // ✅ FIX: Add safety check for tile
        if (currentTileIndex === null || currentTileIndex === undefined) {
            console.error('❌ No tile index found');
            setShowQuestion(false);
            setTimeout(() => nextTurn(), 500);
            return;
        }
        const tile = tiles[currentTileIndex];

        if (isCorrect) {
            //Add points from tile
            const pointsEarned = tile.points || 10;

            applyCorrectAnswer(currentPlayerIndex, pointsEarned);

            logAnswer(playerName, true, pointsEarned);
        } else {
            // Apply penalty if the tile has occupied
            const penalty = tile.penalty || 0;

            if (penalty > 0) {
                applyWrongAnswer(currentPlayerIndex, penalty);

                logAnswer(playerName, false, penalty);
            } else {
                logAnswer(playerName, false, 0);
            }
        }
        setShowQuestion(false);
        setCurrentQuestion(null);
        setCurrentTileIndex(null);

        //Advance to next turn
        setTimeout(() => {
            nextTurn();
        }, 500);
    }, [currentPlayerIndex, currentTileIndex, players, nextTurn, logAnswer, winner]);

    const animateTokenMovement = useCallback((playerIndex, startPos, total) => {
        return new Promise((resolve) => {
            setAnimatingPlayer(playerIndex);
            console.log('🎯 Set animatingPlayer to:', playerIndex);
            let currentStep = 0;

            const moveInterval = setInterval(() => {
                currentStep++;
                const newPos = (startPos + currentStep) % 40;
                console.log(`📍 Step ${currentStep}/${total}: position ${newPos}`);


                movePlayerToPosition(playerIndex, newPos);
                if (currentStep >= total) {
                    clearInterval(moveInterval);
                    setAnimatingPlayer(null);
                    console.log('✅ Animation COMPLETE');
                    resolve(newPos);
                }
            }, 200);
        });
    }, []);

    // Roll dice with animation
    const rollDice = useCallback(async () => {
        if (winner) return;

        console.log('🎲 Roll dice called', { isRolling, hasTimeout: !!rollTimeoutRef.current });
        if (isRolling || !gameStarted || rollTimeoutRef.current) return;

        rollTimeoutRef.current = true;
        setIsRolling(true);
        setDiceValues(['?', '?']);

        const rollInterval = setInterval(() => {
            setDiceValues([
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1
            ]);
        }, 100);

        setTimeout(async () => {
            clearInterval(rollInterval);

            const die1 = Math.floor(Math.random() * 6) + 1;
            const die2 = Math.floor(Math.random() * 6) + 1;
            const total = die1 + die2;

            setDiceValues([die1, die2]);

            // ✅ Capture current index at roll time
            const rollingPlayerIndex = currentPlayerIndex;
            const rollingPlayerName = players[rollingPlayerIndex]?.name || `Player ${rollingPlayerIndex + 1}`;

            logRoll(rollingPlayerName, die1, die2, total);
            // ✅ GET oldPos BEFORE setPlayers
            const oldPos = players[rollingPlayerIndex]?.position || 0;
            // await animateTokenMovement(rollingPlayerIndex, oldPos, total);

            //Animate and get final position
            const finalPosition = await animateTokenMovement(rollingPlayerIndex, oldPos, total);

            setTimeout(() => {
                setIsRolling(false);
                rollTimeoutRef.current = null;
                console.log('✅ Roll complete, checking tile:', finalPosition);

                // ✅ CHECK IF TILE HAS A QUESTION
                const landedTile = tiles[finalPosition];

                if (landedTile && landedTile.question) {
                    console.log('📝 Tile has question:', landedTile.name);
                    setCurrentTileIndex(finalPosition);
                    setCurrentQuestion({
                        question: landedTile.question,
                        options: landedTile.options,
                        correctAnswer: landedTile.answer,
                        tileName: landedTile.name
                    });
                    setShowQuestion(true);
                } else {
                    console.log('⏭️ No question on this tile');

                    // ✅ AUTO-ADVANCE TO NEXT PLAYER IF NO QUESTION
                    setTimeout(() => {
                        nextTurn();
                    }, 500);
                }
            }, 500);
        }, 1000);
    }, [isRolling, currentPlayerIndex, players, gameStarted, nextTurn, animateTokenMovement, logRoll, winner]);

    const handleTileClick = (tileIndex) => {
        console.log('Clicked tile:', tileIndex, tiles[tileIndex]);
    };

    const handleUsePowerCard = () => {
        console.log('Use power card');
    };

    const handleReturnHome = () => {
        navigate('/');
    };

    const handleExitGame = () => {
        navigate('/games');
    };

    if (!gameStarted) {
        return (
            <SetupFlowGate
                showIntro={showIntro}
                showSetup={showSetup}
                showRoles={showRoles}
                setupNames={setupNames}
                selectedRoles={selectedRoles}
                onStartIntro={openSetupFromIntro}
                onCloseIntro={closeIntro}
                onCloseSetup={closeSetup}
                onChooseRoles={openRoleSelection}
                onStartGame={handleGameStart}
                onCloseRoles={closeRoleSelection}
                onConfirmRoles={confirmRoles}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <button
                className="fixed right-4 flex items-center gap-2 bottom-4 z-50 rounded-full text-xl border border-white/30 bg-black/50 px-5 py-2 text-white backdrop-blur transition hover:bg-black/70"
                onClick={handleExitGame}
            >       
                Exit<span className='text-xl text-red-500 font-bold'><RxExit /></span>
            </button>
            <div className="relative flex justify-around">
                <div className="relative">
                    <Board
                        tiles={tiles}
                        players={players}
                        onTileClick={handleTileClick}
                        animatingPlayer={animatingPlayer} />

                    {/* Fine-tune position if needed */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="pointer-events-auto">
                            <CenterPanel
                                currentPlayer={currentPlayer}
                                diceValues={diceValues}
                                isRolling={isRolling}
                                onRollDice={rollDice}
                                onUsePowerCard={handleUsePowerCard}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <PlayerInfoPanel
                        players={players}
                        currentPlayerIndex={currentPlayerIndex}
                        onEndTurn={nextTurn}
                        isRolling={isRolling}
                    />
                    <GameLog logs={gameLog} />
                </div>
            </div>
            <QuestionModal
                open={showQuestion && !winner}
                question={currentQuestion}
                currentPlayer={currentPlayer}
                onAnswer={handleQuestionAnswer}
                onClose={() => setShowQuestion(false)}
            />

            {winner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="w-full max-w-2xl rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-8 text-center shadow-2xl shadow-amber-950/40"
                    >
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/15 text-5xl">
                            🏆
                        </div>
                        <p className="mb-2 text-sm uppercase tracking-[0.35em] text-amber-300/80">
                            Victory Stage
                        </p>
                        <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
                            {winner.name} wins the game
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-200">
                            {winner.name} reached {winner.score} points and crossed the required {REQUIRED_POINTS_TO_WIN}-point threshold.
                        </p>
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Winner</p>
                                <p className="mt-2 text-2xl font-bold text-white">{winner.name}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Final Score</p>
                                <p className="mt-2 text-2xl font-bold text-amber-300">{winner.score} points</p>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <button
                                className="rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
                                onClick={handleReturnHome}
                            >
                                Return Home
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameBoard;