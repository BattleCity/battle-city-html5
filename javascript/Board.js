'use strict';

(function(exports, undefined) {

  function Board() {
    this.init();
    Board.sup.call(this);
  }

  var proto = {};

  Board.init = function() {
  }

  Util.augment(Board, proto);
  Util.inherit(Board, Sprite);
  exports.Board = Board;
})(this);
