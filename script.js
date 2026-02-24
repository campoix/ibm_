// =====================================================
// THINKER JOURNEY — script.js
// Phaser 3 | Arcade Physics
// =====================================================


// ─────────────────────────────────────────────────────
// PALETA GLOBAL
// ─────────────────────────────────────────────────────
const CORES = {
    fundoEscuro:    0x050d1a,
    fundoPanel:     0x0a1628,
    fundoBotao:     0x0d2340,
    fundoBotaoHov:  0x1a3a6e,
    borda:          0x0066cc,
    ciano:          0x00d4ff,
    cianoEscuro:    0x0099cc,
    branco:         0xffffff,
    brancoTexto:    '#E6F4FF',
    cianoTexto:     '#00d4ff',
    cinzaTexto:     '#7090a0',
};

const estiloTitulo = (tamanho = '42px') => ({
    fontFamily: 'Orbitron',
    fontSize: tamanho,
    fontStyle: 'bold',
    color: CORES.cianoTexto,
    stroke: '#003355',
    strokeThickness: 4,
});

const estiloBotao = (tamanho = '22px') => ({
    fontFamily: 'Orbitron',
    fontSize: tamanho,
    color: CORES.brancoTexto,
    padding: { x: 0, y: 0 },
});

const estiloCorpo = (tamanho = '20px') => ({
    fontFamily: 'Orbitron',
    fontSize: tamanho,
    color: CORES.brancoTexto,
    align: 'center',
    lineSpacing: 10,
});


// ─────────────────────────────────────────────────────
// MÚSICA COMPARTILHADA
// ─────────────────────────────────────────────────────
let musica;
let volumeGlobal = 0.5;


// =====================================================
// UTILITÁRIO: CRIADOR DE BOTÕES PREMIUM
// =====================================================
function criarBotao(scene, x, y, texto, callback, largura = 300, altura = 52) {

    const container = scene.add.container(x, y);
    const bg = scene.add.graphics();

    const desenharFundo = (cor, corBorda, alpha = 1) => {
        bg.clear();
        bg.fillStyle(cor, alpha);
        bg.fillRoundedRect(-largura / 2, -altura / 2, largura, altura, 10);
        bg.lineStyle(1.5, corBorda, 0.8);
        bg.strokeRoundedRect(-largura / 2, -altura / 2, largura, altura, 10);
    };

    desenharFundo(CORES.fundoBotao, CORES.borda);

    const label = scene.add.text(0, 0, texto, estiloBotao('20px')).setOrigin(0.5);
    const zona  = scene.add.zone(0, 0, largura, altura).setInteractive({ useHandCursor: true });

    container.add([bg, label, zona]);

    zona.on('pointerover', () => {
        desenharFundo(CORES.fundoBotaoHov, CORES.ciano);
        label.setColor(CORES.cianoTexto);
        scene.tweens.add({ targets: container, scaleX: 1.04, scaleY: 1.04, duration: 120, ease: 'Power1' });
    });

    zona.on('pointerout', () => {
        desenharFundo(CORES.fundoBotao, CORES.borda);
        label.setColor(CORES.brancoTexto);
        scene.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 120, ease: 'Power1' });
    });

    zona.on('pointerdown', () => {
        scene.tweens.add({ targets: container, scaleX: 0.96, scaleY: 0.96, duration: 80, ease: 'Power1' });
    });

    zona.on('pointerup', () => {
        scene.tweens.add({
            targets: container,
            scaleX: 1, scaleY: 1,
            duration: 80,
            ease: 'Power1',
            onComplete: callback,
        });
    });

    return container;
}


// ─────────────────────────────────────────────────────
// UTILITÁRIO: LINHA DECORATIVA
// ─────────────────────────────────────────────────────
function linhaDecorativa(scene, x, y, largura = 200) {
    const g = scene.add.graphics();
    g.lineStyle(1, CORES.ciano, 0.5);
    g.beginPath();
    g.moveTo(x - largura / 2, y);
    g.lineTo(x + largura / 2, y);
    g.strokePath();
    return g;
}


