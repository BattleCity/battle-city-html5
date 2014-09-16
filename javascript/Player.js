'use strict';

(function(exports, undefined) {

  function Player(image, scale, x, y, width, height, posX, posY) {
    Player.sup.call(this, image, scale, x, y, width, height, posX, posY);
    this.init();
  }

  var proto = {};

  Player.init = function() {
  }

  Util.augment(Player, proto);
  Util.inherit(Player, Tank);
  exports.Player = Player;
})(this);
