'use strict';

(function(exports, undefined) {
  function Application(options) {
    var opt = {
      screen: null,
      resource: null,
      index: 0,
      debug: false,
      player1: 3,
      player2: 3,
      enemy: 20
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    this.graphics = this.graphics;
    this.sounds = this.sounds;
    this.welcome();
    this.init();
  }

  var proto = {};

  proto.init = function() {
    Keyboard.run(function () {
      Keyboard.simulate();
    });
  }

  proto.welcome = function() {
    var that = this;
    this.screen.clean();
    var scale = this.screen.scale;
    var playerNum = 1;
    var welcoming = true;
    var startround = false;
    var splashOffsetX = (DEFAULTWIDTH - this.graphics.splash.width) / 2;
    var splashOffsetY = 120;
    var moveHeight = 400;

    var moveSpeed = 2;

    var splash = new Sprite({
      image: this.graphics.splash.image,
      offsetX: splashOffsetX,
      offsetY: moveHeight,
      width: this.graphics.splash.width,
      height: this.graphics.splash.height,
      scale: scale
    });

    splash.update = function() {
      if (this.offsetY > splashOffsetY) this.offsetY -= moveSpeed;
    }
    this.screen.add(splash);

    var playerOffsetX = splashOffsetX + 70;
    var playerOffsetY = splashOffsetY + 170;
    this.playerWidth = this.graphics.player1.width / 8;
    this.playerHeight = this.graphics.player1.height / 4;

    this.player = new Sprite({
      image: this.graphics.player1.image,
      x: 0,
      y: 1,
      scale: scale,
      width: this.playerWidth,
      height: this.playerHeight,
      offsetX: playerOffsetX,
      offsetY: moveHeight + 170
    });

    this.player.update = function() {
      this.x = this.x ? 0 : 1;

      if (!welcoming) {
        this.offsetY = playerOffsetY + (playerNum === 2 ? 30 : 0);
        return;
      }

      if (this.offsetY > playerOffsetY ) {
        this.offsetY -= moveSpeed;
      } else {
        welcoming = false;
      }
    }

    this.screen.add(this.player);

    

    Util.bind('keydown', function(e) {
      if (startround) return;
      if (welcoming) {
        splash.offsetY = splashOffsetY;
        that.player.offsetY = playerOffsetY;
        welcoming = false;
        return;
      }

      if (e.keyCode === Keyboard.DOWN.keyCode) {
        playerNum = 2;
      } else if (e.keyCode === Keyboard.UP.keyCode) {
        playerNum = 1;
      } else if (e.keyCode === Keyboard.ENTER.keyCode) {
        that.start(playerNum);
      }
    });
  }

  proto.initPlayer = function(playerNum, map) {
    var scale = this.screen.scale;

    var player1 = new Player({
      image: this.graphics.player1.image,
      scale: scale,
      width: this.playerWidth,
      height: this.playerHeight,
      offsetX: this.screen.offsetX / scale + 2,
      offsetY: this.screen.offsetY / scale + 2,
      x: 0,
      y: 0,
      map: map,
      position: {
        x: 8,
        y: 24
      },
      speed: 1,
      cellWidth: this.graphics['tile'].height / 2,
      screen: this.screen,
      graphics: this.graphics,
      sounds: this.sounds
    });

    player1.update = function() {
      player1.run();
    }
    this.screen.add(player1);

    Keyboard.S.down(function() {
      player1.forward('down');
    });
     Keyboard.W.down(function() {
      player1.forward('up');
     });
     Keyboard.A.down(function() {
      player1.forward('left');
     });
     Keyboard.D.down(function() {
      player1.forward('right');
     });
     Keyboard.SPACE.press(function() {
      player1.shot();
     });

    if (playerNum === 2) {
      var player2 = new Player({
        image: this.graphics.player2.image,
        scale: scale,
        width: this.playerWidth,
        height: this.playerHeight,
        offsetX: this.screen.offsetX / scale + 2,
        offsetY: this.screen.offsetY / scale + 2,
        x: 0,
        y: 0,
        map: map,
        position: {
          x: 16,
          y: 24
        },
        cellWidth: this.graphics['tile'].height / 2,
        screen: this.screen,
        graphics: this.graphics,
        sounds: this.sounds
      });

      player2.update = function() {
        player2.run();
      }
      this.screen.add(player2);

      Keyboard.DOWN.down(function() {
        player2.forward('down');
      });
      Keyboard.UP.down(function() {
        player2.forward('up');
      });
      Keyboard.LEFT.down(function() {
        player2.forward('left');
      });
      Keyboard.RIGHT.down(function() {
        player2.forward('right');
      });
      Keyboard.SPACE.press(function() {
        player2.shot();
      });
    }
  }

  proto.initEnemy = function(map) {
  
  }

  proto.initBoard = function(playerNum) {
    this.screen.add(new Board({
      scale: this.screen.scale,
      graphics: this.graphics,
      screen: this.screen,
      playerNum: playerNum,
      enemyNum: 20,
      offsetX: this.screen.offsetX + this.graphics['tile'].height * 13 * this.screen.scale + 15 * this.screen.scale,
      offsetY: this.screen.offsetY + 15 * this.screen.scale
    }));
  }

  proto.mapRenderLayer0 = function(map) {
    this.screen.add(new Map({
      layer: 0,
      map: map,
      width: this.screen.width,
      height: this.screen.height,
      cellWidth: this.graphics['tile'].height / 2,
      offsetX: this.screen.offsetX,
      offsetY: this.screen.offsetY,
      image: this.graphics['tile'].image,
      scale: this.screen.scale
    }));
  }

  proto.mapRenderLayer1 = function(map) {
    this.screen.add(new Map({
      layer: 1,
      map: map,
      width: this.screen.width,
      height: this.screen.height,
      cellWidth: this.graphics['tile'].height / 2,
      offsetX: this.screen.offsetX,
      offsetY: this.screen.offsetY,
      image: this.graphics['tile'].image,
      scale: this.screen.scale
    }));
  }

  proto.start = function(playerNum) {
    this.screen.clean();
    this.sounds['start'].sound.play();
    var map = Resource.MAPS[1];
    this.mapRenderLayer0(map);
    this.initPlayer(playerNum, map);
    this.initEnemy(map);
    this.mapRenderLayer1(map);
    this.welcomeAnim(playerNum);
  }

  proto.welcomeAnim = function(playerNum) {
    var that = this;
    var width = that.screen.width;
    var height = that.screen.height / 2;
    var diff = 0;
    var counter = 0;
    var anim = new Animation({
    });
    anim.draw = function(ctx) {
      if (height - diff === 0) return;
      if (height - diff === 50 * that.screen.scale) {
        that.initBoard(playerNum);
      };
      ctx.save();
      ctx.fillStyle='#7f7f7f';
      ctx.fillRect(0, 0, width, height - diff);
      ctx.fillRect(0, height + diff, width, height - diff);
      ctx.restore();
      if (counter < 20 * that.screen.scale) {
        ctx.save();
        ctx.translate(that.screen.width / 2, that.screen.height / 2);
        ctx.drawImage(that.graphics.num.image, 0, 0, that.graphics.num.width / 10, that.graphics.num.height, 0, 0, that.graphics.num.width / 10 * that.screen.scale, that.graphics.num.height * that.screen.scale);
        ctx.restore();
      } else {
        diff += 5 * that.screen.scale;
      }
      counter ++;
    }
    this.screen.add(anim);
  }

  proto.pause = function() {

  }

  proto.restart = function() {

  }

  proto.end = function() {

  }

  Util.augment(Application, proto);
  exports.Application = Application;
})(this);
