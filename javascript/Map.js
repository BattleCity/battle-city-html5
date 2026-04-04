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
  var HOME_BROKEN1 = 10;
  var HOME_BROKEN2 = 11;
  var HOME_BROKEN3 = 12;
  var HOME_BROKEN4 = 13;

  function _isHome(code) {
    return code === HOME1
      || code === HOME2
      || code === HOME3
      || code === HOME4
      || code === HOME_BROKEN1
      || code === HOME_BROKEN2
      || code === HOME_BROKEN3
      || code === HOME_BROKEN4;
  }

  function _hitTest(xleft, yleft, xright, yright) {
    if (!this.map[yleft] || !this.map[yright]) return true;

    var pleft = this.map[yleft][xleft];
    var pright = this.map[yright][xright];
    return pleft === WALL
      || pright === WALL
      || pleft === STEEL
      || pright === STEEL;
  }

  function _hitBullet(x1, y1, x2, y2, direction) {
    var x0 = Math.floor(x1 / 2) * 2;
    var y0 = Math.floor(y1 / 2) * 2;
    var cells = [];

    if (direction === 'up' || direction === 'down') {
      // 判断子弹横向覆盖了砖块对的哪几列
      var cols = [];
      if (x1 === x0) cols.push(x0);         // 子弹左边缘在左列
      if (x2 >= x0 + 1) cols.push(x0 + 1); // 子弹右边缘到达右列
      for (var i = 0; i < cols.length; i++) {
        cells.push([cols[i], y0], [cols[i], y0 + 1]);
      }
    } else {
      // 判断子弹纵向覆盖了砖块对的哪几行
      var rows = [];
      if (y1 === y0) rows.push(y0);         // 子弹上边缘在上行
      if (y2 >= y0 + 1) rows.push(y0 + 1); // 子弹下边缘到达下行
      for (var i = 0; i < rows.length; i++) {
        cells.push([x0, rows[i]], [x0 + 1, rows[i]]);
      }
    }

    var result = null;
    for (var i = 0; i < cells.length; i++) {
      var cx = cells[i][0], cy = cells[i][1];
      if (!this.map[cy] || this.map[cy][cx] === undefined) continue;
      var p = this.map[cy][cx];
      if (p === WALL) {
        _hitWall.call(this, cx, cy);
        result = 'wall';
      } else if (_isHome(p)) {
        _destroyHome.call(this);
        result = 'home';
      } else if (p === STEEL && !result) {
        result = 'steel';
      }
    }
    return result;
  }

  function _hitWall(x, y) {
    this.map[y][x] = NONE;
  }

  function _destroyHome() {
    this.map[24][12] = HOME_BROKEN1;
    this.map[24][13] = HOME_BROKEN2;
    this.map[25][12] = HOME_BROKEN3;
    this.map[25][13] = HOME_BROKEN4;
    this.homeDestroyed = true;
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
            case HOME_BROKEN1:
              posX = 6;
              posY = 0;
              break;
            case HOME_BROKEN2:
              posX = 6.5;
              posY = 0;
              break;
            case HOME_BROKEN3:
              posX = 6;
              posY = 0.5;
              break;
            case HOME_BROKEN4:
              posX = 6.5;
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

  proto.hitBullet = function(x1, y1, x2, y2, direction) {
    return _hitBullet.call(this, x1, y1, x2, y2, direction);
  }

  Util.augment(Map, proto);
  exports.Map = Map;
})(this);
