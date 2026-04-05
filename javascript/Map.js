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

  // Lookup table: tile code → [posX, posY] for layer 0
  // Replaces the per-tile switch statement (#5)
  var TILE_POS_LAYER0 = [];
  TILE_POS_LAYER0[NONE] = null;
  TILE_POS_LAYER0[WALL] = [0, 0];
  TILE_POS_LAYER0[STEEL] = [1, 0];
  TILE_POS_LAYER0[GRASS] = null;  // grass only on layer 1
  TILE_POS_LAYER0[WATER] = [4, 0];
  TILE_POS_LAYER0[ICE] = [3, 0];
  TILE_POS_LAYER0[HOME1] = [5, 0];
  TILE_POS_LAYER0[HOME2] = [5.5, 0];
  TILE_POS_LAYER0[HOME3] = [5, 0.5];
  TILE_POS_LAYER0[HOME4] = [5.5, 0.5];
  TILE_POS_LAYER0[HOME_BROKEN1] = [6, 0];
  TILE_POS_LAYER0[HOME_BROKEN2] = [6.5, 0];
  TILE_POS_LAYER0[HOME_BROKEN3] = [6, 0.5];
  TILE_POS_LAYER0[HOME_BROKEN4] = [6.5, 0.5];

  // Layer 1 only draws grass
  var TILE_POS_LAYER1 = [];
  TILE_POS_LAYER1[GRASS] = [2, 0];

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
    var mapDirty = false;
    for (var i = 0; i < cells.length; i++) {
      var cx = cells[i][0], cy = cells[i][1];
      if (!this.map[cy] || this.map[cy][cx] === undefined) continue;
      var p = this.map[cy][cx];
      if (p === WALL) {
        _hitWall.call(this, cx, cy);
        mapDirty = true;
        result = 'wall';
      } else if (_isHome(p)) {
        _destroyHome.call(this);
        mapDirty = true;
        result = 'home';
      } else if (p === STEEL && !result) {
        result = 'steel';
      }
    }
    // Invalidate offscreen cache when map data changes
    if (mapDirty) {
      this._cacheDirty = true;
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

  // Render the map tiles to an offscreen canvas for caching (#1)
  function _renderToCache() {
    var lookup = this.layer === 1 ? TILE_POS_LAYER1 : TILE_POS_LAYER0;
    var tileSize = this.cellWidth * this.scale;
    var mapPixelSize = tileSize * 26;

    if (!this._cacheCanvas) {
      this._cacheCanvas = document.createElement('canvas');
    }
    this._cacheCanvas.width = mapPixelSize;
    this._cacheCanvas.height = mapPixelSize;
    var cacheCtx = this._cacheCanvas.getContext('2d');

    var map = this.map;
    var cellWidth = this.cellWidth;
    var image = this.image;

    for (var y = 0; y < map.length; y++) {
      var row = map[y];
      for (var x = 0; x < row.length; x++) {
        var pos = lookup[row[x]];
        if (pos) {
          cacheCtx.drawImage(
            image,
            pos[0] * 2 * cellWidth, pos[1] * 2 * cellWidth,
            cellWidth, cellWidth,
            tileSize * x, tileSize * y,
            tileSize, tileSize
          );
        }
      }
    }

    this._cacheDirty = false;
  }

  function Map(options) {
    var opt = {};
    Util.merge(opt, options);
    Util.merge(this, opt);
    this._cacheCanvas = null;
    this._cacheDirty = true;
  }

  var proto = {};

  proto.draw = function(screen) {
    if (this.layer === 0) _drawBackground.call(this, screen);

    // Rebuild offscreen cache if dirty (initial or after bullet hit)
    if (this._cacheDirty || !this._cacheCanvas) {
      _renderToCache.call(this);
    }

    // Single drawImage from cached offscreen canvas
    screen.ctx.drawImage(this._cacheCanvas, this.offsetX, this.offsetY);
  }

  proto.hitTest = function(x1, y1, x2, y2) {
    return _hitTest.call(this, x1, y1, x2, y2);
  }

  proto.hitBullet = function(x1, y1, x2, y2, direction) {
    return _hitBullet.call(this, x1, y1, x2, y2, direction);
  }

  // Mark cache as dirty externally (e.g. gift effect)
  proto.invalidateCache = function() {
    this._cacheDirty = true;
  }

  Util.augment(Map, proto);
  exports.Map = Map;
})(this);
