'use strict';

(function(exports, undefined) {

  function Enemy() {
    this.init();
    Enemy.sup.call(this);
  }

  var proto = {};

  Enemy.init = function() {
  }

  Util.augment(Enemy, proto);
  Util.inherit(Enemy, Tank);
  exports.Enemy = Enemy;
})(this);
