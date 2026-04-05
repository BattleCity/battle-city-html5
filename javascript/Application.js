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
    if (this._welcomeBound) return;
    this._welcomeBound = true;

    Util.bind('keydown', function(e) {
      var status = that.get('status');
      var keyCode = e.keyCode;

      if (status === 'start' || status === 'gameover' || status === 'stage-clear') return;

      if (status === 'welcome') {
        that.splash.offsetY = offsetY;
        that.player.offsetY = offsetY + 170;
        that.set('status', 'select');

        if (keyCode === Keyboard.DOWN.keyCode) {
          that.playerNum = 2;
        } else if (keyCode === Keyboard.UP.keyCode) {
          that.playerNum = 1;
        } else {
          return;
        }
      }

      if (keyCode === Keyboard.DOWN.keyCode) {
        that.playerNum = 2;
      } else if (keyCode === Keyboard.UP.keyCode) {
        that.playerNum = 1;
      } else if (keyCode === Keyboard.ENTER.keyCode) {
        that.start();
      }
    });
  }

  function _welcome() {
    logger.info('Welcome to tank.');

    this.playerNum = 1;
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

  var MAX_ACTIVE_ENEMIES = 4;
  var SPAWN_POSITIONS = [0, 12, 24];
  var PLAYER_SPAWNS = {
    player1: {
      x: 8,
      y: 24
    },
    player2: {
      x: 16,
      y: 24
    }
  };
  var STAGE_ENEMY_QUEUES = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
  ];

  function _cloneMap(map) {
    var copied = [];
    for (var i = 0; i < map.length; i++) {
      copied.push(map[i].slice());
    }
    return copied;
  }

  function _buildEnemyQueue(stage, total) {
    var queue = STAGE_ENEMY_QUEUES[stage] ? STAGE_ENEMY_QUEUES[stage].slice() : [];
    while (queue.length < total) {
      queue.push(Math.floor(Math.random() * 4));
    }
    return queue.slice(0, total);
  }

  function _isActivePlayer(player) {
    return !!(player && !player.destroyed && !player.dead);
  }

  function _updateBoardState(app) {
    if (!app.board) return;
    app.board.enemyNum = (app._enemyQueue ? app._enemyQueue.length : 0) + _countLiveEnemies(app);
    app.board.player1Lives = app.player1Lives;
    app.board.player2Lives = app.player2Lives;
    app.board.stage = app.stage;
  }

  function _syncEnemyTargets() {
    var players = [this.player1, this.player2].filter(_isActivePlayer);
    var list = this.screen._displayList;
    for (var i = 0; i < list.length; i++) {
      if (list[i].type === 'enemy' && !list[i].destroyed) {
        list[i].players = players;
      }
    }
  }

  function _bindControls() {
    var that = this;
    if (this._controlsBound) return;
    this._controlsBound = true;

    Keyboard.S.down(function() {
      if (that.player1) that.player1.forward('down');
    });
    Keyboard.W.down(function() {
      if (that.player1) that.player1.forward('up');
    });
    Keyboard.A.down(function() {
      if (that.player1) that.player1.forward('left');
    });
    Keyboard.D.down(function() {
      if (that.player1) that.player1.forward('right');
    });
    Keyboard.SPACE.press(function() {
      if (that.player1) that.player1.shot();
    });

    Keyboard.DOWN.down(function() {
      if (that.player2) that.player2.forward('down');
    });
    Keyboard.UP.down(function() {
      if (that.player2) that.player2.forward('up');
    });
    Keyboard.LEFT.down(function() {
      if (that.player2) that.player2.forward('left');
    });
    Keyboard.RIGHT.down(function() {
      if (that.player2) that.player2.forward('right');
    });
    Keyboard.ENTER.press(function() {
      if (that.player2) that.player2.shot();
    });
  }

  function _createPlayer(slot) {
    var app = this;
    var spriteId = slot === 'player1' ? 'player1' : 'player2';
    var position = PLAYER_SPAWNS[slot];
    var player = new Player({
      app: this,
      image: this.graphics[spriteId].image,
      scale: this.screen.scale,
      width: this.playerWidth,
      height: this.playerHeight,
      offsetX: this.screen.offsetX / this.screen.scale + 2,
      offsetY: this.screen.offsetY / this.screen.scale + 2,
      x: 0,
      y: 0,
      map: this.mapLayerBottom,
      position: {
        x: position.x,
        y: position.y
      },
      speed: 1,
      level: 0,
      cellWidth: this.cellWidth,
      screen: this.screen,
      graphics: this.graphics,
      sounds: this.sounds,
      debug: this.debug,
      onDestroy: function() {
        _onPlayerDestroyed.call(app, slot);
      }
    });

    player.update = function() {
      if (this.destroyed) return;
      this.run();
    };

    this[slot] = player;
    this.screen.add(player);
    _syncEnemyTargets.call(this);
    _updateBoardState(this);
  }

  function _scheduleRespawn(slot) {
    var that = this;
    setTimeout(function() {
      if (!that.isPlaying()) return;
      _createPlayer.call(that, slot);
    }, 1000);
  }

  function _allPlayersDefeated(app) {
    var player1Out = !_isActivePlayer(app.player1) && app.player1Lives === 0;
    var player2Out = app.playerNum === 1 || (!_isActivePlayer(app.player2) && app.player2Lives === 0);
    return player1Out && player2Out;
  }

  function _showCenterText(text) {
    var overlay = new DisplayObject({});
    overlay.draw = function(screen) {
      screen.ctx.save();
      screen.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      screen.ctx.fillRect(screen.offsetX, screen.offsetY, 26 * 16 * screen.scale, 26 * 16 * screen.scale);
      screen.ctx.fillStyle = '#fff';
      screen.ctx.font = 20 * screen.scale + 'px monospace';
      screen.ctx.textAlign = 'center';
      screen.ctx.fillText(text, screen.width / 2, screen.height / 2);
      screen.ctx.restore();
    };
    this.screen.add(overlay);
  }

  function _showGameOverAnim() {
    var graphics = this.graphics['gameover'];
    var targetY = this.screen.height / 2 - graphics.height * this.screen.scale / 2;
    var anim = new Sprite({
      image: graphics.image,
      width: graphics.width,
      height: graphics.height,
      scale: this.screen.scale,
      offsetX: this.screen.width / 2 / this.screen.scale - graphics.width / 2,
      offsetY: this.screen.height / this.screen.scale,
      x: 0,
      y: 0
    });

    anim.update = function() {
      if (this.offsetY > targetY / this.scale) {
        this.offsetY -= 4;
      }
    };

    this.screen.add(anim);
  }

  function _finishStage(result) {
    var that = this;
    if (this._gameEnding) return;
    this._gameEnding = true;
    this.end();

    if (result === 'clear') {
      this.set('status', 'stage-clear');
      this.sounds['end'].sound.play();
      _showCenterText.call(this, 'STAGE ' + (this.stage + 1) + ' CLEAR');
    } else {
      this.set('status', 'gameover');
      this.sounds['lose'].sound.play();
      _showGameOverAnim.call(this);
    }

    setTimeout(function() {
      that.restart();
    }, 3200);
  }

  function _checkStageClear() {
    if (!this.isPlaying()) return;
    if (this._enemyQueue.length === 0 && _countLiveEnemies(this) === 0) {
      _finishStage.call(this, 'clear');
    }
  }

  function _onEnemyDestroyed() {
    _updateBoardState(this);
    _checkStageClear.call(this);
  }

  function _onPlayerDestroyed(slot) {
    if (this._gameEnding) return;

    this.sounds['dead'].sound.play();
    if (slot === 'player1') {
      if (this.player1Lives > 0) {
        this.player1Lives--;
        _scheduleRespawn.call(this, slot);
      }
    } else if (this.player2Lives > 0) {
      this.player2Lives--;
      _scheduleRespawn.call(this, slot);
    }

    _syncEnemyTargets.call(this);
    _updateBoardState(this);
    if (_allPlayersDefeated(this)) {
      _finishStage.call(this, 'gameover');
    }
  }

  function _initPlayer() {
    _bindControls.call(this);
    _createPlayer.call(this, 'player1');
    if (this.playerNum === 2) {
      _createPlayer.call(this, 'player2');
    }
  }

  function _countLiveEnemies(app) {
    var count = 0;
    var list = app.screen._displayList;
    for (var i = 0; i < list.length; i++) {
      if (!list[i].destroyed && list[i].type === 'enemy') count++;
    }
    return count;
  }

  function _initEnemy() {
    var app = this;
    app._spawnIndex = 0;

    // 初始同屏 4 辆，更接近 NES
    var initial = Math.min(MAX_ACTIVE_ENEMIES, app._enemyQueue.length);
    for (var i = 0; i < initial; i++) {
      _spawnOneEnemy.call(app);
    }

    // 每 1.5 秒检查一次：场上不足 4 辆且还有待生成的，则补充
    app._spawnTimer = setInterval(function() {
      if (!app.isPlaying() || app._enemyQueue.length === 0) {
        clearInterval(app._spawnTimer);
        app._spawnTimer = null;
        return;
      }
      var live = _countLiveEnemies(app);
      if (live < MAX_ACTIVE_ENEMIES) {
        _spawnOneEnemy.call(app);
      }
    }, 1500);
  }

  function _spawnOneEnemy() {
    if (!this.isPlaying() || this._enemyQueue.length === 0) return;

    var app = this;
    var spawnX = SPAWN_POSITIONS[this._spawnIndex % 3];
    var level = this._enemyQueue.shift();
    this._spawnIndex++;

    var enemy = new Enemy({
      app: this,
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
        x: spawnX,
        y: 0
      },
      direction: 'down',
      level: level,
      players: [this.player1, this.player2].filter(_isActivePlayer),
      cellWidth: this.cellWidth,
      screen: this.screen,
      graphics: this.graphics,
      sounds: this.sounds,
      debug: this.debug,
      onDestroy: function() {
        _onEnemyDestroyed.call(app);
      }
    });

    enemy.update = function() {
      if (this.destroyed) return;
      this.run();
      this.forward();
    };

    this.screen.add(enemy);
    _updateBoardState(this);
  }

  function _initBoard() {
    this.board = new Board({
      scale: this.screen.scale,
      graphics: this.graphics,
      screen: this.screen,
      playerNum: this.playerNum,
      enemyNum: this.enemy,
      player1Lives: this.player1Lives,
      player2Lives: this.player2Lives,
      stage: this.stage,
      offsetX: this.screen.offsetX + this.cellWidth * 26 * this.screen.scale + 15 * this.screen.scale,
      offsetY: this.screen.offsetY + 15 * this.screen.scale
    });
    this.screen.add(this.board);
    _updateBoardState(this);
  }

  function _mapRenderLayerBottom() {
    logger.info('Render bottom map.');
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
    var digitWidth = graphics.width / 10;
    var stageText = String(that.stage + 1);
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
        for (var i = 0; i < stageText.length; i++) {
          var digit = parseInt(stageText.charAt(i), 10);
          screen.ctx.save();
          screen.ctx.translate(
            that.screen.width / 2 - stageText.length * digitWidth * scale / 2 + i * digitWidth * scale,
            that.screen.height / 2
          );
          screen.ctx.drawImage(graphics.image, digit * digitWidth, 0, digitWidth, graphics.height, 0, 0, digitWidth * scale, graphics.height * scale);
          screen.ctx.restore();
        }
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
    this.player1Stock = opt.player1;
    this.player2Stock = opt.player2;
    this.player1 = null;
    this.player2 = null;
    window.sss = this.screen;
  }

  var proto = {};

  proto.init = function() {
    logger.info('Application initial.');
    this.cellWidth = this.graphics['tile'].height / 2;
    if (!this._keyboardStarted) {
      Keyboard.run(function () {
        Keyboard.simulate();
      });
      this._keyboardStarted = true;
    }
    _welcome.call(this);
  }

  proto.start = function() {
    logger.info('Application start.');
    this.end();
    this.set('status', 'start');
    this._gameEnding = false;
    this._homeDestroyed = false;
    this.player1 = null;
    this.player2 = null;
    this.board = null;
    this.screen.clean();
    this.sounds['start'].sound.play();
    this.map = _cloneMap(Resource.MAPS[this.stage]);
    this.player1Lives = Math.max(this.player1Stock - 1, 0);
    this.player2Lives = this.playerNum === 2 ? Math.max(this.player2Stock - 1, 0) : 0;
    this._enemyQueue = _buildEnemyQueue(this.stage, this.enemy);
    logger.info('Stage ' + this.stage + ' start.');
    _mapRenderLayerBottom.call(this);
    _initPlayer.call(this);
    _initEnemy.call(this);
    _mapRenderLayerTop.call(this);
    _stageAnim.call(this);
  }

  proto.pause = function() {
  }

  proto.restart = function() {
    this.end();
    this.player1 = null;
    this.player2 = null;
    _welcome.call(this);
  }

  proto.end = function() {
    if (this._spawnTimer) {
      clearInterval(this._spawnTimer);
      this._spawnTimer = null;
    }
  }

  proto.isPlaying = function() {
    return this.get('status') === 'start' && !this._gameEnding;
  }

  proto.homeDestroyed = function() {
    if (this._homeDestroyed) return;
    this._homeDestroyed = true;
    _finishStage.call(this, 'gameover');
  }

  Util.augment(Application, proto);
  Util.inherit(Application, Base);
  exports.Application = Application;
})(this);