// ─────────────────────────────────────────────────────
// UTILITÁRIO: FUNDO DE CENA
// ─────────────────────────────────────────────────────
function criarFundoCena(scene) {

    const { width, height } = scene.scale;

    scene.add.rectangle(width / 2, height / 2, width, height, CORES.fundoEscuro);

    const grad = scene.add.graphics();
    grad.fillGradientStyle(CORES.fundoPanel, CORES.fundoPanel, CORES.fundoEscuro, CORES.fundoEscuro, 0.6);
    grad.fillRect(0, 0, width, height * 0.5);

    const scanlines = scene.add.graphics();
    scanlines.lineStyle(1, 0x002244, 0.15);
    for (let yy = 0; yy < height; yy += 20) {
        scanlines.beginPath();
        scanlines.moveTo(0, yy);
        scanlines.lineTo(width, yy);
        scanlines.strokePath();
    }
}


// =====================================================
// CENA: MENU PRINCIPAL
// =====================================================
class MenuScene extends Phaser.Scene {

    constructor() { super({ key: 'MenuScene' }); }

    preload() {
        this.load.image('bg',    'assets/cenario_desfocado_menu.png');
        this.load.image('logo',  'assets/logo_menu.png');
        this.load.audio('musica', 'assets/musica_fundo1.mp3');
    }

    create() {

        const { width, height } = this.scale;

        if (!musica) {
            musica = this.sound.add('musica', { loop: true, volume: volumeGlobal });
            musica.play();
        }

        const bg = this.add.image(width / 2, height / 2, 'bg');
        bg.setDisplaySize(width, height).setAlpha(0.45);

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);

        const sl = this.add.graphics();
        sl.lineStyle(1, 0x001133, 0.2);
        for (let yy = 0; yy < height; yy += 18) {
            sl.beginPath(); sl.moveTo(0, yy); sl.lineTo(width, yy); sl.strokePath();
        }

        const logo = this.add.image(width / 2, height * 0.22, 'logo');
        logo.setScale(0.6).setAlpha(0);

        this.tweens.add({ targets: logo, alpha: 1, y: height * 0.22, duration: 800, ease: 'Power2' });

        linhaDecorativa(this, width / 2, height * 0.38, 260);

        const botoes = [
            { label: 'JOGAR',         cena: () => this.scene.start('IntroScene')    },
            { label: 'CONFIGURAÇÕES', cena: () => this.scene.start('ConfigScene')   },
            { label: 'TUTORIAL',      cena: () => this.scene.start('TutorialScene') },
            { label: 'CRÉDITOS',      cena: () => this.scene.start('CreditsScene')  },
        ];

        botoes.forEach((item, i) => {
            const yPos = height * 0.48 + i * 70;
            const btn  = criarBotao(this, width / 2, yPos, item.label, item.cena, 280);
            btn.setAlpha(0);
            this.tweens.add({ targets: btn, alpha: 1, delay: 400 + i * 100, duration: 400, ease: 'Power2' });
        });
    }
}


// =====================================================
// CENA: CONFIGURAÇÕES
// =====================================================
class ConfigScene extends Phaser.Scene {

    constructor() { super({ key: 'ConfigScene' }); }

