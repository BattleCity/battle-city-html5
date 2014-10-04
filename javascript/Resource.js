'use strict';

(function(exports, undefined) {

  var GRAPHICS = 'bonus born bullet enemy explode1 explode2 flag gameover misc num player1 player2 shield splash tile'.split(' ');
  var SOUNDS = 'add appear blast dead eat end enemy explosion fire hitit hitnone lose move pause start statistics'.split(' ');



  var map1 = [
    [0,0,0,0,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,0,0,2,2,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,2,2,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,2,2,1,1,0,0],
    [0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,2,2,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0],
    [3,3,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,1,1,3,3,1,1,2,2],
    [3,3,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,1,1,3,3,1,1,2,2],
    [3,3,3,3,0,0,0,0,0,0,1,1,0,0,0,0,2,2,0,0,3,3,0,0,0,0],
    [3,3,3,3,0,0,0,0,0,0,1,1,0,0,0,0,2,2,0,0,3,3,0,0,0,0],
    [0,0,1,1,1,1,1,1,3,3,3,3,3,3,2,2,0,0,0,0,3,3,1,1,0,0],
    [0,0,1,1,1,1,1,1,3,3,3,3,3,3,2,2,0,0,0,0,3,3,1,1,0,0],
    [0,0,0,0,0,0,2,2,3,3,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,0,0,0,0,2,2,3,3,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [2,2,1,1,0,0,2,2,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0],
    [2,2,1,1,0,0,2,2,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,2,2,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,2,2,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,0,1,6,7,1,0,0,0,1,1,1,1,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,0,1,8,9,1,0,0,0,1,1,1,1,1,1,0,0],
  ];

  var MAPS = [map1];
  function Resource(graphics) {
    this.graphics = [];
    this.sounds = [];
    this.maps = [];
  }

  var proto = Resource.prototype;

  proto.addGraphic = function(id) {
    this.graphics.push({
      type: 'graphic',
      id: id,
      src: GRAPHICESDIR + id + GRAPHICSUFFIX
    });
  }

  proto.loadGraphics = function(arr) {
    var that = this;
    Util.each(arr, function(i) {
      that.addGraphic(i);
    })
    return this.graphics;
  }

  proto.addSound = function(id) {
    this.sounds.push({
      type: 'sound',
      id: id,
      src: SOUNDDIR + id + SOUNDSUFFIX
    });
  }

  proto.loadSounds = function(arr) {
    var that = this;
    Util.each(arr, function(i) {
      that.addSound(i);
    });
    return this.sounds;
  }

  proto.addMap = function(i) {
    this.maps.push(i);
  }

  proto.loadMaps = function(arr) {
    var that = this;
    Util.each(arr, function(i) {
      that.addMap(i);
    });
    return this.maps;
  }

  var instance = new Resource();
  var R = {};

  R.GRAPHICS = instance.loadGraphics(GRAPHICS);
  R.SOUNDS = instance.loadSounds(SOUNDS);
  R.MAPS = instance.loadMaps(MAPS);

  exports.Resource = R;
})(this);
