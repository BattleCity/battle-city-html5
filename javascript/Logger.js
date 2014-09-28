'use strict';

(function(exports, undefined) {

  function Loader() {
    Loader.sup.call(this);
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

  Util.augment(Loader, proto);
  Util.inherit(Loader, Base);
  exports.Loader = Loader;
})(this);