    create() {

        const { width, height } = this.scale;

        criarFundoCena(this);

        this.add.text(width / 2, height * 0.18, 'CONFIGURAÇÕES', estiloTitulo('36px')).setOrigin(0.5);
        linhaDecorativa(this, width / 2, height * 0.26, 240);

        this.add.text(width / 2, height * 0.36, 'VOLUME DA MÚSICA', estiloCorpo('18px')).setOrigin(0.5);

        const trilhaX = width / 2 - 150;
        const trilhaY = height * 0.46;
        const trilhaW = 300;

        const trilhaBg = this.add.graphics();
        trilhaBg.fillStyle(0x0a1e38, 1);
        trilhaBg.fillRoundedRect(trilhaX, trilhaY - 4, trilhaW, 8, 4);

        const trilhaFill = this.add.graphics();
        const desenhaTrilha = (v) => {
            trilhaFill.clear();
            trilhaFill.fillStyle(CORES.ciano, 1);
            trilhaFill.fillRoundedRect(trilhaX, trilhaY - 4, v * trilhaW, 8, 4);
        };
        desenhaTrilha(volumeGlobal);

        const thumbX = trilhaX + volumeGlobal * trilhaW;
        const thumb  = this.add.graphics();
        const desenhaTick = (x) => {
            thumb.clear();
            thumb.lineStyle(2, CORES.ciano, 1);
            thumb.strokeCircle(x, trilhaY, 12);
            thumb.fillStyle(CORES.ciano, 1);
            thumb.fillCircle(x, trilhaY, 6);
        };
        desenhaTick(thumbX);

        const zona = this.add.rectangle(thumbX, trilhaY, 28, 28).setInteractive({ draggable: true });
        this.input.setDraggable(zona);

        const labelVol = this.add.text(width / 2, height * 0.55,
            `${Math.round(volumeGlobal * 100)}%`,
            { fontFamily: 'Orbitron', fontSize: '16px', color: CORES.cianoTexto }
        ).setOrigin(0.5);

        zona.on('drag', (pointer, dragX) => {
            dragX = Phaser.Math.Clamp(dragX, trilhaX, trilhaX + trilhaW);
            zona.x = dragX;
            volumeGlobal = (dragX - trilhaX) / trilhaW;
            desenhaTrilha(volumeGlobal);
            desenhaTick(dragX);
            labelVol.setText(`${Math.round(volumeGlobal * 100)}%`);
            if (musica) musica.setVolume(volumeGlobal);
        });

        criarBotao(this, width / 2, height * 0.68, 'VER TUTORIAL', () => this.scene.start('TutorialScene'), 260);
        criarBotao(this, width / 2, height * 0.82, 'VOLTAR',       () => this.scene.start('MenuScene'),     200);
    }
}


// =====================================================
// CENA: TUTORIAL
// =====================================================
class TutorialScene extends Phaser.Scene {

    constructor() { super({ key: 'TutorialScene' }); }

    init(data) { this.fromPause = data.fromPause || false; }

    create() {

        const { width, height } = this.scale;

        criarFundoCena(this);

        this.add.text(width / 2, height * 0.14, 'TUTORIAL', estiloTitulo('38px')).setOrigin(0.5);
        linhaDecorativa(this, width / 2, height * 0.22, 180);

        const controles = [
            { tecla: 'W',   acao: 'Pular'          },
            { tecla: 'A',   acao: 'Mover esquerda' },
            { tecla: 'D',   acao: 'Mover direita'  },
            { tecla: 'S',   acao: 'Ação futura'    },
            { tecla: 'E',   acao: 'Interagir'      },
            { tecla: 'ESC', acao: 'Pausar jogo'    },
        ];

        const cardLargura = 320;
        const cardAltura  = 42;
        const cardX       = width / 2;
        let cardY         = height * 0.32;

        controles.forEach((item) => {

            const cardBg = this.add.graphics();
            cardBg.fillStyle(CORES.fundoPanel, 0.9);
            cardBg.fillRoundedRect(cardX - cardLargura / 2, cardY - cardAltura / 2, cardLargura, cardAltura, 8);
            cardBg.lineStyle(1, CORES.borda, 0.4);
            cardBg.strokeRoundedRect(cardX - cardLargura / 2, cardY - cardAltura / 2, cardLargura, cardAltura, 8);

            const badgeW = 56;
            cardBg.fillStyle(CORES.fundoBotao, 1);
            cardBg.fillRoundedRect(cardX - cardLargura / 2 + 12, cardY - 14, badgeW, 28, 6);
            cardBg.lineStyle(1, CORES.ciano, 0.7);
            cardBg.strokeRoundedRect(cardX - cardLargura / 2 + 12, cardY - 14, badgeW, 28, 6);

            this.add.text(cardX - cardLargura / 2 + 12 + badgeW / 2, cardY, item.tecla,
                { fontFamily: 'Orbitron', fontSize: '14px', fontStyle: 'bold', color: CORES.cianoTexto }
            ).setOrigin(0.5);

            this.add.text(cardX - cardLargura / 2 + badgeW + 28, cardY, item.acao,
                { fontFamily: 'Orbitron', fontSize: '15px', color: CORES.brancoTexto }
            ).setOrigin(0, 0.5);

            cardY += 58;
        });

        // Verifica flag no registry (caso venha do pause)
        const veioDoPause = this.fromPause || this.registry.get('fromPause');

        criarBotao(this, width / 2, height * 0.88, 'VOLTAR', () => {
            if (veioDoPause) {
                // Limpa a flag do registry
                this.registry.set('fromPause', false);
                // GameScene ainda esta pausada; relanca o PauseScene por cima
                this.scene.stop('TutorialScene');
                this.scene.launch('PauseScene');
            } else {
                this.scene.start('MenuScene');
            }
        }, 200);
    }
}


