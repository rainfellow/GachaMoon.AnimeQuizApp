import React, { useEffect, useRef, useContext } from 'react';
import Phaser from 'phaser';
import GameScene from '../LifeGameScene/LifeGameScene';
import { MultiplayerGameContext } from '@/context/multiplayer-game-context';
import { useMultiplayerGame } from '@/hooks/use-multiplayer-game';

const LifeGameComponent: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<Phaser.Game | null>(null);
    const context = useContext(MultiplayerGameContext);
    const gameActions = useMultiplayerGame();

    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 800,
            parent: gameRef.current!,
            scene: GameScene
        };

        gameInstance.current = new Phaser.Game(config);

        // Wait for the scene to be ready
        const checkSceneReady = () => {
            if (gameInstance.current) {
                const scene = gameInstance.current.scene.getScene('GameScene') as GameScene;
                if (scene && scene.scene.isActive()) {
                    // Scene is ready, set context and actions
                    scene.context = context;
                    scene.gameActions = gameActions;
                    scene.updateFromContext();
                    
                    // Listen for create event on the specific scene
                    scene.events.once('create', () => {
                        scene.context = context;
                        scene.gameActions = gameActions;
                        scene.updateFromContext();
                    });
                } else {
                    // Scene not ready yet, check again
                    setTimeout(checkSceneReady, 100);
                }
            }
        };

        checkSceneReady();

        return () => {
            gameInstance.current?.destroy(true);
        };
    }, []);

    useEffect(() => {
        if (gameInstance.current) {
            const scene = gameInstance.current.scene.getScene('GameScene') as GameScene;
            if (scene) {
                scene.context = context;
                scene.gameActions = gameActions;
                scene.updateFromContext();
            }
        }
    }, [context, gameActions]);

    return <div ref={gameRef} />;
};

export default LifeGameComponent;