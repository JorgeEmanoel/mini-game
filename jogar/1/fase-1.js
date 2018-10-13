var game = new Phaser.Game(1300, 400, Phaser.AUTO, 'game', {

        preload: preload,
        create: create,
        update: update,

    }),

    jogador = {
        self: null,
        pontos: 0,
        vida: 100,
        skin: 0,
        atualizaAnimacoes: function () {

            jogador.self.animations.add('left', skins[jogador.skin].animations.left, 20, true);
            jogador.self.animations.add('right', skins[jogador.skin].animations.right, 20, true);

        },

        deletarAnimacoes: function () {

            jogador.self.animations.destroy();

        },

        atualizaVida: function (vida) {

            jogador.status.perdendoVida = true;

            jogador.vida -= vida;

            $('.info-vida').css({
                'width': jogador.vida + '%'
            }).find('span').text(jogador.vida);

            setTimeout(function () {
                jogador.status.perdendoVida = false;
            }, 1000);

            if (jogador.vida <= 70)
                $('.info-vida').css('background', '#8ac719');

            if (jogador.vida <= 50)
                $('.info-vida').css('background', '#c7b519');

            if (jogador.vida <= 30)
                $('.info-vida').css('background', '#c76719');

            if (jogador.vida <= 15)
                $('.info-vida').css('background', '#c72919');

            if (jogador.vida <= 0) {
                jogador.self.kill();

                setTimeout(function () {
                    alert('Sua vida acabou.\nDeve começar novamente.');
                }, 200);
            }

        },

        status: {
            naEscada: false,
            naAgua: false,
            naSelva: false,
            perdendoVida: false,
        }
    },

    skins = [

        {
            name: 'skins.default',
            animations: {
                frame: 6,
                left: [5, 4, 3, 2, 1, 0],
                right: [7, 8, 9, 10, 11, 12]
            },
            width: 66,
            height: 96,
        },

        {
            name: 'skins.robo',
            animations: {
                frame: 7,
                left: [6, 5, 4, 3, 2, 1, 0],
                right: [8, 9, 10, 11, 12, 13, 14],
            },
            width: 71,
            height: 96,
        },

        {
            name: 'skins.ninjaGirl',
            animations: {
                frame: 10,
                left: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
                right: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            },
            width: 65.5,
            height: 96,
        },

    ],

    plataformas = {
        group: null,
        each: [],
    },

    escadas = {
        group: null,
        each: [],
    },

    inimigos = {
        group: null,
        each: [],
    },

    barris = {
        group: null,
        each: [],
    },

    diamantes = {
        group: null,
        each: [],
    },

    audios = {
        coleta: null,
    },

    bg = [],

    portal,

    teclas = null;


function preload () {

    // BACKGROUNDS

    game.load.image('backgrounds.1', asset('background1.png'));
    game.load.image('backgrounds.2', asset('background2.png'));
    game.load.image('backgrounds.3', asset('background3.png'));
    game.load.image('backgrounds.4', asset('background4.png'));
    game.load.image('backgrounds.5', asset('background5.png'));

    // plataformas

    game.load.image('plataformas.1', asset('plataforma.png'));
    game.load.image('plataformas.2', asset('plataforma1.png'));
    game.load.image('plataformas.3', asset('plataforma2.png'));
    game.load.image('plataformas.4', asset('plataforma2.0.png'));
    game.load.image('plataformas.5', asset('plataforma2.1.png'));
    game.load.image('plataformas.6', asset('plataforma2.2.png'));
    game.load.image('escada', asset('ladder.png'));

    // SKINS

    game.load.spritesheet('skins.default', asset('player.png'), skins[0].width, skins[0].height);
    game.load.spritesheet('skins.robo', asset('robo.png'), skins[1].width, skins[1].height);
    game.load.spritesheet('skins.ninjaGirl', asset('ninjagirl.png'), skins[2].width, skins[2].height);

    // PORTAL

    game.load.image('portal', asset('door.png'));

    // INIMIGOS

    game.load.image('barril.danger', asset('barril1.png'));
    game.load.image('barril.warning', asset('barril2.png'));
    game.load.image('monstro', asset('inimigo.png'));

    // COINS

    game.load.image('diamante', asset('diamond.png'));

    // AUDIO

    game.load.audio('audio.coleta', audio('coleta.ogg'));


}

