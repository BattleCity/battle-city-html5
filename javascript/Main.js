'use strict';

(function(exports, undefined) {

  var screen = new Screen({
    element: 'screen',
    scale: SCREENWIDTH / DEFAULTWIDTH
  });

  var timer = new Timer();

  new Graphics()
  .load(Resource.GRAPHICS)
  .on('success', function(graphic) {
  })
  .on('complete', function(graphics) {
    new Sound()
    .load(Resource.SOUNDS)
    .on('success', function(sound) {
    })
    .on('complete', function(sounds){
      new Application({
        index: STARTSTAGE,
        screen: screen,
        graphics: graphics,
        sounds: sounds
      });
      timer.listen(screen).start();
    });
  });

})(this);
