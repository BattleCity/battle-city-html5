'use strict';

(function(exports, undefined) {

  function _emit(type, data) {
    var handlers = Util.slice.call(this.NotifyHash[type]);

    for (var i = 0, l = handlers.length; i < l; i++) {
      var j = Util.extend({}, handlers[i]);
      var scope = (j.scope) ? j.scope : this;
      j.scope = scope;
      j.handler.call(j.scope, data, j);
    }
  };

  function _detach(type) {
    var handlers = this.NotifyHash;
    if (type) {
      delete handlers[type];
    } else {
      this.NotifyHash = {};
    }
  };

  function _bind(key, handle) {
    var events = key.split(' ');
    for (var i = 0, l = events.length; i < l; i++) {
      var t = events[i];

      if (!this.NotifyHash[t]) {
        this.NotifyHash[t] = [];
      }
      this.NotifyHash[t].push({
        'handler': handle,
        'type': t
      });
    }
  }

  function Base() {
    this.DataHash = {};
    this.NotifyHash = {};
  };

  var proto = {};

  proto.on = function(arg1,arg2) {
    if (Util.type(arg1) === 'object') {

      for (var j in arg1) {
        _bind.call(this,j,arg1[j]);
      }
    } else {
      _bind.call(this,arg1,arg2);
    }
    return this;
  };

  proto.emit = function(types, data) {
    var items = types.split(' ');
    for (var i = 0, l = items.length; i < l; i++) {
      var type = items[i];
      if (this.NotifyHash[type]) {
        _emit.call(this, type, Util.type(data) === 'undefined' ? null : data);
      }
    }
    return this;
  };

  proto.detach = function() {
    _detach.apply(this, arguments);
    return this;
  };

  proto.set = function(id, value) {
    this.DataHash[id] = value;
  };

  proto.get = function(id) {
    return this.DataHash[id];
  };

  proto.has = function(id) {
    return !!this.DataHash[id];
  };

  proto.all = function() {
    return this.DataHash;
  };

  proto.remove = function(id){
    if(this.DataHash[id]) delete this.DataHash[id];
  };

  Util.augment(Base, proto);
  exports.Base = Base;
})(this);
