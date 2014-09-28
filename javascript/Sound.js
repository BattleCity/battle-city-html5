'use strict';

(function(exports, undefined) {

  function loader(item) {
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
      that.sounds[item.id] = {
        index: that.num,
        sound: sound,
        src: item.src
      };

      if (that.num === that.size()) {
        that.emit('complete', that.sounds);
      } else {
        that.emit('success', that.sounds[item.id]);
      }
    }
    sound.onended = function() {
      this._playing = false;
    }
    sound.src = item.src;
    document.body.appendChild(sound);
  }

  function Sound() {
    this.sounds = {};
    this.num = 0;
    Sound.sup.call(this);
  }

  var proto = {};

  proto.load = function(items) {
    var that = this;
    this.items = items;
    Util.each(this.items, function(item) {
      loader.call(that, item);
    });
    return this;
  }

  proto.size = function() {
    return this.items.length;
  }

  Util.augment(Sound, proto);
  Util.inherit(Sound, Base);
  exports.Sound = Sound;
})(this);

