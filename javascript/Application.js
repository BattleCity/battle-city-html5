'use strict';

(function(exports, undefined) {
  function Application(screen, resource) {
    this.screen = screen;
    this.graphics = resource;
    this.pause = false;
    this.init();
  }

  var proto = {};

  proto.init = function() {
    this.stage = new Stage(this.screen, this.graphics);
    this.stage.welcome();
  }

  proto.restart = function() {

  }

  Util.augment(Application, proto);
  exports.Application = Application;
})(this);

