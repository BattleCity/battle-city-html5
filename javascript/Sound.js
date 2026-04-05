'use strict';

(function(exports, undefined) {

  // Shared AudioContext (Web Audio API) — created once, reused by all sounds.
  // No DOM elements are created, eliminating the audio node memory leak (#7).
  var audioCtx = null;

  function _getContext() {
    if (!audioCtx) {
      var Ctor = exports.AudioContext || exports.webkitAudioContext;
      if (Ctor) {
        audioCtx = new Ctor();
      }
    }
    return audioCtx;
  }

  // Resume AudioContext on first user interaction (required by autoplay policy).
  var _resumeAttached = false;
  function _ensureResumeListener() {
    if (_resumeAttached) return;
    _resumeAttached = true;
    var events = ['click', 'touchstart', 'keydown'];
    function resume() {
      var ctx = _getContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
      for (var j = 0; j < events.length; j++) {
        document.removeEventListener(events[j], resume, true);
      }
    }
    for (var i = 0; i < events.length; i++) {
      document.addEventListener(events[i], resume, true);
    }
  }

  // ---------- WebAudioSound: lightweight wrapper per sound effect ----------
  // Provides the .play() API that all call-sites expect.

  function WebAudioSound(buffer, allowOverlap) {
    this._buffer = buffer;
    this._allowOverlap = allowOverlap;
    this._activeSource = null; // for non-overlap sounds
  }

  WebAudioSound.prototype.play = function() {
    var ctx = _getContext();
    if (!ctx || !this._buffer) return;

    // For non-overlapping sounds (move, enemy): stop previous playback first
    if (!this._allowOverlap && this._activeSource) {
      try { this._activeSource.stop(); } catch (e) {}
      this._activeSource = null;
    }

    var source = ctx.createBufferSource();
    source.buffer = this._buffer;
    source.connect(ctx.destination);
    source.start(0);

    if (!this._allowOverlap) {
      this._activeSource = source;
      var self = this;
      source.onended = function() {
        if (self._activeSource === source) {
          self._activeSource = null;
        }
      };
    }
  };

  // ---------- Fallback: HTML5 Audio (when Web Audio API is unavailable) ----------

  function Html5AudioSound(audioEl, allowOverlap) {
    this._audio = audioEl;
    this._allowOverlap = allowOverlap;
    this._channels = [audioEl];
    this._maxChannels = 6;
  }

  Html5AudioSound.prototype.play = function() {
    var channel = this._audio;

    if (this._allowOverlap) {
      // Find an idle channel
      for (var i = 0; i < this._channels.length; i++) {
        if (this._channels[i].paused || this._channels[i].ended) {
          channel = this._channels[i];
          break;
        }
      }
      // All channels busy — recycle oldest or clone a new one
      if (channel === this._audio && !this._audio.paused && !this._audio.ended) {
        if (this._channels.length >= this._maxChannels) {
          channel = this._channels[0];
        } else {
          channel = this._audio.cloneNode();
          channel.preload = 'auto';
          channel.src = this._audio.src;
          this._channels.push(channel);
          // Append to DOM so the cloned element loads properly in all browsers
          document.body.appendChild(channel);
        }
      }
    } else if (!this._audio.paused && !this._audio.ended) {
      return;
    }

    try { channel.currentTime = 0; } catch (e) {}
    channel.play();
  };

  // ---------- loader ----------

  function loader(item) {
    var that = this;
    var ctx = _getContext();
    var allowOverlap = item.id !== 'move' && item.id !== 'enemy';

    if (ctx) {
      // Web Audio API path: fetch + decodeAudioData — zero DOM elements
      var xhr = new XMLHttpRequest();
      xhr.open('GET', item.src, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          ctx.decodeAudioData(xhr.response, function(buffer) {
            _onLoaded(new WebAudioSound(buffer, allowOverlap));
          }, function(err) {
            if (typeof console !== 'undefined' && console.warn) {
              console.warn('Audio decode failed for ' + item.src, err);
            }
            _onError();
          });
        } else {
          _onError();
        }
      };
      xhr.onerror = function() { _onError(); };
      xhr.send();
    } else {
      // Fallback: HTML5 Audio (old browsers without Web Audio API)
      var audio = document.createElement('audio');
      audio.preload = 'auto';
      var settled = false;

      function settle(cb) {
        if (settled) return;
        settled = true;
        cb();
      }

      audio.oncanplay = function() {
        settle(function() {
          _onLoaded(new Html5AudioSound(audio, allowOverlap));
        });
      };
      audio.onerror = function() {
        settle(function() { _onError(); });
      };
      audio.src = item.src;
      // Append to DOM so the audio element loads properly in all browsers
      document.body.appendChild(audio);
    }

    function _onLoaded(soundWrapper) {
      that.num++;
      that.sounds[item.id] = {
        index: that.num,
        sound: soundWrapper,
        src: item.src
      };
      if (that.num === that.size()) {
        that.emit('complete', that.sounds);
      } else {
        that.emit('success', that.sounds[item.id]);
      }
    }

    function _onError() {
      // Provide a silent stub so callers can still call .play() safely
      that.num++;
      that.sounds[item.id] = {
        index: that.num,
        sound: { play: function() {} },
        src: item.src,
        failed: true
      };
      if (that.num === that.size()) {
        that.emit('complete', that.sounds);
      } else {
        that.emit('error', that.sounds[item.id]);
      }
    }
  }

  // ---------- Sound constructor ----------

  function Sound() {
    this.sounds = {};
    this.num = 0;
    Sound.sup.call(this);
  }

  var proto = {};

  proto.load = function(items) {
    var that = this;
    this.items = items;
    _ensureResumeListener();
    Util.each(this.items, function(item) {
      loader.call(that, item);
    });
    return this;
  };

  proto.size = function() {
    return this.items.length;
  };

  Util.augment(Sound, proto);
  Util.inherit(Sound, Base);
  exports.Sound = Sound;
})(this);
