'use strict';

(function(exports, undefined) {

  var screen = new Screen({
    element: 'screen',
    scale: SCREENWIDTH / DEFAULTWIDTH
  });

  var timer = new Timer();
  new SourceLoader()
  .load(Resource.GRAPHICS)
  .load(Resource.SOUNDS)
  .on('success', function(item) {
    //console.log(item)
  })
  .on('complete', function(Resource) {
    new Application({
      index: STARTSTAGE,
      screen: screen,
      resource: Resource
    });
    timer.listen(screen).start();
  });
})(this);
