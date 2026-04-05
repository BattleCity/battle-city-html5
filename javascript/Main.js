'use strict';

(function(exports, undefined) {

  var screen = new Screen({
    element: 'screen',
    scale: SCREENWIDTH / DEFAULTWIDTH
  });

  var logger = new Logger({
    screen: screen
  });

  var timer = new Timer();

  // Load graphics and sounds in parallel (#26)
  var graphicsLoader = new Graphics().load(Resource.GRAPHICS);
  var soundLoader = new Sound().load(Resource.SOUNDS);
  var graphicsDone = false;
  var soundsDone = false;
  var loadedGraphics = null;
  var loadedSounds = null;

  function _tryStart() {
    if (graphicsDone && soundsDone) {
      logger.info('All resources loaded ...');
      new Application({
        index: STARTSTAGE,
        screen: screen,
        graphics: loadedGraphics,
        sounds: loadedSounds,
        debug: DEBUG
      }).init();

      timer.listen(screen).start();
    }
  }

  graphicsLoader
  .on('success', function(graphic) {
    logger.info('Image loaded: ' + graphic.src + ' ...');
  })
  .on('complete', function(graphics) {
    logger.info('Image all loaded ...');
    loadedGraphics = graphics;
    graphicsDone = true;
    _tryStart();
  });

  soundLoader
  .on('success', function(sound) {
    logger.info('Sound loaded: ' + sound.src + ' ...');
  })
  .on('complete', function(sounds) {
    logger.info('Sounds all loaded ...');
    loadedSounds = sounds;
    soundsDone = true;
    _tryStart();
  });

})(this);