// =====================================================
// CENA: CUTSCENE DE INTRODUÇÃO
// =====================================================
class IntroScene extends Phaser.Scene {

    constructor() { super({ key: 'IntroScene' }); }

    preload() {
        this.load.video('intro', 'assets/cutscene_intro.mp4', 'loadeddata', false, true);
    }

    create() {
        const { width, height } = this.scale;
        if (musica && musica.isPlaying) musica.pause();
        const video = this.add.video(width / 2, height / 2, 'intro');
        video.setDisplaySize(width, height);
        video.play();
        video.on('complete', () => this.scene.start('GameScene'));
    }
}


// =====================================================
// CENA: JOGO PRINCIPAL
// =====================================================
class GameScene extends Phaser.Scene {

    constructor() { super({ key: 'GameScene' }); }

    preload() {
        this.load.image('cenario', 'assets/cenario_game1.jpeg');
        this.load.spritesheet('player', 'assets/Sprite-0001-Sheet2.png', {
            frameWidth:  1140,
            frameHeight: 1940,
        });
    }

    create() {

        const { width, height } = this.scale;

        if (musica && musica.isPaused) musica.resume();

        const worldWidth = 5000;
        this.physics.world.setBounds(0, 0, worldWidth, height);

        const cenario = this.add.image(0, height / 2, 'cenario').setOrigin(0, 0.5);
        cenario.setScale(height / cenario.height);

        this.player = this.physics.add.sprite(200, height - 200, 'player');
        this.player.setScale(0.3);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(1000);

        this.anims.create({
            key: 'walk',
            frames:    this.anims.generateFrameNumbers('player', { start: 1, end: 8 }),
            frameRate: 10,
            repeat:    -1,
        });

        this.anims.create({
            key:    'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 1,
        });

        const ground = this.add.rectangle(worldWidth / 2, height - 50, worldWidth, 100);
        this.physics.add.existing(ground, true);
        this.physics.add.collider(this.player, ground);

        this.cameras.main.setBounds(0, 0, worldWidth, height);
        this.cameras.main.startFollow(this.player);

        this.cursors  = this.input.keyboard.createCursorKeys();
        this.keys     = this.input.keyboard.addKeys('W,A,S,D');
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.pausando = false;
    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(this.pauseKey) && !this.pausando) {
            this.pausando = true;
            this.scene.pause();
            this.scene.launch('PauseScene');
            return;
        }

        const speed = 300;

        if (this.cursors.left.isDown || this.keys.A.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play('walk', true);
            this.player.setFlipX(true);

        } else if (this.cursors.right.isDown || this.keys.D.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play('walk', true);
            this.player.setFlipX(false);

        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle');
        }

        if ((this.cursors.up.isDown || this.keys.W.isDown) && this.player.body.touching.down) {
            this.player.setVelocityY(-550);
        }
    }
}


// =====================================================
// CENA: MENU DE PAUSA
// =====================================================
class PauseScene extends Phaser.Scene {

    constructor() { super({ key: 'PauseScene' }); }

