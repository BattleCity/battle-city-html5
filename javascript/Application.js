'use strict';

(function(exports, undefined) {
  function Application(options) {
    var opt = {
      screen: null,
      graphics: null,
      index: 0,
      debug: false
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
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

  proto.start = function(playerNum) {
    this.screen.clean();
    var scale = this.screen.scale;
    new Sound(SOUNDDIR + 'start' + SOUNDSUFFIX).play();

    var map = new Map({
      index: 0
    });

    var player1 = new Player({
      image: this.graphics.player1.image,
      scale: scale,
      width: this.playerWidth,
      height: this.playerHeight,
      offsetX: 10,
      offsetY: 10,
      x: 0,
      y: 0,
      map: map
    });

    player1.update = function() {
      this.x = this.x ? 0 : 1;
    }
    this.screen.add(player1);

    if (playerNum === 2) {
      var player2 = new Player({
        image: this.graphics.player2.image,
        scale: scale,
        width: this.playerWidth,
        height: this.playerHeight,
        offsetX: 50,
        offsetY: 10,
        x: 0,
        y: 0,
        map: map
      });

      player2.update = function() {
        this.x = this.x ? 0 : 1;
      }
      this.screen.add(player2);
    }

    var cellWidth = this.graphics['tile'].width / 14;
    this.screen.add(map);
  }

  proto.bindEvent = function() {
    var that = this;
    Keyboard.run(function () {
      Keyboard.simulate();
    });
    Keyboard.RIGHT.down(function () {
    });
    Keyboard.UP.down(function () {
    });
    Keyboard.LEFT.down(function(){
    });
    Keyboard.DOWN.down(function(){
    });
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
