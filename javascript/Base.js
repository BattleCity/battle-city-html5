'use strict';

(function(exports, undefined) {

  function _emit(type, data) {
    var handlers = Util.slice.call(this._notifyHash[type]);
    for (var i = 0, l = handlers.length; i < l; i++) {
      var j = Util.extend({}, handlers[i]);
      var scope = (j.scope) ? j.scope : this;
      j.scope = scope;
      j.handler.call(j.scope, data, j);
    }
  };

  function _detach(type) {
    var handlers = this._notifyHash;
    if (type) {
      delete handlers[type];
    } else {
      this._notifyHash = {};
    }
  };

  function _bind(key, handle) {
    var events = key.split(' ');
    for (var i = 0, l = events.length; i < l; i++) {
      var t = events[i];
      if (!this._notifyHash[t]) {
        this._notifyHash[t] = [];
      }
      this._notifyHash[t].push({
        'handler': handle,
        'type': t
      });
    }
  }

  function Base() {
    this._dataHash = {};
    this._notifyHash = {};
  };

  var proto = {};

  proto.on = function(arg1, arg2) {
    if (Util.type(arg1) === 'object') {
      for (var j in arg1) {
        _bind.call(this, j, arg1[j]);
      }
    } else {
      _bind.call(this, arg1, arg2);
    }
    return this;
  };

  proto.emit = function(types, data) {
    var items = types.split(' ');
    for (var i = 0, l = items.length; i < l; i++) {
      var type = items[i];
      if (this._notifyHash[type]) {
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
    this._dataHash[id] = value;
  };

  proto.get = function(id) {
    return this._dataHash[id];
  };

  proto.has = function(id) {
    return !!this._dataHash[id];
  };

  proto.all = function() {
    return this._dataHash;
  };

  proto.remove = function(id){
    if(this._dataHash[id]) delete this._dataHash[id];
  };

  Util.augment(Base, proto);
  exports.Base = Base;
})(this);
