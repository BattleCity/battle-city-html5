'use strict';

(function(exports, undefined) {

  function Player(options) {
    var opt = {};
    Util.merge(opt, options);
    Util.merge(this, opt);
    Player.sup.call(this, opt);
    this.init();
  }

  var proto = {};

  Player.init = function() {
  }

  Util.augment(Player, proto);
  Util.inherit(Player, Tank);
  exports.Player = Player;
})(this);
