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

  proto.showNumber = function(screen, num, x, y) {
    var image = this.graphics.num.image;
    var originWidth = this.graphics.num.width / 10;
    var originHeight = this.graphics.num.height;
    var width = originWidth * this.scale;
    var height = originHeight * this.scale;
    screen.ctx.save();
    var translateX = x !== undefined ? x : this.offsetX;
    var translateY = y !== undefined ? y : this.offsetY;
    screen.ctx.translate(translateX, translateY);
    screen.ctx.drawImage(image, num * originWidth, 0, originWidth, originHeight, 0, 0, width, height);
    screen.ctx.restore();
  }

  proto.enemyInfo = function(screen) {
    var that = this;
    var image = this.graphics.misc.image;
    var cellWidth = 14;
    var enemyNum = this.enemyNum;
    while(enemyNum) {
      var row = parseInt((enemyNum - 1) / 2);
      var odd = enemyNum % 2 === 0;
      screen.ctx.save();
      screen.ctx.translate(that.offsetX + odd * 18 * this.scale, that.offsetY + row * 16 * this.scale);
      screen.ctx.drawImage(image, 0, 0, cellWidth, cellWidth, 0, 0, cellWidth * this.scale, cellWidth * this.scale);
      screen.ctx.restore();
      enemyNum --;
    }
  }

  proto.playerInfo = function(screen) {
    var that = this;
    var cellWidth = 14;
    var image = this.graphics.misc.image;
    
    // 玩家1图标
    screen.ctx.save();
    screen.ctx.translate(that.offsetX, that.offsetY + 180);
    screen.ctx.drawImage(image, cellWidth * 2, 0, cellWidth, cellWidth, 0, 0, cellWidth * this.scale, cellWidth * this.scale);
    screen.ctx.restore();
    
    // 玩家1生命数
    var player1Life = this.player1Life !== undefined ? this.player1Life : 3;
    this.showNumber(screen, player1Life, that.offsetX + cellWidth * this.scale, that.offsetY + 180);
    screen.ctx.save();
    screen.ctx.translate(that.offsetX + cellWidth * this.scale * 2, that.offsetY + 180);
    screen.ctx.drawImage(image, cellWidth * 3, 0, cellWidth, cellWidth, 0, 0, cellWidth * this.scale, cellWidth * this.scale);
    screen.ctx.restore();
    
    // 玩家1坦克图标
    screen.ctx.save();
    screen.ctx.translate(that.offsetX, that.offsetY + 200);
    screen.ctx.drawImage(image, cellWidth, 0, cellWidth, cellWidth, 0, 0, cellWidth * this.scale, cellWidth * this.scale);
    screen.ctx.restore();

    if (this.playerNum === 2) {
      // 玩家2图标
      screen.ctx.save();
      screen.ctx.translate(that.offsetX, that.offsetY + 240);
      screen.ctx.drawImage(image, cellWidth * 2, 0, cellWidth, cellWidth, 0, 0, cellWidth * this.scale, cellWidth * this.scale);
      screen.ctx.restore();
      
      // 玩家2生命数
      var player2Life = this.player2Life !== undefined ? this.player2Life : 3;
      this.showNumber(screen, player2Life, that.offsetX + cellWidth * this.scale, that.offsetY + 240);
      screen.ctx.save();
      screen.ctx.translate(that.offsetX + cellWidth * this.scale * 2, that.offsetY + 240);
      screen.ctx.drawImage(image, cellWidth * 3, 0, cellWidth, cellWidth, 0, 0, cellWidth * this.scale, cellWidth * this.scale);
      screen.ctx.restore();
      
      // 玩家2坦克图标
      screen.ctx.save();
      screen.ctx.translate(that.offsetX, that.offsetY + 260);
      screen.ctx.drawImage(image, cellWidth, 0, cellWidth, cellWidth, 0, 0, cellWidth * this.scale, cellWidth * this.scale);
      screen.ctx.restore();
    }
  }

  proto.stageInfo = function(screen) {
    var that = this;
    var cellWidth = 32;
    var image = this.graphics.flag.image;
    screen.ctx.save();
    screen.ctx.translate(that.offsetX, that.offsetY + 300);
    screen.ctx.drawImage(image, 0, 0, cellWidth, cellWidth, 0, 0, cellWidth * this.scale, cellWidth * this.scale);
    screen.ctx.restore();
    
    // 显示关卡数
    var stage = this.stage !== undefined ? this.stage : 1;
    screen.ctx.save();
    screen.ctx.translate(that.offsetX + cellWidth * this.scale + 5, that.offsetY + 300 + 10);
    this.showNumber(screen, stage);
    screen.ctx.restore();
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
