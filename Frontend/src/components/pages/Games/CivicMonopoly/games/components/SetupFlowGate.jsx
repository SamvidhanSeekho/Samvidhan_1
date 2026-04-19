import React from 'react';
import GameIntroModel from '../modals/gameIntroModel';
import PlayerSetupModal from '../modals/playerSetupModal';
import RoleSelectionModal from '../modals/roleSelectionModal';

const SetupFlowGate = ({
    showIntro,
    showSetup,
    showRoles,
    setupNames,
    selectedRoles,
    onStartIntro,
    onCloseIntro,
    onCloseSetup,
    onChooseRoles,
    onStartGame,
    onCloseRoles,
    onConfirmRoles
}) => {
    return (
        <>
            <GameIntroModel
                open={showIntro}
                onStart={onStartIntro}
                onClose={onCloseIntro}
            />

            <PlayerSetupModal
                open={showSetup}
                selectedRoles={selectedRoles}
                onClose={onCloseSetup}
                onChooseRoles={onChooseRoles}
                onStart={onStartGame}
            />

            <RoleSelectionModal
                open={showRoles}
                names={setupNames}
                preselected={selectedRoles}
                onClose={onCloseRoles}
                onConfirm={onConfirmRoles}
            />
        </>
    );
};

export default SetupFlowGate;
