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
let volumeGlobal = 0.75;

// ─────────────────────────────────────────────────────
// FLAG GLOBAL: se o jogador já completou o diálogo
// ─────────────────────────────────────────────────────
let dialogoConcluido = false;


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
        this.load.image('logo',  'assets/ChatGPT Image 25 de fev. de 2026, 09_36_35 (1).png');
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
        logo.setScale(0.9).setAlpha(0);

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

        criarBotao(this, width / 2, height * 0.78, 'VOLTAR', () => this.scene.start('MenuScene'), 200);
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

        const veioDoPause = this.fromPause || this.registry.get('fromPause');

        criarBotao(this, width / 2, height * 0.88, 'VOLTAR', () => {
            if (veioDoPause) {
                this.registry.set('fromPause', false);
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
// CENA: JOGO PRINCIPAL (TÉRREO)
// =====================================================
class GameScene extends Phaser.Scene {
    constructor() { super({ key: 'GameScene' }); }

    preload() {
        this.load.image('cenario',  'assets/cenario_game1.jpeg');
        this.load.image('press',    'assets/ezinho.png');
        this.load.image('dialogo1', 'assets/dialogo1.jpeg');
        this.load.image('dialogo2', 'assets/dialogo2.jpeg');
        this.load.image('dialogo3', 'assets/dialogo3.jpeg');

        this.load.spritesheet('player', 'assets/Sprite-0001-Sheet2.png', {
            frameWidth: 1140,
            frameHeight: 1940,
        });
    }

    create() {
        const { width, height } = this.scale;

        if (musica && musica.isPaused) musica.resume();

        // ─── Mundo ───────────────────────────────────────────────────
        // O cenário tem 2560x640 px reais.
        const CENARIO_W = 2560;
        const CENARIO_H = 640;

        // Escala para caber na altura da tela
        const escala = height / CENARIO_H;
        const worldWidth = CENARIO_W * escala;

        // Salva escala para usar no update
        this.escala = escala;

        this.physics.world.setBounds(0, 0, worldWidth, height);

        const cenario = this.add.image(0, 0, 'cenario').setOrigin(0, 0);
        cenario.setScale(escala);

        // ─── Player ───────────────────────────────────────────────────
        // Frame do sprite: 1140x1940 px
        // Queremos que o player tenha ~15% da altura do cenário escalado
        const alturaDesejadaPlayer = height * 0.6;
        const playerScale = alturaDesejadaPlayer / 1940;

        this.player = this.physics.add.sprite(200, height - 10, 'player');
        this.player.setScale(playerScale);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(800);
        // Reduz o hitbox para ser mais preciso (30% da largura, 60% da altura)
        this.player.setSize(400, 1400);
        this.player.setOffset(370, 540);

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

        // ─── Chão ─────────────────────────────────────────────────────
        const ground = this.add.rectangle(worldWidth / 2, height - 20, worldWidth, 40);
        this.physics.add.existing(ground, true);
        this.physics.add.collider(this.player, ground);

        // ─── Câmera ───────────────────────────────────────────────────
        this.cameras.main.setBounds(0, 0, worldWidth, height);
        this.cameras.main.startFollow(this.player);

        // ─── Teclado ──────────────────────────────────────────────────
        this.cursors  = this.input.keyboard.createCursorKeys();
        this.keys     = this.input.keyboard.addKeys('W,A,S,D');
        this.keyE     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.pausando   = false;
        this.transitando = false;

        // ─── Zonas do cenário (em pixels do mundo escalado) ───────────
        // Recepção: pixels 1040–1260 do cenário original → multiplicar por escala
        // Elevador:  pixels 1570–1650 do cenário original → multiplicar por escala
        this.zonaRecepcao = {
            x1: 1040 * escala,
            x2: 1260 * escala,
        };
        this.zonaElevador = {
            x1: 1570 * escala,
            x2: 1750 * escala, // um pouco mais largo para facilitar o trigger
        };

        // ─── Indicador "[ E ]" fixo na câmera, acima do player ────────
        this.indicadorE = this.add.text(width / 2, height * 0.55, '[ E ] Interagir',
            { fontFamily: 'Orbitron', fontSize: '20px', color: CORES.cianoTexto,
              stroke: '#000000', strokeThickness: 5,
              backgroundColor: '#00000066', padding: { x: 10, y: 4 } }
        ).setOrigin(0.5).setScrollFactor(0).setAlpha(0).setDepth(15);

        // ─── Painel de diálogo ────────────────────────────────────────
        this.dialogoAtivo = false;
        this.dialogoEtapa = 0;

        // Imagem de diálogo fixada na câmera, ocupa a parte inferior
        const dialogoAltura = height * 0.35;
        this.imgDialogo = this.add.image(width / 2, height - dialogoAltura / 2, 'dialogo1')
            .setOrigin(0.5)
            .setDisplaySize(width, dialogoAltura)
            .setScrollFactor(0)
            .setDepth(20)
            .setVisible(false);

        // Hint: apertar E para avançar diálogo
        this.hintDialogo = this.add.text(width - 20, height - 12,
            '[ E ] Continuar',
            { fontFamily: 'Orbitron', fontSize: '14px', color: CORES.cianoTexto,
              stroke: '#000000', strokeThickness: 3 }
        ).setOrigin(1, 1).setScrollFactor(0).setDepth(25).setVisible(false);

        // ─── Hint de bloqueio (aparece quando tenta ir ao elevador sem dialogar) ─
        this.hintBloqueio = this.add.text(width / 2, height * 0.38,
            '⚠  Fale com a recepcionista primeiro!',
            { fontFamily: 'Orbitron', fontSize: '17px', color: '#ff5555',
              stroke: '#000000', strokeThickness: 4,
              backgroundColor: '#00000099', padding: { x: 16, y: 8 } }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(20).setAlpha(0);

        this.hintBloqueioAtivo = false;

        // ─── Barreira invisível: impede de passar da recepção antes do diálogo ─
        if (!dialogoConcluido) {
            this.barreira = this.add.rectangle(
                this.zonaRecepcao.x2 + 16, height / 2, 32, height * 2
            );
            this.physics.add.existing(this.barreira, true);
            this.colliderBarreira = this.physics.add.collider(this.player, this.barreira);
        }

        // ─── Indicador de elevador (texto fixo na câmera) ─────────────
        this.indicadorElevador = this.add.text(width / 2, height * 0.45,
            '[ E ] Usar Elevador',
            { fontFamily: 'Orbitron', fontSize: '20px', color: '#00ffcc',
              stroke: '#000000', strokeThickness: 5,
              backgroundColor: '#00000066', padding: { x: 10, y: 4 } }
        ).setOrigin(0.5).setScrollFactor(0).setAlpha(0).setDepth(15);
    }

    // ─── Inicia diálogo ────────────────────────────────────────────────
    iniciarDialogo() {
        this.dialogoAtivo = true;
        this.dialogoEtapa = 1;
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        this.player.anims.play('idle');
        this.indicadorE.setAlpha(0);
        this.mostrarEtapaDialogo();
    }

    mostrarEtapaDialogo() {
        const { width, height } = this.scale;
        const dialogoAltura = height * 0.35;
        const textura = ['dialogo1', 'dialogo2', 'dialogo3'][this.dialogoEtapa - 1];

        this.imgDialogo
            .setTexture(textura)
            .setDisplaySize(width, dialogoAltura)
            .setPosition(width / 2, height - dialogoAltura / 2)
            .setVisible(true);

        this.hintDialogo.setVisible(true);
    }

    avancarDialogo() {
        if (this.dialogoEtapa < 3) {
            this.dialogoEtapa++;
            this.mostrarEtapaDialogo();
        } else {
            // Fim do diálogo
            this.dialogoAtivo = false;
            this.dialogoEtapa = 0;
            this.imgDialogo.setVisible(false);
            this.hintDialogo.setVisible(false);

            // Marca globalmente e remove barreira
            if (!dialogoConcluido) {
                dialogoConcluido = true;
                if (this.colliderBarreira) {
                    this.colliderBarreira.destroy();
                    this.colliderBarreira = null;
                }
                if (this.barreira && this.barreira.active) {
                    this.barreira.destroy();
                    this.barreira = null;
                }
            }
        }
    }

    // ─── Transição para o segundo andar ───────────────────────────────
    entrarElevador() {
        if (this.transitando) return;
        this.transitando = true;
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        this.player.anims.play('idle');
        this.indicadorElevador.setAlpha(0);

        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.time.delayedCall(2000, () => {
                this.scene.start('SegundoAndarScene');
            });
        });
    }

    update() {
        if (this.transitando) return;

        // Pausa
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey) && !this.pausando && !this.dialogoAtivo) {
            this.pausando = true;
            this.scene.pause();
            this.scene.launch('PauseScene');
            return;
        }

        // Se dialogo ativo, trava player e so processa E
        if (this.dialogoAtivo) {
            this.player.setVelocityX(0);
            this.player.anims.play('idle');
            if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
                this.avancarDialogo();
            }
            return;
        }

        // Movimento
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

        const px = this.player.x;

        // Zona da recepcao
        const naRecepcao = px >= this.zonaRecepcao.x1 && px <= this.zonaRecepcao.x2;

        if (naRecepcao) {
            this.indicadorE.setAlpha(1);
            this.indicadorElevador.setAlpha(0);
            if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
                this.iniciarDialogo();
            }
        } else {
            this.indicadorE.setAlpha(0);
        }

        // Zona do elevador
        const noElevador = px >= this.zonaElevador.x1 && px <= this.zonaElevador.x2;

        if (noElevador) {
            if (!dialogoConcluido) {
                if (!this.hintBloqueioAtivo) {
                    this.hintBloqueioAtivo = true;
                    this.tweens.add({
                        targets: this.hintBloqueio,
                        alpha: 1,
                        duration: 300,
                        hold: 2000,
                        yoyo: true,
                        onComplete: () => {
                            this.hintBloqueio.setAlpha(0);
                            this.hintBloqueioAtivo = false;
                        }
                    });
                }
            } else {
                this.indicadorElevador.setAlpha(1);
                this.indicadorE.setAlpha(0);
                if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
                    this.entrarElevador();
                }
            }
        } else {
            this.indicadorElevador.setAlpha(0);
        }
    }
}


