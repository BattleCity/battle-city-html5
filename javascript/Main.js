'use strict';

(function(exports, undefined) {

  var screen = new Screen({
    element: 'screen',
    scale: SCREENWIDTH / DEFAULTWIDTH
  });

  var timer = new Timer();

  new SourceLoader()
  .load(Resource)
  .on('success', function(item) {
  })
  .on('complete', function(graphics) {
    new Application({
      index: STARTSTAGE,
      screen: screen,
      graphics: graphics
    });
    timer.listen(screen).start();
  });
})(this);
