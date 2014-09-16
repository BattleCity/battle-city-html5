'use strict';

(function(exports, undefined) {

  function Stage(screen, graphics) {
    this.screen = screen;
    this.graphics = graphics;
    this.index = STARTSTAGE;
    this.playerNum = 1;
    this.welcoming = true;
    this.startround = false;
    this.bindEvent();
  }

  var proto = {};

  proto.welcome = function() {
    var that = this;
    var scale = this.screen.scale;
    this.screen.clean();
    var splashOffsetX = (DEFAULTWIDTH - this.graphics.splash.width) / 2;
    var splashOffsetY = 120;
    var moveHeight = 400 * this.screen.scale;
    var moveSpeed = 2;
    var splash = new Sprite(this.graphics.splash, this.screen.scale, splashOffsetX, splashOffsetY + moveHeight);
    splash.update = function() {
      if (this.y > splashOffsetY * scale) this.y -= moveSpeed;
    }
    this.screen.add(splash);
    var playerOffsetX = splashOffsetX + 70;
    var playerOffsetY = splashOffsetY + 170;
    var playerWidth = this.graphics.player1.width / 8;
    var playerHeight = this.graphics.player1.height / 4;
    this.player = new Sprite(this.graphics.player1, this.screen.scale, playerOffsetX, playerOffsetY + moveHeight, playerWidth, playerHeight, 0, 1);
    this.player.update = function() {
      this.posX = this.posX ? 0 : 1;
      if (!that.welcoming) {
        if (that.playerNum === 2) {
          this.y = (playerOffsetY + 30) * scale;
        } else {
          this.y = playerOffsetY * scale;
        }
        return;
      }
      if (this.y > playerOffsetY * scale) {
        this.y -= moveSpeed;
      } else {
        that.welcoming = false;
      }
    }
    this.screen.add(this.player);
    Util.bind('keydown', function(e) {
      if (that.startround) return;
      if (that.welcoming) {
        splash.y = splashOffsetY * scale;
        that.player.y = playerOffsetY * scale;
        that.welcoming = false;
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

  proto.start = function() {
    this.screen.clean();
    this.startround = true;
    new Sound(SOUNDDIR + 'start' + SOUNDSUFFIX).play();
    var map = new Map(this.index, this.screen, this.graphics);
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

  Util.augment(Stage, proto);
  exports.Stage = Stage;
})(this);
