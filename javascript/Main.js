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

  new Graphics()
  .load(Resource.GRAPHICS)
  .on('success', function(graphic) {
    logger.info('Image loaded: ' + graphic.src + ' ...');
  })
  .on('complete', function(graphics) {
    logger.info('Image all loaded ...');

    new Sound()
    .load(Resource.SOUNDS)
    .on('success', function(sound) {
      logger.info('Sound loaded: ' + sound.src + ' ...');
    })
    .on('complete', function(sounds){
      logger.info('Sounds all loaded ...');

      new Application({
        index: STARTSTAGE,
        screen: screen,
        graphics: graphics,
        sounds: sounds
      }).init();

      timer.listen(screen).start();
    });
  });

})(this);
