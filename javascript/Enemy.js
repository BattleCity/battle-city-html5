'use strict';

(function(exports, undefined) {

  function Enemy() {
    Enemy.sup.call(this);
  }

  var proto = {};
  Util.augment(Enemy, proto);
  Util.inherit(Enemy, Tank);
  exports.Enemy = Enemy;
})(this);
