'use strict';

(function(exports, undefined) {

  function Explostion(options) {
    var opt = {
      type: 'tank',
      scale: 1,
      screen: null,
      graphics: null,
      sounds: null,
      baseWidth: 28,
      baseHeight: 28
    };
    Util.merge(opt, options);

    opt.centerX = opt.offsetX;
    opt.centerY = opt.offsetY;
    _applyFrame(opt, _getFrames(opt)[0]);

    Util.merge(this, opt);
    Explostion.sup.call(this, opt);
    this.init();
  }

  function _applyFrame(target, frame) {
    target.image = frame.image;
    target.sourceWidth = frame.sourceWidth;
    target.sourceHeight = frame.sourceHeight;
    target.width = frame.width;
    target.height = frame.height;
    target.offsetX = target.centerX - target.width / 2;
    target.offsetY = target.centerY - target.height / 2;
  }

  function _getFrames(options) {
    var baseWidth = options.baseWidth;
    var baseHeight = options.baseHeight;

    switch (options.type) {
      case 'tank':
      case 'home':
        return [
          {
            image: options.graphics['explode1'].image,
            sourceWidth: options.graphics['explode1'].width,
            sourceHeight: options.graphics['explode1'].height,
            width: baseWidth,
            height: baseHeight,
            duration: 4
          },
          {
            image: options.graphics['explode2'].image,
            sourceWidth: options.graphics['explode2'].width,
            sourceHeight: options.graphics['explode2'].height,
            width: Math.round(baseWidth * 1.35),
            height: Math.round(baseHeight * 1.35),
            duration: 8
          }
        ];
      case 'wall':
      case 'steel':
      case 'shield':
      case 'bullet':
      default:
        return [
          {
            image: options.graphics['explode1'].image,
            sourceWidth: options.graphics['explode1'].width,
            sourceHeight: options.graphics['explode1'].height,
            width: Math.round(baseWidth),
            height: Math.round(baseHeight),
            duration: 6
          }
        ];
    }
  }

  var proto = {};

  proto.init = function() {
    this._counter = 0;
    this._frameIndex = 0;
    this._frames = _getFrames(this);
    this.boom();
  }

  proto.boom = function() {
    switch (this.type) {
      case 'tank':
      case 'home':
        this.sounds['explosion'].sound.play();
        break;
      case 'wall':
        this.sounds['hitit'].sound.play();
        break;
      default:
        this.sounds['hitnone'].sound.play();
        break;
    }
  }

  proto.update = function() {
    this._counter++;
    if (this._counter >= this._frames[this._frameIndex].duration) {
      this._counter = 0;
      this._frameIndex++;
      if (this._frameIndex >= this._frames.length) {
        this.destroy();
        return;
      }
      _applyFrame(this, this._frames[this._frameIndex]);
    }

    if (this._frameIndex >= this._frames.length) {
      this.destroy();
    }
  }

  proto._draw = function(screen) {
    screen.ctx.drawImage(
      this.image,
      0,
      0,
      this.sourceWidth,
      this.sourceHeight,
      0,
      0,
      this.width * this.scale,
      this.height * this.scale
    );
  }

  Util.augment(Explostion, proto);
  Util.inherit(Explostion, Sprite);
  exports.Explostion = Explostion;
})(this);
