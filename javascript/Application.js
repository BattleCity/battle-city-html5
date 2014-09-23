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
    this.graphics = this.resource.graphics;
    this.sounds = this.resource.sounds;
    this.welcome();
  }

  var proto = {};

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
      speed: 5,
      cellWidth: this.graphics['tile'].height / 2
    });

    player1.update = function() {
      this.x = this.x ? 0 : 1;
    }
    this.screen.add(player1);

    Util.bind('keydown', function(e) {

      if (e.keyCode === Keyboard.DOWN.keyCode) {
        player1.offsetY += player1.speed;
      } else if (e.keyCode === Keyboard.UP.keyCode) {
        player1.offsetY -= player1.speed;
      } else if (e.keyCode === Keyboard.LEFT.keyCode) {
        player1.offsetX -= player1.speed;
      } else if (e.keyCode === Keyboard.RIGHT.keyCode) {
        player1.offsetX += player1.speed;
      }
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
        cellWidth: this.graphics['tile'].height / 2
      });

      player2.update = function() {
        this.x = this.x ? 0 : 1;
      }
      this.screen.add(player2);
      Util.bind('keydown', function(e) {

        if (e.keyCode === Keyboard.DOWN.keyCode) {
          playerNum = 2;
        } else if (e.keyCode === Keyboard.UP.keyCode) {
          playerNum = 1;
        } else if (e.keyCode === Keyboard.ENTER.keyCode) {
          that.start(playerNum);
        }
      });
    }
  }

  proto.initEnemy = function(map) {
  
  }

  proto.initBoard = function(playerNum, map) {
  
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
    this.initBoard();
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