    create() {

        const { width, height } = this.scale;

        const painelW = width  * 0.40;
        const painelH = height * 0.58;
        const painelX = width  / 2;
        const painelY = height / 2;

        this.add.rectangle(painelX, painelY, width, height, 0x000000, 0.72);
        this.add.rectangle(painelX, painelY, painelW, painelH, CORES.fundoPanel, 0.97);

        const borda = this.add.graphics();
        borda.lineStyle(1.5, CORES.ciano, 0.55);
        borda.strokeRoundedRect(painelX - painelW / 2, painelY - painelH / 2, painelW, painelH, 14);

        const fsTitulo = Math.round(painelW * 0.10) + 'px';
        this.add.text(painelX, painelY - painelH * 0.33, 'PAUSADO', estiloTitulo(fsTitulo)).setOrigin(0.5);

        linhaDecorativa(this, painelX, painelY - painelH * 0.22, painelW * 0.45);

        const btnW = painelW * 0.72;

        criarBotao(this, painelX, painelY - painelH * 0.08, 'CONTINUAR', () => {
            this.scene.stop();
            this.scene.resume('GameScene');
            const gameScene = this.scene.get('GameScene');
            if (gameScene) gameScene.pausando = false;
        }, btnW);

        criarBotao(this, painelX, painelY + painelH * 0.20, 'SAIR AO MENU', () => {
            this.scene.stop('PauseScene');
            this.scene.stop('GameScene');
            this.scene.start('MenuScene');
        }, btnW);
    }
}


// =====================================================
// CENA: CRÉDITOS  ← ATUALIZADA
// Layout em 4 cards 2×2, com partículas, ícones e
// fade-in escalonado por categoria.
// =====================================================
class CreditsScene extends Phaser.Scene {

    constructor() { super({ key: 'CreditsScene' }); }

