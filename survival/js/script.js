const COLORS = {
    // Primary palette
    PRIMARY: 0x6633cc,      // Main theme color - purple
    SECONDARY: 0x4466ff,    // Secondary color - blue
    DANGER: 0xff3333,       // Danger color - red

    // Background colors
    BG_START: 0x000033,     // Start scene background
    BG_GAME: 0x000044,      // Game scene background
    BG_LOSE: 0x330000,      // Lose scene background

    // Player theme
    PLAYER_GLOW: 0x9966cc,  // Outer glow
    PLAYER_MAIN: 0x6633cc,  // Main body
    PLAYER_CORE: 0xd4a3ff,  // Inner core

    // Enemy theme
    ENEMY: 0x730303,        // Enemy color
    ENEMY_GLOW: 0xa30505,   // Enemy outer glow
    ENEMY_MAIN: 0x730303,   // Enemy main body
    ENEMY_CORE: 0xff5252,   // Enemy inner core

    // UI elements
    TEXT: 0xffffff,         // Default text color
    TEXT_HIGHLIGHT: 0xff3333, // Highlighted text
    BUTTON_BG: 0x4a4a4a,    // Button background
    BUTTON_HOVER: 0x666666, // Button hover state
    BUTTON_DANGER: 0x880000, // Danger button
    BUTTON_DANGER_HOVER: 0xaa0000, // Danger button hover

    // Particles
    PARTICLE_START: 0xffffff, // Start scene particles
    PARTICLE_GAME: 0x4466ff,  // Game scene particles
    PARTICLE_LOSE: 0xff3333,  // Lose scene particles

    // Opacities
    OPACITY: {
        BG: 0.7,           // Background
        PARTICLE: 0.6,     // Particles
        GLOW: 0.4          // Glow effects
    }
};

let roundedTime;
let ballCount = 15;

class startScene extends Phaser.Scene {
    constructor() {
        super('startScene');
    }
    preload() {

    }
    create() {
        // Dark overlay background
        this.add.rectangle(0, 0, config.width, config.height, COLORS.BG_START, COLORS.OPACITY.BG)
            .setOrigin(0, 0);

        // Create background pattern
        const pattern = this.add.graphics();
        for (let i = 0; i < 20; i++) {
            pattern.lineStyle(2, COLORS.TEXT, 0.2);
            pattern.strokeCircle(config.width / 2, config.height / 2, 50 + i * 20);
        }

        // Floating particles - MOVED BEFORE the text elements
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, config.width);
            const y = Phaser.Math.Between(0, config.height);
            const size = Phaser.Math.Between(5, 15);
            const shape = this.add[Phaser.Math.Between(0, 1) === 0 ? 'circle' : 'rectangle'](
                x, y, size, COLORS.PARTICLE_START, COLORS.OPACITY.PARTICLE
            );

