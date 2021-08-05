import Phaser from 'phaser'

var platforms
var player
var cursors
var stars
var score = 0
var scoreText
var bombs
var gameOver = false

export default class CollectingStarsScene extends Phaser.Scene {
    constructor() {
        super('collecting-stars-scene')
    }

    preload() {
        this.load.image('ground', 'images/platform.png')
        this.load.image('sky', 'images/sky.png')
        this.load.image('star', 'images/star.png')
        this.load.image('bomb', 'images/bomb.png')
        this.load.spritesheet('dude', 'images/dude.png', {
            frameWidth: 32,
            frameHeight: 48,
        })
    }

    create() {
        // displaying star and sky
        this.add.image(400, 300, 'sky')

        // displaying platforms
        platforms = this.physics.add.staticGroup()
        platforms.create(600, 400, 'ground')
        platforms.create(50, 250, 'ground')
        platforms.create(750, 220, 'ground')

        // displaying ground
        platforms.create(400, 568, 'ground').setScale(2).refreshBody()

        // creating player
        player = this.physics.add.sprite(100, 450, 'dude')
        player.setCollideWorldBounds(true)
        player.setBounce(0.2)

        // Set animation for player walking to the left
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        })

        // Set animation for player facing forward
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20,
        })

        // Set animation for player walking to the right
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        })

        // Set player and platforms to collide
        this.physics.add.collider(player, platforms)

        // Create keyboard control
        cursors = this.input.keyboard.createCursorKeys()

        // Create falling stars
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        })

        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        })

        // Set stars and playforms to collide
        this.physics.add.collider(stars, platforms)

        // Make player overlapping stars
        this.physics.add.overlap(player, stars, this.collectStar, null, this)

        // Show textScoring inside game
        scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: 'yellow',
        })

        // Set bombs and their characteristics
        bombs = this.physics.add.group()
        this.physics.add.collider(bombs, platforms)
        this.physics.add.collider(player, bombs, this.hitBomb, null, this)
    }

    // New method for collecting stars
    collectStar(player, star) {
        // Creating random x position for bombs to appear
        var x =
            player.x < 400
                ? Phaser.Math.Between(400, 800)
                : Phaser.Math.Between(0, 400)
        var bomb = bombs.create(x, 0, 'bomb')
        bomb.setBounce(1)
        bomb.setCollideWorldBounds(true)
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)

        star.disableBody(true, true)

        // Scoring
        score += 10
        scoreText.setText('score: ' + score)

        if (stars.countActive(true) === 0) {
            stars.children.iterate(function (child) {
                var x =
                    player.x < 400
                        ? Phaser.Math.Between(400, 800)
                        : Phaser.Math.Between(0, 400)
                child.enableBody(true, x, 0, true, true)
            })
        }
    }

    hitBomb(player) {
        this.physics.pause()
        player.setTint(0xff0000)
        player.anims.play('turn')
        gameOver = true

        // Make use of game over variable
        if (gameOver) {
            this.add.text(320, 240, 'GAME OVER', {
                fontSize: '32px',
                fill: 'red',
            })
        }
    }

    update() {
        // Define keyboard control
        if (cursors.left.isDown) {
            player.setVelocityX(-160)
            player.anims.play('left', true)
        } else if (cursors.right.isDown) {
            player.setVelocityX(160)
            player.anims.play('right', true)
        } else {
            player.setVelocityX(0)
            player.anims.play('turn')
        }

        if (cursors.up.isDown) {
            player.setVelocityY(-250)
        }
    }
}
