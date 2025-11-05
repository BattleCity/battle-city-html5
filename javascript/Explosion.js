'use strict';

(function(exports, undefined) {
  function Explostion(options) {
    var opt = {
      target: null // 被击中的目标（坦克）
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Sound.sup.call(this);
    this.init();
  }

  var proto = {};

  proto.init = function() {
    this.boom();
    // 如果击中坦克，处理坦克受伤
    if (this.target && this.target.die) {
      this.target.die();
    }
  }

  proto.boom = function() {
    switch (this.type) {
      case 'wall':
        this.sounds['hitit'].sound.play();
        break;
      case 'home':
        this.sounds['explosion'].sound.play();
        // 显示爆炸动画
        this.showExplosion();
        break;
      case 'player':
      case 'enemy':
        this.sounds['blast'].sound.play();
        // 显示爆炸动画
        this.showExplosion();
        break;
      default:
        this.sounds['hitnone'].sound.play();
        break;
    }
  }

  proto.showExplosion = function() {
    var that = this;
    var graphics = this.graphics['explode1'];
    var counter = 0;
    var explosionAnim = new Sprite({
      offsetX: this.offsetX - graphics.width / 8,
      offsetY: this.offsetY - graphics.height / 2,
      image: graphics.image,
      height: graphics.height,
      width: graphics.width / 4,
      x: 0,
      y: 0,
      scale: this.scale || 1
    });

    explosionAnim.update = function() {
      counter++;
      if (counter % 5 === 0) {
        this.x++;
        if (this.x >= 4) {
          this.x = 0;
        }
      }
      if (counter >= 20) {
        this.destroy();
      }
    };
    
    if (this.screen) {
      this.screen.add(explosionAnim);
    }
  }

  Util.augment(Explostion, proto);
  Util.inherit(Explostion, Sprite);
  exports.Explostion = Explostion;
})(this);

