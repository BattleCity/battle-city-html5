'use strict';

(function(exports, undefined) {

  function Animation(options) {
    var opt = {};
    Util.merge(opt, options);
    Util.merge(this, opt);
  }

  var proto = {};


  proto.draw = function(ctx) {
    console.log(ctx)
  }

  proto.update = function() {
  }

  proto.destroy = function() {
  }

  Util.augment(Animation, proto);
  exports.Animation = Animation;
})(this);

