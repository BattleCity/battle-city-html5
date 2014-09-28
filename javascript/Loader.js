'use strict';

(function(exports, undefined) {

  function Logger() {
    Logger.sup.call(this);
  }

  var proto = {};

  Util.augment(Logger, proto);
  Util.inherit(Logger, Base);
  exports.Logger = Logger;
})(this);
