import { useState, useCallback } from 'react';

export const getValidatedPlayers = (rawPlayers = []) => {
    return rawPlayers.map((player) => ({
        ...player,
        position: player.position ?? 0,
        score: player.score ?? 0,
        ownedTiles: player.ownedTiles ?? [],
        powerCards: player.powerCards ?? [],
        correctAnswers: player.correctAnswers ?? 0
    }));
};

const useGameSetupFlow = () => {
    const [showIntro, setShowIntro] = useState(true);
    const [showSetup, setShowSetup] = useState(false);
    const [showRoles, setShowRoles] = useState(false);
    const [setupNames, setSetupNames] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);

    const openSetupFromIntro = useCallback(() => {
        setShowIntro(false);
        setShowSetup(true);
    }, []);

    const closeIntro = useCallback(() => {
        setShowIntro(false);
    }, []);

    const closeSetup = useCallback(() => {
        setShowSetup(false);
    }, []);

    const openRoleSelection = useCallback(({ names = [] }) => {
        setSetupNames(names);
        setShowRoles(true);
    }, []);

    const closeRoleSelection = useCallback(() => {
        setShowRoles(false);
    }, []);

    const confirmRoles = useCallback((roles = []) => {
        setSelectedRoles(roles);
        setShowRoles(false);
    }, []);

    const completeGameStart = useCallback(({ soundEnabled: sound }) => {
        setSoundEnabled(sound);
        setShowSetup(false);
        setGameStarted(true);
    }, []);

    return {
        showIntro,
        showSetup,
        showRoles,
        setupNames,
        selectedRoles,
        soundEnabled,
        gameStarted,
        openSetupFromIntro,
        closeIntro,
        closeSetup,
        openRoleSelection,
        closeRoleSelection,
        confirmRoles,
        completeGameStart
    };
};

export default useGameSetupFlow;
