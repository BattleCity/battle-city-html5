'use strict';

(function(exports, undefined) {
  function Sound(src, preload) {
    this.src = src;
    this.element = document.createElement('audio');
    this.element.preload = preload;
    this.element.src = src;
    Sound.sup.call(this);
    return this;
  }

  var proto = {};

  proto.load = function() {
    Util.bind(this.element, 'canplay', function() {
      console.log(this.element)
    });
  }

  proto.play = function() {
    return;
    this.element.play();
  }

  proto.stop = function() {
    this.element.pause();
  }
  Util.augment(Sound, proto);
  Util.inherit(Sound, Base);
  exports.Sound = Sound;
})(this);
