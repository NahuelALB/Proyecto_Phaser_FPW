import Phaser from "phaser";

class Escena extends Phaser.Scene{
    platforms = null;
    player = null;
    cursors = null;
    stars = null;
    score = 0;
    scoreText = null;
    bombs = null;

    preload ()
    {
        this.load.image('sky', 'img/fondo.png');
        this.load.image('ground', 'img/ground.png');
        this.load.image('star', 'img/star.png');
        this.load.image('bomb', 'img/bomb.png');
        this.load.spritesheet('dude','img/dude.png',{ frameWidth: 32, frameHeight: 48});
    }

    create ()
    {   
        //se crea el fondo
        this.add.image(500,300,'sky');

        //creando plataformas
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400,'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        //creando las estrellas
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 15,
            setXY: { x: 12, y: 0, stepX: 60 }
        });
        this.stars.children.iterate(function(child){
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.stars, this.platforms);

        //al personaje se le asigna el sprite
        this.player = this.physics.add.sprite(100, 300, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.scoreText = this.add.text(16, 16, 'Puntaje: 0', {fontSize: '32px', fill: '#FFF'});

        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player,this.bombs, this.hitBomb, null, this);
    }
    
    update()
    {
        //Condición para el movimiento y la reproduccion de las animaciones del Player
        if(this.cursors.left.isDown){
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if(this.cursors.right.isDown){
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        //Condición para que el Player salte si está colisionando con algo
        if(this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-330);
        }
    }

    collectStar(player, star){
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Puntaje: ' + this.score);

        if(this.stars.countActive(true) === 0){
            this.stars.children.iterate(function(child){
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    hitBomb(player, bomb){
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
    }

}
export default Escena;