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
    var that = this;
    var tempArr = [];
    this.clear();
    Util.each(this._displayList, function(i) {
      if (i.destroyed) return;
      tempArr.push(i);
      i.draw && i.draw(that);
    });
    this._displayList = tempArr;
  }

  proto.add = function(item) {
    this._displayList.push(item);
  }

  proto.clean = function() {
    this._displayList = [];
  }

  Util.augment(Screen, proto);
  exports.Screen = Screen;
})(this);
