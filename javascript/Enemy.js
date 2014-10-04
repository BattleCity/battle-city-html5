'use strict';

(function(exports, undefined) {

  function _changeDirecttion() {
    var temp = ['up', 'down', 'left', 'right'];
    var direction = temp[Math.floor(Math.random() * temp.length)];
    if (this.direction === direction) return _changeDirecttion.call(this);
    this.direction = direction;
    this.shot();
  }

  function Enemy(options) {
    var opt = {
      level: 0,
      fire: true
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Enemy.sup.call(this, opt);
  }

  var proto = {};

  proto.forward = function() {
    var that = this;
    this.sounds['enemy'].sound.play();

    if (this.test()) _changeDirecttion.call(this);
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

  Util.augment(Enemy, proto);
  Util.inherit(Enemy, Tank);
  exports.Enemy = Enemy;
})(this);
