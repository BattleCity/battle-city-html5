'use strict';

(function(exports, undefined) {

  function Board(options) {
    var opt = {
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Board.sup.call(this, opt);
  }

  var proto = {};

  proto.showNumber = function(screen, num, offsetX, offsetY) {
    var image = this.graphics.num.image;
    var originWidth = this.graphics.num.width / 10;
    var originHeight = this.graphics.num.height;
    var width = originWidth * this.scale;
    var height = originHeight * this.scale;
    screen.ctx.drawImage(image, num * originWidth, 0, originWidth, originHeight, offsetX, offsetY, width, height);
  }

  proto.showValue = function(screen, value, offsetX, offsetY) {
    // Use math to extract digits instead of String conversion (#9)
    var v = Math.max(0, value);
    var digitWidth = this.graphics.num.width / 10 * this.scale;
    if (v === 0) {
      this.showNumber(screen, 0, offsetX, offsetY);
      return;
    }
    // Count digits
    var digits = [];
    while (v > 0) {
      digits.push(v % 10);
      v = Math.floor(v / 10);
    }
    // Render digits left to right
    for (var i = digits.length - 1; i >= 0; i--) {
      this.showNumber(screen, digits[i], offsetX + (digits.length - 1 - i) * digitWidth, offsetY);
    }
  }

  proto.enemyInfo = function(screen) {
    var image = this.graphics.misc.image;
    var cellWidth = 14;
    var enemyNum = this.enemyNum;
    while(enemyNum) {
      var row = Math.floor((enemyNum - 1) / 2);
      var odd = enemyNum % 2 === 0;
      var tx = this.offsetX + odd * 18 * this.scale;
      var ty = this.offsetY + row * 16 * this.scale;
      screen.ctx.drawImage(image, 0, 0, cellWidth, cellWidth, tx, ty, cellWidth * this.scale, cellWidth * this.scale);
      enemyNum --;
    }
  }

  proto.playerInfo = function(screen) {
    var cellWidth = 14;
    var image = this.graphics.misc.image;
    var s = this.scale;
    var ox = this.offsetX;
    var oy = this.offsetY;
    var cw = cellWidth * s;

    screen.ctx.drawImage(image, cellWidth * 2, 0, cellWidth, cellWidth, ox, oy + 180, cw, cw);
    screen.ctx.drawImage(image, cellWidth * 3, 0, cellWidth, cellWidth, ox + cw, oy + 180, cw, cw);
    screen.ctx.drawImage(image, cellWidth, 0, cellWidth, cellWidth, ox, oy + 200, cw, cw);
    this.showValue(screen, this.player1Lives, ox + 20 * s, oy + 200);

    if (this.playerNum === 2) {
      screen.ctx.drawImage(image, cellWidth * 3, 0, cellWidth, cellWidth, ox + cw, oy + 180, cw, cw);
      screen.ctx.drawImage(image, cellWidth, 0, cellWidth, cellWidth, ox, oy + 260, cw, cw);
      this.showValue(screen, this.player2Lives, ox + 20 * s, oy + 260);
    }
  }

  proto.stageInfo = function(screen) {
    var cellWidth = 32;
    var image = this.graphics.flag.image;
    var ox = this.offsetX;
    var oy = this.offsetY;
    var s = this.scale;
    screen.ctx.drawImage(image, 0, 0, cellWidth, cellWidth, ox, oy + 300, cellWidth * s, cellWidth * s);
    this.showValue(screen, this.stage + 1, ox + 6 * s, oy + 340);
  }

  proto.draw = function(screen) {
    this.enemyInfo(screen);
    this.playerInfo(screen);
    this.stageInfo(screen);
  }

  Util.augment(Board, proto);
  Util.inherit(Board, DisplayObject);
  exports.Board = Board;
})(this);
