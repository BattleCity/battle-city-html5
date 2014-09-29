'use strict';

(function(exports, undefined) {

  function Player(options) {
    var opt = {
      level: 0
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Player.sup.call(this, opt);
  }

  var proto = {};

  Util.augment(Player, proto);
  Util.inherit(Player, Tank);
  exports.Player = Player;
})(this);