            this.tweens.add({
                targets: shape,
                y: y - 100,
                alpha: 0,
                duration: Phaser.Math.Between(3000, 6000),
                loop: -1
            });
        }

        // Game title container for animation
        const gameTitleContainer = this.add.container(config.width / 2, config.height / 2 - 150);

        // Game title text
        const gameTitleText = this.add.text(0, 0, 'EVADE', {
            fontFamily: 'Arial Black',
            fontSize: '78px',
            color: '#ff0000',
            stroke: '#000',
            strokeThickness: 8,
            shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 5, stroke: true, fill: true }
        }).setOrigin(0.5);

        // Decorative underline
        const underline = this.add.graphics();
        underline.lineStyle(4, COLORS.TEXT, 1);
        underline.beginPath();
        underline.moveTo(-150, 50);
        underline.lineTo(150, 50);
        underline.strokePath();

        gameTitleContainer.add([gameTitleText, underline]);

        // Difficulty selection text
        const difficultyText = this.add.text(config.width / 2, config.height / 2 - 40, 'SELECT DIFFICULTY:', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Create difficulty buttons
        // Easy button
        const easyButton = this.createDifficultyButton(
            config.width / 2 - 150,
            config.height / 2 + 20,
            'EASY',
            0x4CAF50,
            0x66BB6A,
            15
        );

        // Medium button
        const mediumButton = this.createDifficultyButton(
            config.width / 2,
            config.height / 2 + 20,
            'MEDIUM',
            0xFFC107,
            0xFFD54F,
            35
        );

        // Hard button
        const hardButton = this.createDifficultyButton(
            config.width / 2 + 150,
            config.height / 2 + 20,
            'HARD',
            0xF44336,
            0xEF5350,
            70
        );
        const harderButton = this.createDifficultyButton(
            config.width / 2 + 2,
            config.height / 2 + 90,
            'HARDER',
            0xF44336,
            0xEF5350,
            100
        );

        // Animations
        this.tweens.add({
            targets: gameTitleContainer,
            scaleX: { from: 0, to: 1 },
            scaleY: { from: 0, to: 1 },
            duration: 800,
            ease: 'Back.out'
        });

        this.tweens.add({
            targets: difficultyText,
            alpha: { from: 0, to: 1 },
            y: { from: config.height / 2 - 60, to: config.height / 2 - 40 },
            duration: 800,
            delay: 800,
            ease: 'Power2'
        });

        // Animate buttons with slight delay between each
        this.tweens.add({
            targets: [easyButton, mediumButton, hardButton],
            alpha: { from: 0, to: 1 },
            y: { from: config.height / 2 + 40, to: config.height / 2 + 20 },
            duration: 800,
            delay: function(i) { return 1000 + i * 200; },
            ease: 'Back.out'
        });
    }

    createDifficultyButton(x, y, text, bgColor, hoverColor, difficulty) {
        // Convert hex colors to hex strings for text objects
        const bgColorStr = '#' + bgColor.toString(16).padStart(6, '0');
        const hoverColorStr = '#' + hoverColor.toString(16).padStart(6, '0');

        const button = this.add.text(x, y, text, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: bgColorStr,
            padding: { x: 20, y: 10 },
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true });

        // Button interactions
        button.on('pointerover', () => {
            button.setStyle({ backgroundColor: hoverColorStr });
            button.setScale(1.1);
        });

        button.on('pointerout', () => {
            button.setStyle({ backgroundColor: bgColorStr });
            button.setScale(1);
        });

        button.on('pointerdown', () => {
            ballCount = difficulty;
            this.scene.start('gameScene');
        });

        // return button;
    }

    update() {
        this.input.setDefaultCursor('default');
    }
}

class gameScene extends Phaser.Scene {
    constructor() {
        super('gameScene');
    }