function create () {

    // FISICA

    game.physics.startSystem(Phaser.Physics.ARCADE);

    // AUDIOS

    audios.coleta = game.add.audio('audio.coleta', 1, true);

    // BACKGROUNDS

    bg[0] = game.add.sprite(0, -200, 'backgrounds.4');

    // PLATAFORMAS

    plataformas.group = game.add.group();
    plataformas.group.enableBody = true;

    escadas.group = game.add.group();
    escadas.group.enableBody = true;

    barris.group = game.add.group();
    barris.group.enableBody = true;

    inimigos.group = game.add.group();
    inimigos.group.enableBody = true;

    diamantes.group = game.add.group();
    diamantes.group.enableBody = true;

    game.physics.enable(plataformas.group);
    game.physics.enable(escadas.group);
    game.physics.enable(barris.group);
    game.physics.enable(inimigos.group);
    game.physics.enable(diamantes.group);

    plataformas.each[0] = plataformas.group.create(0, 395, 'plataformas.1');

    plataformas.each[1] = plataformas.group.create(150, 350, 'plataformas.2');
    plataformas.each[1].scale.x = .5;
    plataformas.each[1].scale.y = .5;

    plataformas.each[2] = plataformas.group.create(300, 270, 'plataformas.2');

    plataformas.each[3] = plataformas.group.create(500, 100, 'plataformas.1');
    plataformas.each[3].scale.x = .5;
    plataformas.each[3].scale.y = .7;

    plataformas.each[4] = plataformas.group.create(800, 130, 'plataformas.2');
    plataformas.each[4].scale.x = .05;
    plataformas.each[4].scale.y = .6;

    plataformas.each[5] = plataformas.group.create(-70, 150, 'plataformas.1');
    plataformas.each[5].scale.x = .3;
    plataformas.each[5].scale.y = .6;

    plataformas.each.forEach(function (plat) {

        plat.body.immovable = true;

    });

    // ESCADAS

    escadas.each[0] = escadas.group.create(1180, 100, 'escada');
    escadas.each[0].scale.x = .1;
    escadas.each[0].scale.y = .2;

    escadas.each.forEach(function (esc) {

        esc.body.immovable = true;

    });

    // BARRIS

    barris.each[0] = barris.group.create(245, 260, 'barril.danger');
    barris.each[0].scale.x = .3;
    barris.each[0].scale.y = .3;

    barris.each.forEach(function (bar) {

        bar.body.gravity.y = 300;

    });

    for (var c = 0; c < 5; c++) {

        var x = 300 + (c * 100),
            y = 120;

        diamantes.each[c] = diamantes.group.create(x, y, 'diamante');

    }

    for (var c = 6; c < 11; c++) {

        var x = 100 + (c * 100),
            y = 20;

        diamantes.each[c] = diamantes.group.create(x, y, 'diamante');

    }

    diamantes.each.forEach(function (dia) {

        dia.body.gravity.y = 100;
        dia.body.bounce.y = .7;

    });

    // PORTAL

    portal = game.add.sprite(0, 0, 'portal');
    portal.scale.x = .07;
    portal.scale.y = .07;

    // INIMIGOS

    inimigos.each[0] = inimigos.group.create(700, 300, 'monstro');
    inimigos.each[0].body.collideWorldBounds = true;
    inimigos.each[0].body.gravity.y = 300;
    inimigos.each[0].body.velocity.x = 200;

    setInterval(function () {

        if (inimigos.each[0].body.velocity.x > 0)
            inimigos.each[0].body.velocity.x = -200;
        else
            inimigos.each[0].body.velocity.x = 200;

    }, 2700);

    inimigos.each[1] = inimigos.group.create(900, 150, 'monstro');
    inimigos.each[1].body.collideWorldBounds = true;
    inimigos.each[1].body.velocity.x = 200;

    setInterval(function () {

        if (inimigos.each[1].body.velocity.x > 0)
            inimigos.each[1].body.velocity.x = -200;
        else
            inimigos.each[1].body.velocity.x = 200;

    }, 1700);

    // JOGADOR

    jogador.self = game.add.sprite(20, 300, skins[jogador.skin].name);

    game.physics.arcade.enable(jogador.self);

    jogador.self.enableBody = true;
    jogador.self.body.gravity.y = 350;
    jogador.self.body.collideWorldBounds = true;
    jogador.self.body.bounce.y = .1;
    jogador.self.scale.x = .8;
    jogador.self.scale.y = .8;

    jogador.atualizaAnimacoes();

    teclas = game.input.keyboard.createCursorKeys();

}

