import Phaser from 'phaser'

var platforms

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
        this.add.image(400, 300, 'star')

        // displaying platforms
        platforms = this.physics.add.staticGroup()
        platforms.create(600, 400, 'ground')
        platforms.create(50, 250, 'ground')
        platforms.create(750, 220, 'ground')

        // displaying ground
        platforms.create(400, 568, 'ground').setScale(2).refreshBody()
    }
}