// =====================================================
// CENA: SEGUNDO ANDAR
// =====================================================
class SegundoAndarScene extends Phaser.Scene {
    constructor() { super({ key: 'SegundoAndarScene' }); }

    preload() {
        this.load.image('cenario2', 'assets/segundo_andar_fundo_cenario.jpeg');
        this.load.image('press',    'assets/ezinho.png');

        this.load.spritesheet('player', 'assets/Sprite-0001-Sheet2.png', {
            frameWidth: 1140,
            frameHeight: 1940,
        });
    }

    create() {
        const { width, height } = this.scale;

        if (musica && musica.isPaused) musica.resume();

        const CENARIO_W = 2560;
        const CENARIO_H = 640;
        const escala = height / CENARIO_H;
        const worldWidth = CENARIO_W * escala;

        this.physics.world.setBounds(0, 0, worldWidth, height);

        const cenario = this.add.image(0, 0, 'cenario2').setOrigin(0, 0);
        cenario.setScale(escala);

        // Player aparece do lado esquerdo (saindo do elevador)
        const alturaDesejadaPlayer = height * 0.6;
        const playerScale = alturaDesejadaPlayer / 1940;
        this.player = this.physics.add.sprite(150, height - 10, 'player');
        this.player.setScale(playerScale);
        this.player.setSize(400, 1400);
        this.player.setOffset(370, 540);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(1000);

        // Animações (recria pois pode não existir nesta cena)
        if (!this.anims.exists('walk2')) {
            this.anims.create({
                key: 'walk2',
                frames:    this.anims.generateFrameNumbers('player', { start: 1, end: 8 }),
                frameRate: 10,
                repeat:    -1,
            });
        }
        if (!this.anims.exists('idle2')) {
            this.anims.create({
                key:    'idle2',
                frames: [{ key: 'player', frame: 0 }],
                frameRate: 1,
            });
        }

        const ground = this.add.rectangle(worldWidth / 2, height - 20, worldWidth, 40);
        this.physics.add.existing(ground, true);
        this.physics.add.collider(this.player, ground);

        this.cameras.main.setBounds(0, 0, worldWidth, height);
        this.cameras.main.startFollow(this.player);

        // Fade in ao entrar
        this.cameras.main.fadeIn(600, 0, 0, 0);

        this.cursors  = this.input.keyboard.createCursorKeys();
        this.keys     = this.input.keyboard.addKeys('W,A,S,D');
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.pausando = false;
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey) && !this.pausando) {
            this.pausando = true;
            this.scene.pause();
            this.scene.launch('PauseScene2');
            return;
        }

        const speed = 300;

        if (this.cursors.left.isDown || this.keys.A.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play('walk2', true);
            this.player.setFlipX(true);

        } else if (this.cursors.right.isDown || this.keys.D.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play('walk2', true);
            this.player.setFlipX(false);

        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle2');
        }

        if ((this.cursors.up.isDown || this.keys.W.isDown) && this.player.body.touching.down) {
            this.player.setVelocityY(-550);
        }
    }
}


