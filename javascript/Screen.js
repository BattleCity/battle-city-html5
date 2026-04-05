'use strict';

(function(exports, undefined) {

  function Screen(options) {
    this.element = Util.$(options.element);
    this.scale = options.scale;
    this.width = DEFAULTWIDTH * this.scale;
    this.height = DEFAULTHEIGHT * this.scale;
    this.offsetX = this.width / 25;
    this.offsetY = this.height / 12.5;
    this._displayList = [];
    this._pendingAddList = [];
    this._isUpdating = false;
    // Typed object lists for fast collision lookups (#10)
    this._tanks = [];   // players + enemies
    this._bullets = [];
    this.init();
  }

  var proto = {};

  proto.init = function() {
    if (!this.element) throw new Error('lack of screen element.');
    this.ctx = this.element.getContext('2d');
    this.element.width = this.width;
    this.element.height = this.height;
  }

  proto.clear = function() {
    this.ctx.clearRect(OFFSETX * this.scale, OFFSETY * this.scale, this.width, this.height);
  }

  proto.update = function() {
    var list = this._displayList;
    this._isUpdating = true;
    this.clear();

    // In-place compaction: draw live objects and remove destroyed ones (#6)
    var writeIdx = 0;
    for (var i = 0, len = list.length; i < len; i++) {
      var item = list[i];
      if (item.destroyed) continue;
      list[writeIdx++] = item;
      if (item.draw) item.draw(this);
    }
    list.length = writeIdx;

    this._isUpdating = false;

    // Append any objects added during this frame
    if (this._pendingAddList.length) {
      for (var j = 0, pLen = this._pendingAddList.length; j < pLen; j++) {
        list.push(this._pendingAddList[j]);
      }
      this._pendingAddList.length = 0;
    }

    // Periodically clean typed lists
    this._cleanTypedLists();
  }

  proto.add = function(item) {
    if (this._isUpdating) {
      this._pendingAddList.push(item);
    } else {
      this._displayList.push(item);
    }
    // Register in typed lists (#10)
    if (item.type === 'player' || item.type === 'enemy') {
      this._tanks.push(item);
    } else if (item.type === 'bullet') {
      this._bullets.push(item);
    }
  }

  proto.clean = function() {
    this._displayList = [];
    this._pendingAddList = [];
    this._tanks = [];
    this._bullets = [];
  }

  // Periodic cleanup of typed lists (called during update)
  proto._cleanTypedLists = function() {
    var i, w;
    // Clean tanks
    w = 0;
    for (i = 0; i < this._tanks.length; i++) {
      if (!this._tanks[i].destroyed) this._tanks[w++] = this._tanks[i];
    }
    this._tanks.length = w;
    // Clean bullets
    w = 0;
    for (i = 0; i < this._bullets.length; i++) {
      if (!this._bullets[i].destroyed) this._bullets[w++] = this._bullets[i];
    }
    this._bullets.length = w;
  }

  Util.augment(Screen, proto);
  exports.Screen = Screen;
})(this);
