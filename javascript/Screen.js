'use strict';

(function(exports, undefined) {

  function Screen(options) {
    this.element = Util.$(options.element);
    this.scale = options.scale;
    this.width = DEFAULTWIDTH * this.scale;
    this.height = DEFAULTHEIGHT * this.scale;
    this.offsetX = this.width / 25;
    this.offsetY = this.height / 12.5;
    this.displayObjectList = [];
    this.init();
  }

  var proto = {};

  proto.init = function() {
    if (!this.element) return;
    this.ctx = this.element.getContext('2d');
    this.element.width = this.width;
    this.element.height = this.height;
  }

  proto.clear = function() {
    this.ctx.clearRect(OFFSETX * this.scale, OFFSETY * this.scale, this.width, this.height);
  }

  proto.update = function() {
    var that = this;
    this.clear();
    Util.each(this.displayObjectList, function(i) {
      i.draw(that.ctx);
    });
  }

  proto.add = function(item) {
    this.displayObjectList.push(item);
  }

  proto.clean = function() {
    this.displayObjectList = [];
  }

  Util.augment(Screen, proto);
  exports.Screen = Screen;
})(this);
