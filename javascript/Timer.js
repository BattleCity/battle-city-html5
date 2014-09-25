'use strict';

(function(exports, undefined) {
  var global = exports;

  global.requestAnimationFrame = Util.requestAnimationFrame;

  function Timer(fps) {
    this.paused = false;
    this.fps = fps;
    this.init();
  }

  function _listen(target) {
    var that = this;
    this.loop = function() {
      if (!that.paused) target.update ? target.update() : target();
      global[that.fps ? 'setTimeout' : 'requestAnimationFrame'].call(global, function() {
        that.loop();
      }, 1000 / that.fps);
    }
    return this;
  }

  var proto = {};

  proto.init = function() {

  }

  proto.listen = function(target) {
    return _listen.call(this, target);
  }

  proto.start = function() {
    this.loop();
  }

  proto.pause = function() {
    this.pause = true;
  }

  proto.go = function() {
    this.pause = false;
  }

  Util.augment(Timer, proto);
  exports.Timer = Timer;
})(this);

