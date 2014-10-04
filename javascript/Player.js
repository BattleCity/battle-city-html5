'use strict';

(function(exports, undefined) {

  function Player(options) {
    var opt = {
      level: 0,
      fire: false
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Player.sup.call(this, opt);
  }

  var proto = {};

  proto.forward = function(direct) {
    var that = this;
    this.sounds['move'].sound.play();

    if (this.directtion !== direct) {
      this.direction = direct;
    }

    if (this.test()) return;

    switch (this.direction) {
      case 'up':
        this.offsetY -= this.speed;
        break;
      case 'down':
        this.offsetY += this.speed;
        break;
      case 'left':
        this.offsetX -= this.speed;
        break;
      case 'right':
        this.offsetX += this.speed;
        break;
    }
  }

  Util.augment(Player, proto);
  Util.inherit(Player, Tank);
  exports.Player = Player;
})(this);
