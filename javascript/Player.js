'use strict';

(function(exports, undefined) {

  function Player() {
    this.init();
    Player.sup.call(this);
  }

  var proto = {};

  Player.init = function() {
  }

  Util.augment(Player, proto);
  Util.inherit(Player, Tank);
  exports.Player = Player;
})(this);
