'use strict';

(function(exports, undefined) {

  function loader(item) {
    var that = this;
    var sound = document.createElement('audio');
    var nativePlay = sound.play;
    var allowOverlap = item.id !== 'move' && item.id !== 'enemy';
    var maxChannels = 6;
    var settled = false;

    function settle(callback) {
      if (settled) return;
      settled = true;
      callback();
    }

    sound.play = function() {
      var channel = this;

      if (allowOverlap) {
        if (!this._channels) {
          this._channels = [this];
        }

        for (var i = 0; i < this._channels.length; i++) {
          if (this._channels[i].paused || this._channels[i].ended) {
            channel = this._channels[i];
            break;
          }
        }

        if (channel === this && !this.paused && !this.ended) {
          if (this._channels.length >= maxChannels) {
            channel = this._channels[0];
          } else {
            channel = this.cloneNode();
            channel.preload = 'auto';
            channel.src = this.src;
            this._channels.push(channel);
            document.body.appendChild(channel);
            // Clean up DOM node when playback ends to prevent memory leak (#7)
            var channels = this._channels;
            channel.addEventListener('ended', function onEnded() {
              channel.removeEventListener('ended', onEnded);
              if (channels.length > 1) {
                var idx = channels.indexOf(channel);
                if (idx > 0) { // keep original at index 0
                  channels.splice(idx, 1);
                  if (channel.parentNode) {
                    channel.parentNode.removeChild(channel);
                  }
                }
              }
            });
          }
        }
      } else if (!this.paused && !this.ended) {
        return;
      }

      try {
        channel.currentTime = 0;
      } catch (e) {}

      nativePlay.call(channel);
    }
    sound.preload = 'auto';
    sound._channels = [sound];

    sound.oncanplay = function() {
      settle(function() {
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
      });
    }
    sound.onerror = function() {
      settle(function() {
        that.num ++;
        that.sounds[item.id] = {
          index: that.num,
          sound: sound,
          src: item.src,
          failed: true
        };

        if (that.num === that.size()) {
          that.emit('complete', that.sounds);
        } else {
          that.emit('error', that.sounds[item.id]);
        }
      });
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
