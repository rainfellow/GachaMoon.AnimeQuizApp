import Phaser from 'phaser';
import { IMultiplayerGameContext } from '../../context/multiplayer-game-context';
import { MoveOption, Player, Tile, LifeGameState, EventCard, EventOption } from '../../models/LifeGame'
import { IMultiplayerGame } from '@/hooks/use-multiplayer-game';

export default class GameScene extends Phaser.Scene {
    private isPartComplete: boolean = false;
    private canMove: boolean = true;
    private isHandlingEvent: boolean = false;
    private tileSprites: Phaser.GameObjects.Sprite[] = [];
    private moveButton!: Phaser.GameObjects.Text;
    private cardButtons: Phaser.GameObjects.Text[] = [];
    private rollButton!: Phaser.GameObjects.Text;
    private eventButtons: Phaser.GameObjects.Text[] = [];
    private eventOptionButtons: Phaser.GameObjects.Text[] = [];
    private confirmButton!: Phaser.GameObjects.Text;
    private selectedOption?: number;
    private biomeTextures: Map<string, string> = new Map();

    public context: IMultiplayerGameContext | null = null;
    public gameActions: IMultiplayerGame | null = null;

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('tile_default', 'assets/tile_default.png');
        this.load.image('biome_forest', 'assets/biome_forest.png');
        this.load.image('biome_desert', 'assets/biome_desert.png');
        this.biomeTextures.set('forest', 'biome_forest');
        this.biomeTextures.set('desert', 'biome_desert');
    }

    create() {
        this.createUI();
        this.setupInputHandlers();
    }

    private createUI() {
        this.moveButton = this.add.text(50, 550, 'Move Forward', {
            fontSize: '24px',
            color: '#fff'
        }).setInteractive();

        for (let i = 0; i < 6; i++) {
            const cardButton = this.add.text(50 + i * 100, 600, `Card ${i+1}`, {
                fontSize: '20px',
                color: '#fff'
            }).setInteractive().setVisible(false);
            this.cardButtons.push(cardButton);
        }

        this.rollButton = this.add.text(650, 550, 'Roll', {
            fontSize: '24px',
            color: '#fff'
        }).setInteractive().setVisible(false);

        for (let i = 0; i < 3; i++) {
            const eventButton = this.add.text(50 + i * 250, 650, `Event ${i+1}`, {
                fontSize: '20px',
                color: '#fff'
            }).setInteractive().setVisible(false);
            this.eventButtons.push(eventButton);
        }

        for (let i = 0; i < 4; i++) {
            const optionButton = this.add.text(50 + i * 200, 700, `Option ${i+1}`, {
                fontSize: '20px',
                color: '#fff'
            }).setInteractive().setVisible(false);
            this.eventOptionButtons.push(optionButton);
        }

        this.confirmButton = this.add.text(400, 750, 'Confirm', {
            fontSize: '24px',
            color: '#fff'
        }).setInteractive().setVisible(false);
    }

    private setupInputHandlers() {
        this.moveButton.on('pointerdown', () => {
            this.handleMoveAttempt({ type: 'basic', distance: 1 });
        });

        this.cardButtons.forEach((button, index) => {
            button.on('pointerdown', () => {
                this.handleMoveAttempt({ type: 'card', distance: index + 1 });
            });
        });

        this.rollButton.on('pointerdown', () => {
            this.handleMoveAttempt({ type: 'roll' });
        });

        this.eventButtons.forEach((button, index) => {
            button.on('pointerdown', () => {
                if (this.isHandlingEvent || !this.context) return;
                const currentTileEvents = this.context.lifeGameState.currentTileEvents;
                if (currentTileEvents[index] && this.gameActions) {
                    this.isHandlingEvent = true;
                    this.gameActions.sendEventSelection(currentTileEvents[index]);
                }
            });
        });

        this.eventOptionButtons.forEach((button, index) => {
            button.on('pointerdown', () => {
                if (!this.context?.lifeGameState.eventState.isConfirming) return;
                this.selectedOption = index;
                this.eventOptionButtons.forEach(btn => btn.setStyle({ fill: '#fff' }));
                button.setStyle({ fill: '#ff0' });
            });
        });

        this.confirmButton.on('pointerdown', () => {
            if (
                !this.context?.lifeGameState.eventState.isConfirming ||
                this.selectedOption === undefined ||
                !this.gameActions
            ) return;
            this.gameActions.sendEventOptionSelection(
                this.context.lifeGameState.eventState.eventOptions[this.selectedOption].id
            );
            this.eventOptionButtons.forEach(btn => btn.setVisible(false));
            this.confirmButton.setVisible(false);
        });
    }

    private handleMoveAttempt(moveOption: MoveOption) {
        if (
            !this.canMove ||
            this.isPartComplete ||
            this.isHandlingEvent ||
            !this.context ||
            !this.gameActions
        ) return;
        this.gameActions.sendMoveAttempt(
            this.context.lifeGameState.players[this.context.lifeGameState.currentPlayer].position,
            moveOption
        );
        this.canMove = false;
    }

    public updateFromContext() {
        if (!this.context) return;

        this.setupPartDisplay(
            this.context.lifeGameState.players[this.context.lifeGameState.currentPlayer].currentPart
        );

        this.context.lifeGameState.players.forEach((player, index) => {
            this.updatePlayerPosition(index.toString(), player.position);
        });

        if (this.context.lifeGameState.eventState.isSelectingEvent && this.context.lifeGameState.eventState.currentEvent) {
            this.showEventOptions(this.context.lifeGameState.currentTileEvents);
        }

        if (this.context.lifeGameState.eventState.isConfirming && this.context.lifeGameState.eventState.eventOptions) {
            this.showEventOptionChoices(this.context.lifeGameState.eventState.eventOptions);
            this.isHandlingEvent = true;
        } else if (
            !this.context.lifeGameState.eventState.isSelectingEvent &&
            !this.context.lifeGameState.eventState.isConfirming
        ) {
            this.isHandlingEvent = false;
            this.canMove = true;
            this.eventOptionButtons.forEach(btn => btn.setVisible(false));
            this.confirmButton.setVisible(false);
        }

        if (this.context.lifeGameState.isGameComplete) {
            this.handleGameComplete();
        }
    }

    private setupPartDisplay(partNumber: number) {
        this.tileSprites.forEach(sprite => sprite.destroy());
        this.tileSprites = [];

        if (!this.context) return;
        const startY = partNumber === 2 ? 100 : 300;

        this.context.lifeGameState.currentPartTiles.forEach((tile, index) => {
            const texture = tile.biomeTag ? this.getBiomeTexture(tile.biomeTag) : 'tile_default';
            const sprite = this.add.sprite(50 + index * 70, startY, texture)
                .setScale(0.5);
            this.tileSprites.push(sprite);
        });

        this.moveButton.setVisible(partNumber !== 2);
        this.cardButtons.forEach(button => button.setVisible(partNumber === 2));
        this.rollButton.setVisible(partNumber === 2);
    }

    private getBiomeTexture(biomeTag: string): string {
        return this.biomeTextures.get(biomeTag) || 'tile_default';
    }

    private updatePlayerPosition(playerId: string, newTile: number) {
        // Update visual representation (implement based on your needs)
        // Example: Update player marker position
    }

    private checkPartCompletion(newTile: number) {
        if (!this.context || !this.gameActions) return;
        if (newTile === this.context.lifeGameState.currentPartTiles.length - 1) {
            this.isPartComplete = true;
            const currentPart = this.context.lifeGameState.players[this.context.lifeGameState.currentPlayer].currentPart;
        }
    }

    private showEventOptions(events: EventCard[]) {
        this.eventButtons.forEach((button, index) => {
            if (index < events.length) {
                button.setText(events[index].name || `Event ${index + 1}`);
                button.setVisible(true);
            } else {
                button.setVisible(false);
            }
        });
    }

    private showEventOptionChoices(options: EventOption[]) {
        this.eventOptionButtons.forEach((button, index) => {
            if (index < options.length) {
                button.setText(options[index].name || `Option ${index + 1}`);
                button.setVisible(true);
            } else {
                button.setVisible(false);
            }
        });
        this.confirmButton.setVisible(true);
        this.selectedOption = undefined;
    }

    private showWarning(message: string) {
        const warning = this.add.text(400, 300, message, {
            fontSize: '24px',
            color: '#ff0000'
        }).setOrigin(0.5);
        this.time.delayedCall(2000, () => warning.destroy());
    }

    private handleGameComplete() {
        this.add.text(400, 300, 'Game completed, processing results', {
            fontSize: '32px',
            color: '#fff'
        }).setOrigin(0.5);
        this.scene.pause();
    }
}