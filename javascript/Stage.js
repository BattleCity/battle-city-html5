'use strict';

(function(exports, undefined) {

  function Stage(screen, graphics) {
    this.screen = screen;
    this.graphics = graphics;
    this.index = STARTSTAGE;
    this.startround = false;
  }

  var proto = {};
  proto.welcome = function() {
    var offsetX = (DEFAULTWIDTH - this.graphics.splash.width) / 2;
    var splash = new Sprite(this.graphics.splash, this.screen.scale, offsetX, 300);
    splash.update = function() {
      if(this.y > 200) this.y --;
    }
    this.screen.add(splash);
    var playerWidth = this.graphics.player1.width / 8;
    var playerHeight = this.graphics.player1.height / 4;
    var tank = new Sprite(this.graphics.player1, this.screen.scale, offsetX, 200, playerWidth, playerHeight, 0, 1);
    tank.update = function() {
      this.posX = this.posX ? 0 : 1;
      if(this.y > 300) this.y --;
    }
    this.screen.add(tank);
  }

  proto.start = function() {
    this.map = new Map(this.index);
  }

  Util.augment(Stage, proto);
  exports.Stage = Stage;
})(this);
