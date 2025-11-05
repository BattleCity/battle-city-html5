'use strict';

(function(exports, undefined) {
  var logger = new Logger();

  function _welcomeSplashAnim(offsetX, offsetY, height, speed) {
    logger.info('Welcome splash animation start.');
    var that = this;
    var graphics = this.graphics['splash'];
    this.splash = new Sprite({
      image: graphics.image,
      offsetX: offsetX,
      offsetY: height,
      width: graphics.width,
      height: graphics.height,
      scale: this.screen.scale
    });

    this.splash.update = function() {
      if (this.offsetY > offsetY) this.offsetY -= speed * that.screen.scale;
    }
    this.screen.add(this.splash);
  }

  function _welcomePlayerAnim(offsetX, offsetY, height, speed) {
    logger.info('Welcome player animation start.');
    var that = this;
    var graphics = this.graphics['player1'];
    var playerOffsetX = offsetX + 70;
    var playerOffsetY = offsetY + 170;
    this.playerWidth = graphics.width / 8;
    this.playerHeight = graphics.height / 4;

    this.player = new Sprite({
      image: graphics.image,
      x: 0,
      y: 1,
      scale: this.screen.scale,
      width: this.playerWidth,
      height: this.playerHeight,
      offsetX: playerOffsetX,
      offsetY: height + 170
    });

    this.player.update = function() {
      this.x = this.x ? 0 : 1;

      if (that.get('status') === 'select') {
        this.offsetY = playerOffsetY + (that.playerNum === 2 ? 30 : 0);
        return;
      }

      if (this.offsetY > playerOffsetY) {
        this.offsetY -= speed * that.screen.scale;
      }
    }

    this.screen.add(this.player);
  }

  function _welcomeBindEvent(offsetY) {
    var that = this;
    Util.bind('keydown', function(e) {
      var status = that.get('status');

      if (status === 'start') return;

      if (status === 'welcome') {
        that.splash.offsetY = offsetY;
        that.player.offsetY = offsetY + 170;
        that.set('status', 'select');
        return;
      }

      if (e.keyCode === Keyboard.DOWN.keyCode) {
        that.playerNum = 2;
      } else if (e.keyCode === Keyboard.UP.keyCode) {
        that.playerNum = 1;
      } else if (e.keyCode === Keyboard.ENTER.keyCode) {
        that.start();
      }
    });
  }

  function _welcome() {
    logger.info('Welcome to tank.');

    this.set('status', 'welcome');
    this.screen.clean();

    var offsetX = (DEFAULTWIDTH - this.graphics['splash'].width) / 2;
    var offsetY = 120;
    var moveHeight = 500;
    var speed = 4;

    _welcomeSplashAnim.call(this, offsetX, offsetY, moveHeight, speed);
    _welcomePlayerAnim.call(this, offsetX, offsetY, moveHeight, speed);
    _welcomeBindEvent.call(this, offsetY);
  }

  function _initPlayer() {
    var that = this;
    var isRunning = false;
    
    // 初始化玩家生命值
    if (typeof this.player1Life === 'undefined') {
      this.player1Life = PLAYER1LIFE;
    }
    if (typeof this.player2Life === 'undefined') {
      this.player2Life = PLAYER2LIFE;
    }
    
    this.player1 = new Player({
      image: this.graphics['player1'].image,
      scale: this.screen.scale,
      width: this.playerWidth,
      height: this.playerHeight,
      offsetX: this.screen.offsetX / this.screen.scale + 2,
      offsetY: this.screen.offsetY / this.screen.scale + 2,
      x: 0,
      y: 0,
      map: this.mapLayerBottom,
      position: {
        x: 8,
        y: 24
      },
      speed: 1,
      level: 0,
      cellWidth: this.cellWidth,
      screen: this.screen,
      graphics: this.graphics,
      sounds: this.sounds,
      debug: this.debug
    });

    this.player1.update = function() {
      this.run();
    }
    
    // 监听玩家1死亡事件
    this.player1.on('die', function() {
      that.player1Life--;
      that.updateBoard();
      if (that.player1Life > 0) {
        setTimeout(function() {
          that._respawnPlayer1();
        }, 2000);
      } else {
        that._checkGameOver();
      }
    });

    this.screen.add(this.player1);

    Keyboard.S.down(function() {
      if (that.get('status') === 'playing') {
        that.player1.forward('down');
      }
    });
    Keyboard.W.down(function() {
      if (that.get('status') === 'playing') {
        that.player1.forward('up');
      }
    });
    Keyboard.A.down(function() {
      if (that.get('status') === 'playing') {
        that.player1.forward('left');
      }
    });
    Keyboard.D.down(function() {
      if (that.get('status') === 'playing') {
        that.player1.forward('right');
      }
    });
    Keyboard.SPACE.press(function() {
      if (that.get('status') === 'playing') {
        that.player1.shot();
      }
    });

    if (this.playerNum === 2) {
      this.player2 = new Player({
        image: this.graphics['player2'].image,
        scale: this.screen.scale,
        width: this.playerWidth,
        height: this.playerHeight,
        offsetX: this.screen.offsetX / this.screen.scale + 2,
        offsetY: this.screen.offsetY / this.screen.scale + 2,
        x: 0,
        y: 0,
        map: this.mapLayerBottom,
        position: {
          x: 16,
          y: 24
        },
        level: 0,
        speed: 2,
        cellWidth: this.cellWidth,
        screen: this.screen,
        graphics: this.graphics,
        sounds: this.sounds,
        debug: this.debug
      });

      this.player2.update = function() {
        this.run();
      }
      
      // 监听玩家2死亡事件
      this.player2.on('die', function() {
        that.player2Life--;
        that.updateBoard();
        if (that.player2Life > 0) {
          setTimeout(function() {
            that._respawnPlayer2();
          }, 2000);
        } else {
          that._checkGameOver();
        }
      });

      this.screen.add(this.player2);

      Keyboard.DOWN.down(function() {
        if (that.get('status') === 'playing') {
          that.player2.forward('down');
        }
      });
      Keyboard.UP.down(function() {
        if (that.get('status') === 'playing') {
          that.player2.forward('up');
        }
      });
      Keyboard.LEFT.down(function() {
        if (that.get('status') === 'playing') {
          that.player2.forward('left');
        }
      });
      Keyboard.RIGHT.down(function() {
        if (that.get('status') === 'playing') {
          that.player2.forward('right');
        }
      });
      Keyboard.SPACE.down(function() {
        if (that.get('status') === 'playing') {
          that.player2.shot();
        }
      });
    }
  }

  function _initEnemy() {
    // 初始化敌人数量
    if (typeof this.enemyKilled === 'undefined') {
      this.enemyKilled = 0;
    }
    if (typeof this.enemyTotal === 'undefined') {
      this.enemyTotal = ENEMYNUM;
    }
    _generateEnemy.call(this);
  }

  function _generateEnemy() {
    // 检查已生成的敌人总数
    var currentEnemies = 0;
    for (var i = 0; i < this.screen._displayList.length; i++) {
      var obj = this.screen._displayList[i];
      if (obj.constructor && obj.constructor.name === 'Enemy' && !obj.destroyed) {
        currentEnemies++;
      }
    }
    
    // 计算还需要生成多少个敌人
    var remainingEnemies = (this.enemyTotal || ENEMYNUM) - (this.enemyKilled || 0) - currentEnemies;
    if (remainingEnemies <= 0) return;
    
    var num = Math.min(3, remainingEnemies);
    while(num--) {
      switch (num) {
        case 2:
          var x = 0;
          break;
        case 1:
          var x = 12;
          break;
        case 0:
          var x = 24;
          break;
      }
      var enemy = new Enemy({
        image: this.graphics['enemy'].image,
        scale: this.screen.scale,
        width: this.playerWidth,
        height: this.playerHeight,
        offsetX: this.screen.offsetX / this.screen.scale + 2,
        offsetY: this.screen.offsetY / this.screen.scale + 2,
        x: 0,
        y: 0,
        map: this.mapLayerBottom,
        position: {
          x: x,
          y: 0
        },
        direction: 'down',
        speed: 1,
        level: 0,
        cellWidth: this.cellWidth,
        screen: this.screen,
        graphics: this.graphics,
        sounds: this.sounds,
        debug: this.debug
      });

      enemy.update = function() {
        this.run();
        this.forward();
      }
      
      // 监听敌人死亡事件
      var that = this;
      enemy.on('die', function() {
        that.enemyKilled++;
        that.updateBoard();
        that._checkGameWin();
        // 如果敌人数量不足，生成新敌人
        var currentEnemies = 0;
        for (var i = 0; i < that.screen._displayList.length; i++) {
          var obj = that.screen._displayList[i];
          if (obj.constructor && obj.constructor.name === 'Enemy' && !obj.destroyed) {
            currentEnemies++;
          }
        }
        if (currentEnemies < 3 && that.enemyKilled < that.enemyTotal) {
          setTimeout(function() {
            _generateEnemy.call(that);
          }, 2000);
        }
      });

      this.screen.add(enemy);
    }
  }

  function _initBoard() {
    var that = this;
    this.board = new Board({
      scale: this.screen.scale,
      graphics: this.graphics,
      screen: this.screen,
      playerNum: this.playerNum,
      enemyNum: this.enemy,
      offsetX: this.screen.offsetX + this.cellWidth * 26 * this.screen.scale + 15 * this.screen.scale,
      offsetY: this.screen.offsetY + 15 * this.screen.scale
    });
    
    // 更新计分板数据的方法
    this.updateBoard = function() {
      if (that.board) {
        that.board.player1Life = that.player1Life;
        that.board.player2Life = that.player2Life;
        that.board.stage = that.stage;
        that.board.enemyNum = (that.enemyTotal || ENEMYNUM) - (that.enemyKilled || 0);
      }
    };
    
    this.screen.add(this.board);
  }

  function _mapRenderLayerBottom() {
    logger.info('Render bottom map.');
    var that = this;
    var graphics = this.graphics['tile'];
    this.mapLayerBottom = new Map({
      layer: 0,
      map: this.map,
      width: this.screen.width,
      height: this.screen.height,
      cellWidth: this.cellWidth,
      offsetX: this.screen.offsetX,
      offsetY: this.screen.offsetY,
      image: graphics.image,
      scale: this.screen.scale
    });
    
    // 监听基地被摧毁事件
    this.mapLayerBottom.onHomeDestroyed = function() {
      that._onHomeDestroyed();
    };
    
    this.screen.add(this.mapLayerBottom);
  }

  function _mapRenderLayerTop() {
    logger.info('Render top map.');
    var graphics = this.graphics['tile'];
    this.screen.add(new Map({
      layer: 1,
      map: this.map,
      width: this.screen.width,
      height: this.screen.height,
      cellWidth: this.cellWidth,
      offsetX: this.screen.offsetX,
      offsetY: this.screen.offsetY,
      image: graphics.image,
      scale: this.screen.scale
    }));
  }

  function _stageAnim() {
    var that = this;
    var width = that.screen.width;
    var height = that.screen.height / 2;
    var scale = that.screen.scale;
    var diff = 0;
    var counter = 0;
    var graphics = this.graphics['num'];
    var anim = new DisplayObject({});

    setTimeout(function() {
      _initBoard.call(that);
    }, 800);

    anim.draw = function(screen) {
      if (parseInt(height - diff) === that.screen.offsetY) {
        this.destroy();
      };

      screen.ctx.save();
      screen.ctx.fillStyle='#7f7f7f';
      screen.ctx.fillRect(0, 0, width, height - diff);
      screen.ctx.fillRect(0, height + diff, width, height - diff);
      screen.ctx.restore();

      if (counter < 20 * scale) {
        screen.ctx.save();
        screen.ctx.translate(that.screen.width / 2, that.screen.height / 2);
        screen.ctx.drawImage(graphics.image, 0, 0, graphics.width / 10, graphics.height, 0, 0, graphics.width / 10 * scale, graphics.height * scale);
        screen.ctx.restore();
      } else {
        diff += 5 * scale;
      }
      counter ++;
    }
    this.screen.add(anim);
  }


  function Application(options) {
    Application.sup.call(this);
    var opt = {
      screen: null,
      graphics: null,
      sounds: null,
      stage: 0,
      player1: 3,
      player2: 3,
      enemy: 20,
      playerNum: 1,
      cellWidth: 0,
      debug: false
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    // 关联Application到Screen，用于暂停状态检查
    if (this.screen) {
      this.screen.app = this;
    }
    window.sss = this.screen;
  }

  var proto = {};

  proto.init = function() {
    logger.info('Application initial.');
    this.cellWidth = this.graphics['tile'].height / 2;
    Keyboard.run(function () {
      Keyboard.simulate();
    });
    _welcome.call(this);
  }

  proto.start = function() {
    logger.info('Application start.');
    this.screen.clean();
    this.set('status', 'playing');
    this.sounds['start'].sound.play();
    this.map = Resource.MAPS[this.stage];
    logger.info('Stage ' + this.stage + ' start.');
    _mapRenderLayerBottom.call(this);
    _initPlayer.call(this);
    _initEnemy.call(this);
    _mapRenderLayerTop.call(this);
    _stageAnim.call(this);
    
    // 初始化计分板
    if (this.board) {
      this.updateBoard();
    }
    
    // 绑定暂停键
    var that = this;
    Keyboard.P.press(function() {
      that.pause();
    });
  }

  proto._respawnPlayer1 = function() {
    if (this.player1 && !this.player1.destroyed) {
      this.player1.destroy();
    }
    var that = this;
    this.player1 = new Player({
      image: this.graphics['player1'].image,
      scale: this.screen.scale,
      width: this.playerWidth,
      height: this.playerHeight,
      offsetX: this.screen.offsetX / this.screen.scale + 2,
      offsetY: this.screen.offsetY / this.screen.scale + 2,
      x: 0,
      y: 0,
      map: this.mapLayerBottom,
      position: {
        x: 8,
        y: 24
      },
      speed: 1,
      level: 0,
      cellWidth: this.cellWidth,
      screen: this.screen,
      graphics: this.graphics,
      sounds: this.sounds,
      debug: this.debug
    });
    this.player1.update = function() {
      this.run();
    }
    this.player1.on('die', function() {
      that.player1Life--;
      if (that.player1Life > 0) {
        setTimeout(function() {
          that._respawnPlayer1();
        }, 2000);
      } else {
        that._checkGameOver();
      }
    });
    this.screen.add(this.player1);
  }

  proto._respawnPlayer2 = function() {
    if (this.player2 && !this.player2.destroyed) {
      this.player2.destroy();
    }
    var that = this;
    this.player2 = new Player({
      image: this.graphics['player2'].image,
      scale: this.screen.scale,
      width: this.playerWidth,
      height: this.playerHeight,
      offsetX: this.screen.offsetX / this.screen.scale + 2,
      offsetY: this.screen.offsetY / this.screen.scale + 2,
      x: 0,
      y: 0,
      map: this.mapLayerBottom,
      position: {
        x: 16,
        y: 24
      },
      level: 0,
      speed: 2,
      cellWidth: this.cellWidth,
      screen: this.screen,
      graphics: this.graphics,
      sounds: this.sounds,
      debug: this.debug
    });
    this.player2.update = function() {
      this.run();
    }
    this.player2.on('die', function() {
      that.player2Life--;
      if (that.player2Life > 0) {
        setTimeout(function() {
          that._respawnPlayer2();
        }, 2000);
      } else {
        that._checkGameOver();
      }
    });
    this.screen.add(this.player2);
  }

  proto._onHomeDestroyed = function() {
    logger.info('Home base destroyed!');
    this.sounds['lose'].sound.play();
    setTimeout(function() {
      this._showGameOver();
    }.bind(this), 1000);
  }

  proto._checkGameOver = function() {
    var allPlayersDead = false;
    if (this.playerNum === 1) {
      allPlayersDead = this.player1Life <= 0;
    } else {
      allPlayersDead = this.player1Life <= 0 && this.player2Life <= 0;
    }
    
    if (allPlayersDead) {
      this.sounds['lose'].sound.play();
      setTimeout(function() {
        this._showGameOver();
      }.bind(this), 1000);
    }
  }

  proto._checkGameWin = function() {
    if (this.enemyKilled >= this.enemyTotal) {
      this.sounds['end'].sound.play();
      setTimeout(function() {
        this._showGameWin();
      }.bind(this), 1000);
    }
  }

  proto._showGameOver = function() {
    logger.info('Game Over');
    this.set('status', 'gameover');
    this.screen.clean();
    // 显示游戏结束画面
    var graphics = this.graphics['gameover'];
    var gameOverSprite = new Sprite({
      image: graphics.image,
      offsetX: (DEFAULTWIDTH - graphics.width) / 2,
      offsetY: (DEFAULTHEIGHT - graphics.height) / 2,
      width: graphics.width,
      height: graphics.height,
      scale: this.screen.scale
    });
    this.screen.add(gameOverSprite);
    
    // 3秒后重新开始
    setTimeout(function() {
      this.restart();
    }.bind(this), 3000);
  }

  proto._showGameWin = function() {
    logger.info('Stage Complete!');
    this.set('status', 'win');
    // 可以在这里添加下一关逻辑
    setTimeout(function() {
      this.stage++;
      if (this.stage >= Resource.MAPS.length) {
        this.stage = 0; // 循环关卡
      }
      this.start();
    }.bind(this), 2000);
  }

  proto.pause = function() {
    var status = this.get('status');
    if (status === 'playing') {
      this.set('status', 'paused');
      this.sounds['pause'].sound.play();
      logger.info('Game Paused');
    } else if (status === 'paused') {
      this.set('status', 'playing');
      this.sounds['pause'].sound.play();
      logger.info('Game Resumed');
    }
  }

  proto.restart = function() {
    this.end();
    // 重置状态
    this.player1Life = PLAYER1LIFE;
    this.player2Life = PLAYER2LIFE;
    this.enemyKilled = 0;
    this.enemyTotal = ENEMYNUM;
    this.stage = STARTSTAGE;
    this.init();
  }

  proto.end = function() {
    this.set('status', 'end');
    this.screen.clean();
  }

  Util.augment(Application, proto);
  Util.inherit(Application, Base);
  exports.Application = Application;
})(this);
