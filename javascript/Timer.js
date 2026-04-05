'use strict';

(function(exports, undefined) {
  var global = exports;

  global.requestAnimationFrame = Util.requestAnimationFrame;

  var FIXED_STEP = 1000 / 60;  // ~16.67ms fixed timestep
  var MAX_DELTA = FIXED_STEP * 5;  // Cap to prevent spiral of death

  function Timer(fps) {
    this.paused = false;
    this.fps = fps;
    this._lastTime = 0;
    this._accumulator = 0;
    this.init();
  }

  function _listen(target) {
    var that = this;
    var updateFn = target.update ? function() { target.update(); } : target;

    // Bind loop once to avoid creating closures each frame (#34)
    this.loop = function(timestamp) {
      if (!timestamp) timestamp = Date.now();

      if (that._lastTime === 0) {
        that._lastTime = timestamp;
      }

      var delta = timestamp - that._lastTime;
      that._lastTime = timestamp;

      // Cap delta to prevent large jumps after tab switching
      if (delta > MAX_DELTA) delta = MAX_DELTA;

      if (!that.paused) {
        that._accumulator += delta;
        // Fixed timestep updates (#12)
        while (that._accumulator >= FIXED_STEP) {
          updateFn();
          that._accumulator -= FIXED_STEP;
        }
      }

      if (that.fps) {
        global.setTimeout(that.loop, 1000 / that.fps);
      } else {
        global.requestAnimationFrame(that.loop);
      }
    };
    return this;
  }

  var proto = {};

  proto.init = function() {

  }

  proto.listen = function(target) {
    return _listen.call(this, target);
  }

  proto.start = function() {
    this._lastTime = 0;
    this._accumulator = 0;
    this.loop();
  }

  proto.pause = function() {
    this.paused = true;
  }

  proto.go = function() {
    this.paused = false;
    this._lastTime = 0; // Reset to avoid large delta on resume
    this._accumulator = 0;
  }

  Util.augment(Timer, proto);
  exports.Timer = Timer;
})(this);
