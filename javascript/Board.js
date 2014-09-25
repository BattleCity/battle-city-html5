'use strict';

(function(exports, undefined) {

  function Board(options) {
    var opt = {};
    Util.merge(opt, options);
    Util.merge(this, opt);
  }

  var proto = {};

  proto.showNumber = function(ctx, num) {
    var image = this.graphics.num.image;
    var originWidth = this.graphics.num.width / 10;
    var originHeight = this.graphics.num.height;
    var width = originWidth * this.scale;
    var height = originHeight * this.scale;
    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);
    ctx.drawImage(image, num * originWidth, 0, originWidth, originHeight, 0, 0, width, height);
    ctx.restore();
  }

  proto.enemyInfo = function(ctx) {
    var that = this;
    var image = this.graphics.misc.image;
    var cellWidth = 14;
    var enemyNum = this.enemyNum;
    while(enemyNum) {
      var row = parseInt((enemyNum - 1) / 2);
      var odd = enemyNum % 2 === 0;
      ctx.save();
      ctx.translate(that.offsetX + odd * 10, that.offsetY + row * 10);
      ctx.drawImage(image, 0, 0, cellWidth, cellWidth, 0, 0, cellWidth * this.scale, cellWidth * this.scale);
      ctx.restore();
      enemyNum --;
    }
  }

  proto.playerInfo = function(ctx) {
    var that = this;
    var cellWidth = 14;
    var image = this.graphics.misc.image;
    ctx.save();
    ctx.translate(that.offsetX, that.offsetY + 180);
    ctx.drawImage(image, cellWidth * 2, 0, cellWidth, cellWidth, 0, 0, cellWidth * this.scale, cellWidth * this.scale);
    ctx.restore();
    ctx.save();
    ctx.translate(that.offsetX + cellWidth * this.scale, that.offsetY + 180);
    ctx.drawImage(image, cellWidth * 3, 0, cellWidth, cellWidth, 0, 0, cellWidth * this.scale, cellWidth * this.scale);
    ctx.restore();
    ctx.save();
    ctx.translate(that.offsetX, that.offsetY + 200);
    ctx.drawImage(image, cellWidth, 0, cellWidth, cellWidth, 0, 0, cellWidth * this.scale, cellWidth * this.scale);
    ctx.restore();
    //this.showNumber(ctx, 1);
  }

  proto.stageInfo = function(ctx) {
    var that = this;
    var cellWidth = 32;
    var image = this.graphics.flag.image;
    ctx.save();
    ctx.translate(that.offsetX, that.offsetY + 220);
    ctx.drawImage(image, 0, 0, cellWidth, cellWidth, 0, 0, cellWidth * this.scale, cellWidth * this.scale);
    ctx.restore();
    //this.showNumber(ctx, 2);
  }

  proto.draw = function(ctx) {
    this.enemyInfo(ctx);
    this.playerInfo(ctx);
    this.stageInfo(ctx);
  }

  Util.augment(Board, proto);
  exports.Board = Board;
})(this);