    preload() {

    }
    create(){
        this.add.rectangle(0, 0, config.width, config.height, COLORS.BG_GAME, COLORS.OPACITY.BG).setOrigin(0, 0).setDepth(-1000);

        // Circles
        const pattern = this.add.graphics();
        for (let i = 0; i < 8; i++) {
            pattern.lineStyle(1, COLORS.SECONDARY, 0.5);
            // pattern.strokeCircle(config.width / 2, config.height / 2, 100 + i * 50); // Might toggle later
        }

        // Particles
        for (let i = 0; i < 55; i++) {
            const x = Phaser.Math.Between(0, config.width);
            const y = Phaser.Math.Between(0, config.height);
            const size = Phaser.Math.Between(3, 8);
            const particle = this.add.circle(x, y, size, COLORS.PARTICLE_GAME, COLORS.OPACITY.PARTICLE);

            this.tweens.add({
                targets: particle,
                y: y - 80,
                alpha: 0,
                duration: Phaser.Math.Between(4000, 8000),
                loop: -1
            });
        }

        this.playerContainer = this.add.container(config.width/2, config.height/2);

        const glow = this.add.circle(0, 0, 18, COLORS.PLAYER_GLOW, COLORS.OPACITY.GLOW);
        this.player = this.add.circle(0, 0, 12, COLORS.PLAYER_MAIN);
        const innerCore = this.add.circle(0, 0, 6, COLORS.PLAYER_CORE);

        this.playerContainer.add([glow, this.player, innerCore]);

        this.playerContainer.setInteractive(new Phaser.Geom.Circle(0, 0, 24), Phaser.Geom.Circle.Contains);

        this.playerContainer.on('pointerover', () => {
            this.input.setDefaultCursor('none');
            console.log('over player');
        });

        this.playerContainer.on('pointerout', () => {
            this.input.setDefaultCursor('default');
            console.log('out player');
        });

        this.physics.add.existing(this.playerContainer);
        this.playerContainer.body.setCircle(14);

        // this.tweens.add({
        //     targets: glow,
        //     alpha: { start: 0.9, end: 1 },
        //     scale: { start: 1, end: 1.2 },
        //     duration: 800,
        //     repeat: -1
        // });

        this.enemies = this.physics.add.group();

        for (let i = 0; i <= ballCount; i++) {
            const x = Phaser.Math.Between(20, config.width - 20);
            const y = Phaser.Math.Between(20, config.height - 20);

            // Create a container for the ball layers
            const enemyContainer = this.add.container(x, y);

            // Create the ball layers as squares
            const ballGlow = this.add.rectangle(0, 0, 40, 40, COLORS.ENEMY_GLOW, COLORS.OPACITY.GLOW);
            const ballMain = this.add.rectangle(0, 0, 30, 30, COLORS.ENEMY_MAIN);
            const ballCore = this.add.rectangle(0, 0, 16, 16, COLORS.ENEMY_CORE);

            // Add all layers to the container
            enemyContainer.add([ballGlow, ballMain, ballCore]);

            // Add physics to the container
            this.physics.add.existing(enemyContainer);

            // Keep the circular physics body for smooth collision
            enemyContainer.body.setCircle(15);

            // Add to group
            this.enemies.add(enemyContainer);
        }

        this.enemies.getChildren().forEach((ball) => {
            const angle = Phaser.Math.Between(0, 360);
            this.physics.velocityFromAngle(angle, 175, ball.body.velocity);
            ball.body.setCollideWorldBounds(true);
            ball.body.setBounce(1);
        }, this);

        this.immune = true;
        this.immunityTimer = this.time.delayedCall(3000, () => {
            this.immune = false;
            this.player.fillColor = COLORS.PLAYER_MAIN;
            this.physics.add.collider(this.enemies, this.playerContainer, this.hitBall, null, this);
        }, null, this);

        this.timerText = this.add.text(config.width-100, 15, `0s`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            padding: { x: 10, y: 5 },
            shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 4, stroke: true, fill: true }
        });
        this.timePassed = 0;

        this.immunityTimerText = this.add.text(config.width-75, 65, `3s`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#32a852',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            padding: { x: 10, y: 5 }, 
            shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 4, stroke: true, fill: true }
        });
        this.immunityTimerText.setOrigin(0.5, 0.5);
        this.immunityTimerText.setDepth(1);
        this.immunityTimerText.setAlpha(0.5);

        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update(){
        this.timePassed += this.game.loop.delta / 1000;
        roundedTime = Math.floor(this.timePassed * 2) / 2;

        this.immunityTimerDisplay = Math.max(0, Math.ceil(3 - this.timePassed));
        this.immunityTimerDisplay = Math.floor(this.immunityTimerDisplay * 2) / 2;

        this.handleText();
        this.handleMovement();
        this.forceScene();
    }
    handleText() {
        this.timerText.setText(`${roundedTime}s`)
        this.immunityTimerText.setText(`${this.immunityTimerDisplay}s`);
        if (this.immunityTimerText.text === '0s') {
            this.immunityTimerText.setAlpha(1);
            this.immunityTimerText.setStyle({ color: '#ff0000' });
        }

    }
    handleMovement() {
        this.playerContainer.body.setVelocity(0);
        this.input.on('pointermove', (pointer) => {
            this.playerContainer.x = pointer.x;
            this.playerContainer.y = pointer.y;
        }, null, this);
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.scene.launch('pauseScene');
            this.scene.pause('gameScene');
            console.log('pause');
        }
    }
    forceScene() {
        if (this.shiftKey.isDown && this.pKey.isDown) {
           this.scene.start('loseScene');
        }
        if (this.shiftKey.isDown && this.qKey.isDown) {
            this.scene.start('startScene')
        }
    }
    hitBall() {
        if (!this.immune) {
            this.scene.start('loseScene');
        }
    }
}
class pauseScene extends Phaser.Scene {
    constructor() {
        super('pauseScene');
    }
    preload() {

    }
    create() {
        this.add.rectangle(0, 0, config.width, config.height, COLORS.BG_GAME, COLORS.OPACITY.BG)
            .setOrigin(0, 0);
        const pauseText = this.add.text(config.width / 2, config.height / 2 - 150, 'PAUSED', {
            fontFamily: 'Arial Black',
            fontSize: '72px',
            color: '#ff0000',
            stroke: '#000',
            strokeThickness: 8,
            shadow: { offsetX: 3, offsetY: 3, color: '#500', blur: 8, stroke: true, fill: true }
        }).setOrigin(0.5);
        const resumeButton = this.add.text(config.width / 2, config.height / 2 - 50, 'RESUME', {
            fontFamily: 'Arial Black',
            fontSize: '36px',
            color: '#ffffff',
            backgroundColor: COLORS.BUTTON_BG,
            padding: { x: 25, y: 12 },
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true });
        resumeButton.on('pointerover', () => {
            resumeButton.setStyle({ backgroundColor: COLORS.BUTTON_HOVER });
            resumeButton.setScale(1.1);
        });
        resumeButton.on('pointerout', () => {
            resumeButton.setStyle({ backgroundColor: COLORS.BUTTON_BG });
            resumeButton.setScale(1);
        });
        resumeButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('gameScene');
        });
        const mainMenuButton = this.add.text(config.width / 2, config.height / 2 + 30, 'MAIN MENU', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: COLORS.BUTTON_BG,
            padding: { x: 20, y: 10 },
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true });
        mainMenuButton.on('pointerover', () => {
            mainMenuButton.setStyle({ backgroundColor: COLORS.BUTTON_HOVER });
            mainMenuButton.setScale(1.1);
    })
        mainMenuButton.on('pointerout', () => {
            mainMenuButton.setStyle({ backgroundColor: COLORS.BUTTON_BG });
            mainMenuButton.setScale(1);
        });
        mainMenuButton.on('pointerdown', () => {
            this.scene.start('startScene');
        });

        // Animate the main menu button with a delay after the play again button
        this.tweens.add({
            targets: mainMenuButton,
            alpha: { from: 0, to: 1 },
            y: { from: config.height / 2 + 230, to: config.height / 2 + 180 },
            duration: 800,
            delay: 1800,
            ease: 'Back.out'
        });
    }
    update() {
        this.input.setDefaultCursor('default');
    }
}
class loseScene extends Phaser.Scene {
    constructor() {
        super('loseScene');
    }
    preload() {

    }
    create() {
        // Dark overlay background with red tint
        this.add.rectangle(0, 0, config.width, config.height, COLORS.BG_LOSE, COLORS.OPACITY.BG)
            .setOrigin(0, 0);

        // Create angular background pattern
        const pattern = this.add.graphics();
        for (let i = 0; i < 15; i++) {
            pattern.lineStyle(2, COLORS.DANGER, 0.2);

            // Create hexagonal pattern
            const sides = 6;
            const size = 50 + i * 25;
            const centerX = config.width / 2;
            const centerY = config.height / 2;

            pattern.beginPath();
            for (let j = 0; j <= sides; j++) {
                const angle = Phaser.Math.PI2 * j / sides - Phaser.Math.PI2 / 4;
                const x = centerX + size * Math.cos(angle);
                const y = centerY + size * Math.sin(angle);

                if (j === 0) {
                    pattern.moveTo(x, y);
                } else {
                    pattern.lineTo(x, y);
                }
            }
            pattern.strokePath();
        }

        // Floating particles with different behavior
        for (let i = 0; i < 40; i++) {
            const x = Phaser.Math.Between(0, config.width);
            const y = Phaser.Math.Between(0, config.height);
            const size = Phaser.Math.Between(3, 10);

            // Use triangles and squares for a harsher look
            const shapeType = Phaser.Math.Between(0, 2);
            let shape;

            if (shapeType === 0) {
                // Square
                shape = this.add.rectangle(x, y, size, size, COLORS.DANGER, 0.4);
            } else if (shapeType === 1) {
                // Circle with red tint
                shape = this.add.circle(x, y, size/2, COLORS.DANGER, 0.4);
            } else {
                // Triangle
                const triangle = this.add.graphics();
                triangle.fillStyle(COLORS.DANGER, 0.4);
                triangle.beginPath();
                triangle.moveTo(x, y - size);
                triangle.lineTo(x + size, y + size);
                triangle.lineTo(x - size, y + size);
                triangle.closePath();
                triangle.fillPath();
                shape = triangle;
            }

            // More erratic movement
            this.tweens.add({
                targets: shape,
                x: x + Phaser.Math.Between(-100, 100),
                y: y - Phaser.Math.Between(50, 150),
                alpha: 0,
                angle: Phaser.Math.Between(0, 360),
                duration: Phaser.Math.Between(2000, 4000),
                loop: -1
            });
        }

        // Add "explosion" effect at center
        const explosion = this.add.graphics();
        explosion.fillStyle(COLORS.DANGER, 0.5);
        explosion.fillCircle(config.width/2, config.height/2, 5);

        this.tweens.add({
            targets: explosion,
            scale: 20,
            alpha: 0,
            duration: 1200,
            ease: 'Power2'
        });

        // Game over container for animation
        const gameOverContainer = this.add.container(config.width / 2, config.height / 2 - 100);

        // Game over text with more aggressive styling
        const gameOverText = this.add.text(0, 0, 'GAME OVER', {
            fontFamily: 'Impact, Arial Black',
            fontSize: '72px',
            color: '#ff0000',
            stroke: '#000',
            strokeThickness: 8,
            shadow: { offsetX: 3, offsetY: 3, color: '#500', blur: 8, stroke: true, fill: true }
        }).setOrigin(0.5);

        // Decorative elements - lightning-like underline
        const underline = this.add.graphics();
        underline.lineStyle(5, COLORS.DANGER, 1);
        underline.beginPath();
        underline.moveTo(-160, 50);
        underline.lineTo(-120, 60);
        underline.lineTo(-40, 45);
        underline.lineTo(30, 65);
        underline.lineTo(90, 50);
        underline.lineTo(160, 55);
        underline.strokePath();

        gameOverContainer.add([gameOverText, underline]);

        // Score text with pulsing effect
        const scoreText = this.add.text(config.width / 2, config.height / 2, `You survived: ${roundedTime}s`, {
            fontFamily: 'Courier New, Arial',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#500000',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.tweens.add({
            targets: scoreText,
            scale: { from: 1, to: 1.05 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Play again button with different styling
        const playAgainButton = this.add.text(config.width / 2, config.height / 2 + 100, 'TRY AGAIN', {
            fontFamily: 'Arial Black',
            fontSize: '36px',
            color: '#ffffff',
            backgroundColor: COLORS.BUTTON_DANGER,
            padding: { x: 25, y: 12 },
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true });

        // Main Menu button below the Try Again button
        const mainMenuButton = this.add.text(config.width / 2, config.height / 2 + 180, 'MAIN MENU', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: COLORS.BUTTON_BG,
            padding: { x: 20, y: 10 },
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true });

        // Main Menu button interactions
        mainMenuButton.on('pointerover', () => {
            mainMenuButton.setStyle({ backgroundColor: COLORS.BUTTON_HOVER });
            mainMenuButton.setScale(1.1);
        });
        mainMenuButton.on('pointerout', () => {
            mainMenuButton.setStyle({ backgroundColor: COLORS.BUTTON_BG });
            mainMenuButton.setScale(1);
        });
        mainMenuButton.on('pointerdown', () => {
            this.scene.start('startScene');
        });

        // Animate the main menu button with a delay after the play again button
        this.tweens.add({
            targets: mainMenuButton,
            alpha: { from: 0, to: 1 },
            y: { from: config.height / 2 + 230, to: config.height / 2 + 180 },
            duration: 800,
            delay: 1800,
            ease: 'Back.out'
        });

        // Button interactions
        playAgainButton.on('pointerover', () => {
            playAgainButton.setStyle({ backgroundColor: COLORS.BUTTON_DANGER_HOVER });
            playAgainButton.setScale(1.1);
        });
        playAgainButton.on('pointerout', () => {
            playAgainButton.setStyle({ backgroundColor: COLORS.BUTTON_DANGER });
            playAgainButton.setScale(1);
        });
        playAgainButton.on('pointerdown', () => {
            this.scene.start('gameScene');
        });

        // More dramatic animations
        this.tweens.add({
            targets: gameOverContainer,
            scaleX: { from: 1.5, to: 1 },
            scaleY: { from: 1.5, to: 1 },
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Elastic.out'
        });

        this.tweens.add({
            targets: scoreText,
            alpha: { from: 0, to: 1 },
            y: { from: config.height / 2 + 30, to: config.height / 2 },
            duration: 800,
            delay: 1000,
            ease: 'Power2'
        });

        this.tweens.add({
            targets: playAgainButton,
            alpha: { from: 0, to: 1 },
            y: { from: config.height / 2 + 150, to: config.height / 2 + 100 },
            duration: 800,
            delay: 1500,
            ease: 'Back.out'
        });

        // Add shaking effect
        this.cameras.main.shake(500, 0.01);
    }
    update() {
        this.input.setDefaultCursor('default');
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    fps: 60,
    scene: [
        startScene, gameScene, pauseScene, loseScene
    ],
    backgroundColor: COLORS.BG_GAME
};
const game = new Phaser.Game(config);

window.addEventListener('resize', function() {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

