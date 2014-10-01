'use strict';

(function(exports, undefined) {
  var logger = new Logger();

  function _welcomeSplashAnim(offsetX, offsetY, height, speed) {
    logger.info('Welcome splash animation start.');
    var that = this;
    var graphics = this.graphics['splash'];
    this.splash = new Sprite({
      image: graphics.image,
      offsetX: offsetX,
      offsetY: height,
      width: graphics.width,
      height: graphics.height,
      scale: this.screen.scale
    });

    this.splash.update = function() {
      if (this.offsetY > offsetY) this.offsetY -= speed * that.screen.scale;
    }
    this.screen.add(this.splash);
  }

  function _welcomePlayerAnim(offsetX, offsetY, height, speed) {
    logger.info('Welcome player animation start.');
    var that = this;
    var graphics = this.graphics['player1'];
    var playerOffsetX = offsetX + 70;
    var playerOffsetY = offsetY + 170;
    this.playerWidth = graphics.width / 8;
    this.playerHeight = graphics.height / 4;

    this.player = new Sprite({
      image: graphics.image,
      x: 0,
      y: 1,
      scale: this.screen.scale,
      width: this.playerWidth,
      height: this.playerHeight,
      offsetX: playerOffsetX,
      offsetY: height + 170
    });

    this.player.update = function() {
      this.x = this.x ? 0 : 1;

      if (that.get('status') === 'select') {
        this.offsetY = playerOffsetY + (that.playerNum === 2 ? 30 : 0);
        return;
      }

      if (this.offsetY > playerOffsetY) {
        this.offsetY -= speed * that.screen.scale;
      }
    }

    this.screen.add(this.player);
  }

  function _welcomeBindEvent(offsetY) {
    var that = this;
    Util.bind('keydown', function(e) {
      var status = that.get('status');

      if (status === 'start') return;

      if (status === 'welcome') {
        that.splash.offsetY = offsetY;
        that.player.offsetY = offsetY + 170;
        that.set('status', 'select');
        return;
      }

      if (e.keyCode === Keyboard.DOWN.keyCode) {
        that.playerNum = 2;
      } else if (e.keyCode === Keyboard.UP.keyCode) {
        that.playerNum = 1;
      } else if (e.keyCode === Keyboard.ENTER.keyCode) {
        that.start();
      }
    });
  }

  function _welcome() {
    logger.info('Welcome to tank.');

    this.set('status', 'welcome');
    this.screen.clean();

    var offsetX = (DEFAULTWIDTH - this.graphics['splash'].width) / 2;
    var offsetY = 120;
    var moveHeight = 500;
    var speed = 4;

    _welcomeSplashAnim.call(this, offsetX, offsetY, moveHeight, speed);
    _welcomePlayerAnim.call(this, offsetX, offsetY, moveHeight, speed);
    _welcomeBindEvent.call(this, offsetY);
  }

  function _initPlayer() {
    var that = this;
    this.player1 = new Player({
      image: this.graphics['player1'].image,
      scale: this.screen.scale,
      width: this.playerWidth,
      height: this.playerHeight,
      offsetX: this.screen.offsetX / this.screen.scale + 2,
      offsetY: this.screen.offsetY / this.screen.scale + 2,
      x: 0,
      y: 0,
      map: this.mapLayerBottom,
      position: {
        x: 8,
        y: 24
      },
      speed: 1,
      level: 0,
      cellWidth: this.cellWidth,
      screen: this.screen,
      graphics: this.graphics,
      sounds: this.sounds
    });

    this.player1.update = function() {
      this.run();
    }

    this.screen.add(this.player1);

    Keyboard.S.down(function() {
      that.player1.forward('down');
    });
     Keyboard.W.down(function() {
      that.player1.forward('up');
     });
     Keyboard.A.down(function() {
      that.player1.forward('left');
     });
     Keyboard.D.down(function() {
      that.player1.forward('right');
     });
     Keyboard.SPACE.press(function() {
      that.player1.shot();
     });

    if (this.playerNum === 2) {
      this.player2 = new Player({
        image: this.graphics['player2'].image,
        scale: this.screen.scale,
        width: this.playerWidth,
        height: this.playerHeight,
        offsetX: this.screen.offsetX / this.screen.scale + 2,
        offsetY: this.screen.offsetY / this.screen.scale + 2,
        x: 0,
        y: 0,
        map: this.mapLayerBottom,
        position: {
          x: 16,
          y: 24
        },
        level: 0,
        speed: 2,
        cellWidth: this.cellWidth,
        screen: this.screen,
        graphics: this.graphics,
        sounds: this.sounds
      });

      this.player2.update = function() {
        this.run();
      }

      this.screen.add(this.player2);

      Keyboard.DOWN.down(function() {
        that.player2.forward('down');
      });
      Keyboard.UP.down(function() {
        that.player2.forward('up');
      });
      Keyboard.LEFT.down(function() {
        that.player2.forward('left');
      });
      Keyboard.RIGHT.down(function() {
        that.player2.forward('right');
      });
      Keyboard.SPACE.press(function() {
        that.player2.shot();
      });
    }
  }

  function _initEnemy() {
  }

  function _initBoard() {
    this.screen.add(new Board({
      scale: this.screen.scale,
      graphics: this.graphics,
      screen: this.screen,
      playerNum: this.playerNum,
      enemyNum: this.enemy,
      offsetX: this.screen.offsetX + this.cellWidth * 26 * this.screen.scale + 15 * this.screen.scale,
      offsetY: this.screen.offsetY + 15 * this.screen.scale
    }));
  }

  function _mapRenderLayerBottom() {
    logger.info('Render bottom map.');
    var graphics = this.graphics['tile'];
    this.mapLayerBottom = new Map({
      layer: 0,
      map: this.map,
      width: this.screen.width,
      height: this.screen.height,
      cellWidth: this.cellWidth,
      offsetX: this.screen.offsetX,
      offsetY: this.screen.offsetY,
      image: graphics.image,
      scale: this.screen.scale
    });
    this.screen.add(this.mapLayerBottom);
  }

  function _mapRenderLayerTop() {
    logger.info('Render top map.');
    var graphics = this.graphics['tile'];
    this.screen.add(new Map({
      layer: 1,
      map: this.map,
      width: this.screen.width,
      height: this.screen.height,
      cellWidth: this.cellWidth,
      offsetX: this.screen.offsetX,
      offsetY: this.screen.offsetY,
      image: graphics.image,
      scale: this.screen.scale
    }));
  }

  function _stageAnim() {
    var that = this;
    var width = that.screen.width;
    var height = that.screen.height / 2;
    var scale = that.screen.scale;
    var diff = 0;
    var counter = 0;
    var graphics = this.graphics['num'];
    var anim = new DisplayObject({});

    setTimeout(function() {
      _initBoard.call(that);
    }, 800);

    anim.draw = function(screen) {
      if (parseInt(height - diff) === that.screen.offsetY) {
        this.destroy();
      };

      screen.ctx.save();
      screen.ctx.fillStyle='#7f7f7f';
      screen.ctx.fillRect(0, 0, width, height - diff);
      screen.ctx.fillRect(0, height + diff, width, height - diff);
      screen.ctx.restore();

      if (counter < 20 * scale) {
        screen.ctx.save();
        screen.ctx.translate(that.screen.width / 2, that.screen.height / 2);
        screen.ctx.drawImage(graphics.image, 0, 0, graphics.width / 10, graphics.height, 0, 0, graphics.width / 10 * scale, graphics.height * scale);
        screen.ctx.restore();
      } else {
        diff += 5 * scale;
      }
      counter ++;
    }
    this.screen.add(anim);
  }


  function Application(options) {
    Application.sup.call(this);
    var opt = {
      screen: null,
      graphics: null,
      sounds: null,
      stage: 0,
      player1: 3,
      player2: 3,
      enemy: 20,
      playerNum: 1,
      cellWidth: 0
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    window.sss = this.screen;
  }

  var proto = {};

  proto.init = function() {
    logger.info('Application initial.');
    this.cellWidth = this.graphics['tile'].height / 2;
    Keyboard.run(function () {
      Keyboard.simulate();
    });
    _welcome.call(this);
  }

  proto.start = function() {
    logger.info('Application start.');
    this.screen.clean();
    this.sounds['start'].sound.play();
    this.map = Resource.MAPS[this.stage];
    logger.info('Stage ' + this.stage + ' start.');
    _mapRenderLayerBottom.call(this);
    _initPlayer.call(this);
    _initEnemy.call(this);
    _mapRenderLayerTop.call(this);
    _stageAnim.call(this);
  }

  proto.pause = function() {
  }

  proto.restart = function() {
    this.end();
    this.init();
  }

  proto.end = function() {
  }

  Util.augment(Application, proto);
  Util.inherit(Application, Base);
  exports.Application = Application;
})(this);