function update () {

    jogador.status.naEscada = false;

    // COLISOES
    game.physics.arcade.collide(jogador.self, plataformas.group);
    game.physics.arcade.collide(diamantes.group, plataformas.group);
    game.physics.arcade.collide(inimigos.group, plataformas.group);

    game.physics.arcade.collide(jogador.self, barris.group, function (j, b) {

        if (!jogador.status.perdendoVida) {

            $('.game-container').css({
                'border-color': '#f00',
            });

            $('body').css({
                'background-color': 'rgba(255, 0, 0, .3)',
            });

            setTimeout(function () {
                $('.game-container').css({
                    'border-color': '#fff',
                });

                $('body').css({
                    'background-color': '#fff',
                });
            }, 400);

            jogador.atualizaVida(10);

        }

    });

    game.physics.arcade.collide(jogador.self, inimigos.group, function (j, i) {

        if (!jogador.status.perdendoVida) {

            $('.game-container').css({
                'border-color': '#f00',
            });

            $('body').css({
                'background-color': 'rgba(255, 0, 0, .3)',
            });

            setTimeout(function () {
                $('.game-container').css({
                    'border-color': '#fff',
                });

                $('body').css({
                    'background-color': '#fff',
                });
            }, 400);

            jogador.atualizaVida(35);

        }

    });

    game.physics.arcade.collide(plataformas.group, barris.group);

    game.physics.arcade.overlap(jogador.self, escadas.group, function (j, e) {

        jogador.status.naEscada = true;

    });

    game.physics.arcade.overlap(jogador.self, diamantes.group, function (j, d) {

        d.kill();
        jogador.pontos += 10;

        $('.info-pontos span').text(jogador.pontos);

        audios.coleta.play('', 0, 1, false);

        if (jogador.pontos >= 100) {

            jogador.self.kill();
            alert('Jogo Ganho!!');

        }

    });

    // TECLAS
    if (teclas.up.isDown || teclas.down.isDown || teclas.left.isDown || teclas.right.isDown) {

        if (teclas.up.isDown && (jogador.self.body.touching.down || jogador.status.naEscada))
            jogador.self.body.velocity.y = -250;

        if (teclas.down.isDown && !jogador.self.body.touching.down)
            jogador.self.body.velocity.y = 300;

        if (teclas.left.isDown) {

            jogador.self.body.velocity.x = -200;
            jogador.self.animations.play('left');

        }

        if (teclas.right.isDown) {

            jogador.self.body.velocity.x = 200;
            jogador.self.animations.play('right');

        }

    } else {

        if (jogador.status.naEscada)
            jogador.self.body.velocity.y = 0;

        jogador.self.body.velocity.x = 0;
        jogador.self.animations.stop();
        jogador.self.frame = skins[jogador.skin].animations.frame;

    }

    // FIM TECLAS



}

// FUNÇÕES ÚTEIS

/**
  * Carregar assets de acordo com o diretorio
  * @param endereco
  * @return string endereco_relativo
  */
function asset (endereco) {

    return '../../images/assets/' + endereco;

}

/**
  * Carregar audios de acordo com o diretorio
  * @param endereco
  * @return string endereco_relativo
  */
function audio (endereco) {

    return '../../audios/' + endereco;

}

$('.btn-change-skin').click(function () {

    $('.btn-change-skin').removeClass('active');
    $(this).addClass('active');

    var skin = $(this).data('skin');
    jogador.skin = skin;

    jogador.self.loadTexture(skins[skin].name);

    jogador.atualizaAnimacoes();

});
