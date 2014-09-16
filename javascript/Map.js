'use strict';

(function(exports, undefined) {
  // static

	var NONE = 0;
	var WALL = 1;
	var STEEL = 2;
	var GRASS = 3;
	var WATER = 4;
	var ICE = 5;

  var HOME1 = 6;
  var HOME2 = 7;
  var HOME3 = 8;
  var HOME4 = 9;

  var map1 = [
    [0,0,0,0,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,0,0,2,2,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,2,2,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,2,2,1,1,0,0],
    [0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,2,2,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0],
    [3,3,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,1,1,3,3,1,1,2,2],
    [3,3,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,1,1,3,3,1,1,2,2],
    [3,3,3,3,0,0,0,0,0,0,1,1,0,0,0,0,2,2,0,0,3,3,0,0,0,0],
    [3,3,3,3,0,0,0,0,0,0,1,1,0,0,0,0,2,2,0,0,3,3,0,0,0,0],
    [0,0,1,1,1,1,1,1,3,3,3,3,3,3,2,2,0,0,0,0,3,3,1,1,0,0],
    [0,0,1,1,1,1,1,1,3,3,3,3,3,3,2,2,0,0,0,0,3,3,1,1,0,0],
    [0,0,0,0,0,0,2,2,3,3,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,0,0,0,0,2,2,3,3,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [2,2,1,1,0,0,2,2,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0],
    [2,2,1,1,0,0,2,2,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,2,2,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,2,2,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,0,1,6,7,1,0,0,0,1,1,1,1,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,0,1,8,9,1,0,0,0,1,1,1,1,1,1,0,0],
  ];

  var MAP = [map1];

  function Map(index, screen, graphics) {
    this.index = index || 1;
    this.graphics = graphics;
    this.screen = screen;
    this.ctx = this.screen.ctx;
    this.cellWidth = this.graphics['tile'].width / 14;
    this.init();
  }

  var proto = {};

  proto.init = function() {
    this.map = MAP[this.index - 1];
  }

  proto.drawBackground = function() {
    this.ctx.fillStyle = "#7f7f7f";
    this.ctx.fillRect(0, 0, this.screen.width, this.screen.height);
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(this.screen.offsetX, this.screen.offsetY, this.cellWidth * 26 * this.screen.scale, this.cellWidth * 26 * this.screen.scale);
  }

  proto.draw = function() {
    var that = this;
    this.drawBackground();
    var scale = this.screen.scale;
    Util.each(this.map, function(i, y) {
      Util.each(i, function(j, x) {
        var image = that.graphics['tile'].image;
        var originWidth = that.cellWidth;
        var originHeight = that.graphics['tile'].height / 2;
        var width = originWidth * scale;
        var height = originHeight * scale;
        that.ctx.save();
        that.ctx.translate(width * x + that.screen.offsetX, height * y + that.screen.offsetY);
        var posX = -1;
        var posY = -1;
        switch (j) {
          case NONE:
            break;
          case WALL:
            posX = 0;
            posY = 0;
            break;
          case STEEL:
            posX = 1;
            posY = 0;
            break;
          case GRASS:
            posX = 2;
            posY = 0;
            break;
          case ICE:
            posX = 3;
            posY = 0;
            break;
          case WATER:
            posX = 4;
            posY = 0;
            break;
          case HOME1:
            posX = 5;
            posY = 0;
            break;
          case HOME2:
            posX = 5.5;
            posY = 0;
            break;
          case HOME3:
            posX = 5;
            posY = 0.5;
            break;
          case HOME4:
            posX = 5.5;
            posY = 0.5;
            break;
        }
        that.ctx.drawImage(image, posX * 2 * originWidth, posY * 2 * originHeight, originWidth, originHeight, 0, 0, width, height);
        that.ctx.restore();
      })
    })
  }

  proto.update = function() {
  }

  Util.augment(Map, proto);
  exports.Map = Map;
})(this);
