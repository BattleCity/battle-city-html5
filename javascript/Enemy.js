'use strict';

(function(exports, undefined) {

  function Enemy(options) {
    var opt = {};
    Util.merge(opt, options);
    Util.merge(this, opt);
    Enemy.sup.call(this);
    this.init();
  }

  var proto = {};

  proto.init = function() {

  }
  Util.augment(Enemy, proto);
  Util.inherit(Enemy, Tank);
  exports.Enemy = Enemy;
})(this);