    create() {

        const { width, height } = this.scale;

        criarFundoCena(this);

        // ── Partículas decorativas (pontos ciano flutuantes) ──────────
        const particleGraphics = this.add.graphics();
        const particulas = [];
        for (let i = 0; i < 30; i++) {
            particulas.push({
                x:     Phaser.Math.Between(0, width),
                y:     Phaser.Math.Between(0, height),
                r:     Phaser.Math.FloatBetween(0.7, 2.4),
                speed: Phaser.Math.FloatBetween(0.12, 0.50),
                alpha: Phaser.Math.FloatBetween(0.15, 0.65),
            });
        }

        this.events.on('update', () => {
            particleGraphics.clear();
            particulas.forEach(p => {
                p.y -= p.speed;
                if (p.y < -4) p.y = height + 4;
                particleGraphics.fillStyle(CORES.ciano, p.alpha);
                particleGraphics.fillCircle(p.x, p.y, p.r);
            });
        });

        // ── Título ────────────────────────────────────────────────────
        const titulo = this.add.text(width / 2, height * 0.10, 'CRÉDITOS', estiloTitulo('40px'))
            .setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets: titulo, alpha: 1, duration: 600, ease: 'Power2' });

        linhaDecorativa(this, width / 2, height * 0.175, 260);

        // ── Subtítulo ─────────────────────────────────────────────────
        const subtitulo = this.add.text(width / 2, height * 0.215,
            'EQUIPE IBM SKILLSBUILD',
            { fontFamily: 'Orbitron', fontSize: '13px', color: CORES.cinzaTexto, letterSpacing: 3 }
        ).setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets: subtitulo, alpha: 1, delay: 200, duration: 500 });

        // ── Dados das categorias ──────────────────────────────────────
        const categorias = [
            {
                icone: '◈',
                titulo: 'ARTE',
                nomes: 'Samuel  ·  João Pedro  ·  Willian\nCarol  ·  Isabela  ·  Pedro',
            },
            {
                icone: '♪',
                titulo: 'ÁUDIO',
                nomes: 'Carol',
            },
            {
                icone: '⚙',
                titulo: 'DESENVOLVIMENTO',
                nomes: 'Samuel  ·  William\nIsabela  ·  Enzo',
            },
            {
                icone: '</>',
                titulo: 'PROGRAMAÇÃO',
                nomes: 'Enzo  ·  João Pedro',
            },
        ];

        // ── Grade 2×2 responsiva ──────────────────────────────────────
        const cardW    = width  * 0.38;
        const cardH    = height * 0.185;
        const colLeft  = width  * 0.27;
        const colRight = width  * 0.73;
        const row1Y    = height * 0.41;
        const row2Y    = height * 0.635;

        const posicoes = [
            { x: colLeft,  y: row1Y },
            { x: colRight, y: row1Y },
            { x: colLeft,  y: row2Y },
            { x: colRight, y: row2Y },
        ];

        categorias.forEach((cat, i) => {

            const { x, y } = posicoes[i];

            // Container agrupa todos os elementos visuais do card
            const cont = this.add.container(x, y).setAlpha(0);

            // Fundo do card (redesenhável no hover)
            const bgCard = this.add.graphics();
            const desenhaCard = (corFill, corBorda, alphaFill) => {
                bgCard.clear();
                bgCard.fillStyle(corFill, alphaFill);
                bgCard.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 10);
                bgCard.lineStyle(1.2, corBorda, 0.55);
                bgCard.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 10);
            };
            desenhaCard(CORES.fundoPanel, CORES.borda, 0.92);

            // Acento ciano no topo
            const acento = this.add.graphics();
            acento.lineStyle(2, CORES.ciano, 0.75);
            acento.beginPath();
            acento.moveTo(-cardW * 0.38, -cardH / 2);
            acento.lineTo( cardW * 0.38, -cardH / 2);
            acento.strokePath();

            // Ícone da categoria
            const iconeText = this.add.text(0, -cardH * 0.29,
                cat.icone,
                { fontFamily: 'Orbitron', fontSize: '18px', color: CORES.cianoTexto }
            ).setOrigin(0.5);

            // Nome da categoria
            const catTitulo = this.add.text(0, -cardH * 0.04,
                cat.titulo,
                { fontFamily: 'Orbitron', fontSize: '12px', fontStyle: 'bold',
                  color: CORES.cianoTexto, letterSpacing: 2 }
            ).setOrigin(0.5);

            // Linha divisória sutil
            const divisor = this.add.graphics();
            divisor.lineStyle(1, CORES.ciano, 0.18);
            divisor.beginPath();
            divisor.moveTo(-cardW * 0.32, cardH * 0.10);
            divisor.lineTo( cardW * 0.32, cardH * 0.10);
            divisor.strokePath();

            // Nomes dos membros
            const nomesText = this.add.text(0, cardH * 0.31,
                cat.nomes,
                { fontFamily: 'Orbitron', fontSize: '11px', color: CORES.brancoTexto,
                  align: 'center', lineSpacing: 8 }
            ).setOrigin(0.5);

            cont.add([bgCard, acento, divisor, iconeText, catTitulo, nomesText]);

            // Fade-in escalonado
            this.tweens.add({ targets: cont, alpha: 1, delay: 300 + i * 130, duration: 420, ease: 'Power2' });

            // Hover: zona invisível sobre o card, recolore o fundo
            const zona = this.add.zone(x, y, cardW, cardH).setInteractive();
            zona.on('pointerover', () => {
                this.tweens.add({ targets: cont, scaleX: 1.025, scaleY: 1.025, duration: 150 });
                desenhaCard(CORES.fundoBotaoHov, CORES.ciano, 0.88);
            });
            zona.on('pointerout', () => {
                this.tweens.add({ targets: cont, scaleX: 1, scaleY: 1, duration: 150 });
                desenhaCard(CORES.fundoPanel, CORES.borda, 0.92);
            });
        });

        // ── Rodapé ────────────────────────────────────────────────────
        const rodape = this.add.text(width / 2, height * 0.875,
            '© 2025  —  IBM SkillsBuild  |  Thinker Journey',
            { fontFamily: 'Orbitron', fontSize: '11px', color: CORES.cinzaTexto }
        ).setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets: rodape, alpha: 0.65, delay: 900, duration: 600 });

        // ── Botão Voltar ──────────────────────────────────────────────
        criarBotao(this, width / 2, height * 0.935, 'VOLTAR', () => this.scene.start('MenuScene'), 200);
    }
}


// =====================================================
// CONFIGURAÇÃO DO JOGO PHASER
// =====================================================
const config = {

    type: Phaser.AUTO,

    width:  Math.round(window.innerWidth  * 0.92),
    height: Math.round(window.innerHeight * 0.90),

    parent: 'game-container',

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },

    scene: [
        MenuScene,
        ConfigScene,
        TutorialScene,
        IntroScene,
        GameScene,
        PauseScene,
        CreditsScene,
    ],
};

const game = new Phaser.Game(config);


// =====================================================
// RESPONSIVIDADE
// =====================================================
window.addEventListener('resize', () => {
    game.scale.resize(
        Math.round(window.innerWidth  * 0.92),
        Math.round(window.innerHeight * 0.90)
    );
});