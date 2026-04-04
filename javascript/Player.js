'use strict';

(function(exports, undefined) {

  function Player(options) {
    var opt = {
      level: 0,
      fire: false,
      type: 'player'
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Player.sup.call(this, opt);
  }

  var proto = {};

  proto.forward = function(direct) {
    if (!this.canAct()) return;
    this.sounds['move'].sound.play();

    if (this.direction !== direct) {
      this.direction = direct;
    }

    if (this.test()) return;

    switch (this.direction) {
      case 'up':
        this.move(0, -this.speed);
        break;
      case 'down':
        this.move(0, this.speed);
        break;
      case 'left':
        this.move(-this.speed, 0);
        break;
      case 'right':
        this.move(this.speed, 0);
        break;
    }
  }

  Util.augment(Player, proto);
  Util.inherit(Player, Tank);
  exports.Player = Player;
})(this);
