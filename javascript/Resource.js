'use strict';

(function(exports, undefined) {

  var graphics = 'bonus bore bullet enemy explode1 explode2 flag gameover misc num player1 player2 shield splash tile'.split(' ');
  function Resource(graphics) {
    this.resource = [];
  }

  var proto = Resource.prototype;

  proto.add = function(id) {
    this.resource.push({
      id: id,
      src: GRAPHICESDIR + id + GRAPHICSUFFIX
    });
    return this;
  }

  proto.query = function(arr) {
    var that = this;
    Util.each(arr, function(i) {
      that.add(i);
    })
    return this;
  }

  exports.Resource = new Resource().query(graphics).resource;
})(this);

