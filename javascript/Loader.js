'use strict';

(function(exports, undefined) {

  function SourceLoader() {
    SourceLoader.sup.call(this);
    this.query = [];
    this.num = 0;
    this.graphicsHash = {};
    this.soundHash = {};
    this.size = 0;
    return this;
  }

  function _imageLoader(item) {
    var that = this;
    var image = new Image();
    image.crossOrigin = '*';
    image.onload = function() {
      that.num ++;
      that.graphicsHash[item.id] = {
        image: image,
        width: image.width,
        height: image.height
      };

      if (that.num === that.size) {
        that.emit('complete', {
          graphics: that.graphicsHash,
          sounds: that.soundHash
        });
      } else {
        that.emit('success', {
          index: that.num,
          item: image,
          src: item.src,
          type: item.type
        });
      }
    }
    image.src = item.src;
  }

  function _soundLoader(item) {
    var that = this;
    var sound = document.createElement('audio');
    var _play = sound.play;
    sound.play = function() {
      if (this._playing) return;
      this.load();
      _play.call(this);
      this._playing = true;
    }
    sound.preload = 'auto';
    sound.oncanplay = function() {
      that.num ++;
      that.soundHash[item.id] = {
        sound: sound
      };

      if (that.num === that.size) {
        that.emit('complete', {
          graphics: that.graphicsHash,
          sounds: that.soundHash
        });
      } else {
        that.emit('success', {
          index: that.num,
          item: sound,
          src: item.src,
          type: item.type
        });
      }
    }
    sound.onended = function() {
      this._playing = false;
    }
    sound.src = item.src;
    document.body.appendChild(sound);
  }

  var proto = {};

  proto.load = function(query) {
    var that = this;
    Util.each(query, function(i) {
      if (i.type === 'graphic') {
        _imageLoader.call(that, i);
      } else if (i.type === 'sound') {
        _soundLoader.call(that, i);
      }
    });
    this.size += query.length;
    return this;
  }

  Util.augment(SourceLoader, proto);
  Util.inherit(SourceLoader, Base);
  exports.SourceLoader = SourceLoader;
})(this);
