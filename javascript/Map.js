'use strict';

(function(exports, undefined) {
  // static
  var logger = new Logger();

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

  function _hitTest(xleft, yleft, xright, yright) {
    if (!this.map[yleft] || !this.map[yright]) return true;

    var pleft = this.map[yleft][xleft];
    var pright = this.map[yright][xright];
    return pleft === WALL
      || pright === WALL
      || pleft === STEEL
      || pright === STEEL;
  }

  function _hitBullet(x, y) {
    var p = this.map[y][x];
    if (p === WALL) {
      _hitWall.call(this, x, y);
      return 'wall';
    } else if (p === STEEL) {
      return 'steel';
    }
  }

  function _hitWall(x, y) {
    this.map[y][x] = NONE;
  }

  function _drawBackground(screen) {
    screen.ctx.fillStyle = '#7f7f7f';
    screen.ctx.fillRect(0, 0, this.width, this.height);
    screen.ctx.fillStyle = '#000';
    screen.ctx.fillRect(this.offsetX, this.offsetY, this.cellWidth * 26 * this.scale, this.cellWidth * 26 * this.scale);
  }

  function Map(options) {
    var opt = {};
    Util.merge(opt, options);
    Util.merge(this, opt);
  }

  var proto = {};

  proto.draw = function(screen) {
    var that = this;

    if(this.layer === 0) _drawBackground.call(this, screen);

    Util.each(this.map, function(i, y) {
      Util.each(i, function(j, x) {
        var width = that.cellWidth * that.scale;
        var height = that.cellWidth * that.scale;
        screen.ctx.save();
        screen.ctx.translate(width * x + that.offsetX, height * y + that.offsetY);
        var posX = -1;
        var posY = -1;

        if (that.layer === 1) {
          if (j === GRASS) {
            posX = 2;
            posY = 0;
          }
        } else if(that.layer === 0) {
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
        }
        screen.ctx.drawImage(that.image, posX * 2 * that.cellWidth, posY * 2 * that.cellWidth, that.cellWidth, that.cellWidth, 0, 0, width, height);
        screen.ctx.restore();
      })
    })
  }

  proto.hitTest = function(x1, y1, x2, y2) {
    return _hitTest.call(this, x1, y1, x2, y2);
  }

  proto.hitBullet = function(x, y) {
    return _hitBullet.call(this, x, y);
  }

  Util.augment(Map, proto);
  exports.Map = Map;
})(this);
