'use strict';

(function(exports, undefined) {

  function Logger(options) {
    var opt = {
      fontSize: 18,
      offsetX: 10,
      offsetY: 10,
      fontWeight: 'normal',
      textAlign: 'center',
      fontStyle: 'normal',
      fontFace: 'serif',
      fillStyle: '#fff'
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Logger.sup.call(this);
  }

  var proto = {};

  proto.info = function() {
    if (!DEBUG) return;
    var contents = Util.slice.call(arguments).join('\n');
    var font = this.fontWeight + ' ' + this.fontStyle + ' ' + this.fontSize + 'px ' + this.fontFace;
    if (this.screen) {
      this.screen.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
      this.screen.ctx.fillStyle = this.fillStyle;
      this.screen.ctx.font= font;
      this.screen.ctx.fillText(contents, this.offsetX, this.fontSize + this.offsetY);
    } else if (typeof(console) !== 'undefined' && typeof(console.log) !== 'undefined'){
      console.log(contents);
    }
  }

  Util.augment(Logger, proto);
  Util.inherit(Logger, Base);
  exports.Logger = Logger;
})(this);