// =====================================================
// CENA: MENU DE PAUSA (TÉRREO)
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
// CENA: MENU DE PAUSA (SEGUNDO ANDAR)
// =====================================================
class PauseScene2 extends Phaser.Scene {

    constructor() { super({ key: 'PauseScene2' }); }

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
            this.scene.resume('SegundoAndarScene');
            const cena = this.scene.get('SegundoAndarScene');
            if (cena) cena.pausando = false;
        }, btnW);

        criarBotao(this, painelX, painelY + painelH * 0.20, 'SAIR AO MENU', () => {
            this.scene.stop('PauseScene2');
            this.scene.stop('SegundoAndarScene');
            this.scene.start('MenuScene');
        }, btnW);
    }
}


// =====================================================
// CENA: CRÉDITOS
// =====================================================
class CreditsScene extends Phaser.Scene {

    constructor() { super({ key: 'CreditsScene' }); }

    create() {

        const { width, height } = this.scale;

        criarFundoCena(this);

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

        const titulo = this.add.text(width / 2, height * 0.10, 'CRÉDITOS', estiloTitulo('40px'))
            .setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets: titulo, alpha: 1, duration: 600, ease: 'Power2' });

        linhaDecorativa(this, width / 2, height * 0.175, 260);

        const subtitulo = this.add.text(width / 2, height * 0.215,
            'EQUIPE IBM SKILLSBUILD',
            { fontFamily: 'Orbitron', fontSize: '13px', color: CORES.cinzaTexto, letterSpacing: 3 }
        ).setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets: subtitulo, alpha: 1, delay: 200, duration: 500 });

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
            const cont = this.add.container(x, y).setAlpha(0);

            const bgCard = this.add.graphics();
            const desenhaCard = (corFill, corBorda, alphaFill) => {
                bgCard.clear();
                bgCard.fillStyle(corFill, alphaFill);
                bgCard.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 10);
                bgCard.lineStyle(1.2, corBorda, 0.55);
                bgCard.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 10);
            };
            desenhaCard(CORES.fundoPanel, CORES.borda, 0.92);

            const acento = this.add.graphics();
            acento.lineStyle(2, CORES.ciano, 0.75);
            acento.beginPath();
            acento.moveTo(-cardW * 0.38, -cardH / 2);
            acento.lineTo( cardW * 0.38, -cardH / 2);
            acento.strokePath();

            const iconeText = this.add.text(0, -cardH * 0.29,
                cat.icone,
                { fontFamily: 'Orbitron', fontSize: '18px', color: CORES.cianoTexto }
            ).setOrigin(0.5);

            const catTitulo = this.add.text(0, -cardH * 0.04,
                cat.titulo,
                { fontFamily: 'Orbitron', fontSize: '12px', fontStyle: 'bold',
                  color: CORES.cianoTexto, letterSpacing: 2 }
            ).setOrigin(0.5);

            const divisor = this.add.graphics();
            divisor.lineStyle(1, CORES.ciano, 0.18);
            divisor.beginPath();
            divisor.moveTo(-cardW * 0.32, cardH * 0.10);
            divisor.lineTo( cardW * 0.32, cardH * 0.10);
            divisor.strokePath();

            const nomesText = this.add.text(0, cardH * 0.31,
                cat.nomes,
                { fontFamily: 'Orbitron', fontSize: '11px', color: CORES.brancoTexto,
                  align: 'center', lineSpacing: 8 }
            ).setOrigin(0.5);

            cont.add([bgCard, acento, divisor, iconeText, catTitulo, nomesText]);

            this.tweens.add({ targets: cont, alpha: 1, delay: 300 + i * 130, duration: 420, ease: 'Power2' });

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

        const rodape = this.add.text(width / 2, height * 0.875,
            '© 2025  —  IBM SkillsBuild  |  Thinker Journey',
            { fontFamily: 'Orbitron', fontSize: '11px', color: CORES.cinzaTexto }
        ).setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets: rodape, alpha: 0.65, delay: 900, duration: 600 });

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
        SegundoAndarScene,
        PauseScene,
        PauseScene2,
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
