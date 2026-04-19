import { useMemo, useReducer, useCallback } from 'react';

const initialState = {
    players: [],
    currentPlayerIndex: 0
};

export const turnEngineReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_PLAYERS': {
            return {
                players: action.payload,
                currentPlayerIndex: 0
            };
        }
        case 'ADVANCE_TURN': {
            if (state.players.length === 0) return state;
            return {
                ...state,
                currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length
            };
        }
        case 'MOVE_PLAYER_TO_POSITION': {
            const { playerIndex, position } = action.payload;
            const nextPlayers = [...state.players];
            if (!nextPlayers[playerIndex]) return state;

            nextPlayers[playerIndex] = {
                ...nextPlayers[playerIndex],
                position
            };

            return {
                ...state,
                players: nextPlayers
            };
        }
        case 'APPLY_CORRECT_ANSWER': {
            const { playerIndex, points } = action.payload;
            const nextPlayers = [...state.players];
            if (!nextPlayers[playerIndex]) return state;

            const current = nextPlayers[playerIndex];
            nextPlayers[playerIndex] = {
                ...current,
                score: (current.score || 0) + points,
                correctAnswers: (current.correctAnswers || 0) + 1
            };

            return {
                ...state,
                players: nextPlayers
            };
        }
        case 'APPLY_WRONG_ANSWER': {
            const { playerIndex, penalty } = action.payload;
            const nextPlayers = [...state.players];
            if (!nextPlayers[playerIndex]) return state;

            const current = nextPlayers[playerIndex];
            nextPlayers[playerIndex] = {
                ...current,
                score: Math.max(0, (current.score || 0) - penalty)
            };

            return {
                ...state,
                players: nextPlayers
            };
        }
        default:
            return state;
    }
};

const useTurnEngine = () => {
    const [state, dispatch] = useReducer(turnEngineReducer, initialState);

    const initPlayers = useCallback((players) => {
        dispatch({ type: 'INIT_PLAYERS', payload: players });
    }, []);

    const advanceTurn = useCallback(() => {
        dispatch({ type: 'ADVANCE_TURN' });
    }, []);

    const movePlayerToPosition = useCallback((playerIndex, position) => {
        dispatch({
            type: 'MOVE_PLAYER_TO_POSITION',
            payload: { playerIndex, position }
        });
    }, []);

    const applyCorrectAnswer = useCallback((playerIndex, points) => {
        dispatch({
            type: 'APPLY_CORRECT_ANSWER',
            payload: { playerIndex, points }
        });
    }, []);

    const applyWrongAnswer = useCallback((playerIndex, penalty) => {
        dispatch({
            type: 'APPLY_WRONG_ANSWER',
            payload: { playerIndex, penalty }
        });
    }, []);

    const currentPlayer = useMemo(() => {
        return state.players[state.currentPlayerIndex];
    }, [state.players, state.currentPlayerIndex]);

    return {
        players: state.players,
        currentPlayerIndex: state.currentPlayerIndex,
        currentPlayer,
        initPlayers,
        advanceTurn,
        movePlayerToPosition,
        applyCorrectAnswer,
        applyWrongAnswer
    };
};

export default useTurnEngine;
