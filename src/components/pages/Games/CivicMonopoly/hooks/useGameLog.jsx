import { useState, useCallback } from 'react';

const useGameLog = () => {
    const [gameLog, setGameLog] = useState([]);

    const appendLog = useCallback((message) => {
        setGameLog((prev) => [...prev, message]);
    }, []);

    const resetLog = useCallback((messages = []) => {
        setGameLog(messages);
    }, []);

    const logGameStart = useCallback((firstPlayerName) => {
        resetLog([`🎮 Game started! ${firstPlayerName}'s turn`]);
    }, [resetLog]);

    const logRoll = useCallback((playerName, die1, die2, total) => {
        appendLog(`${playerName} rolled ${die1} + ${die2} = ${total}`);
    }, [appendLog]);

    const logTurn = useCallback((playerName) => {
        appendLog(`--- ${playerName}'s turn ---`);
    }, [appendLog]);

    const logAnswer = useCallback((playerName, isCorrect, value = 0) => {
        if (isCorrect) {
            appendLog(`${playerName} answered Correctly! + ${value} points`);
            return;
        }

        if (value > 0) {
            appendLog(`${playerName} answered incorrectly! -${value} points`);
            return;
        }

        appendLog(`${playerName} answered incorrectly!`);
    }, [appendLog]);

    return {
        gameLog,
        appendLog,
        resetLog,
        logGameStart,
        logRoll,
        logTurn,
        logAnswer
    };
};

export default useGameLog;
