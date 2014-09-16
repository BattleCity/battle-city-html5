'use strict';

(function(exports, undefined) {

  function Screen(container, scale) {
    this.container = Util.$(container);
    this.scale = scale;
    this.width = DEFAULTWIDTH * scale;
    this.height = DEFAULTHEIGHT * scale;
    this.offsetX = this.width / 25;
    this.offsetY = this.height / 12.5;
    this.displayObjectList = [];
    this.init();
  }

  var proto = {};

  proto.init = function() {
    if (!this.container) return;
    this.ctx = this.container.getContext('2d');
    this.container.width = this.width;
    this.container.height = this.height;
  }

  proto.clear = function() {
    this.ctx.clearRect(OFFSETX * this.scale, OFFSETY * this.scale, this.width, this.height);
  }

  proto.update = function() {
    var that = this;
    this.clear();
    Util.each(this.displayObjectList, function(i) {
      i.draw(that.ctx);
      i.update();
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
