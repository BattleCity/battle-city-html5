'use strict';

(function(exports, undefined) {

  var screen = new Screen('screen', SCREENWIDTH / DEFAULTWIDTH);
  var timer = new Timer();
  var loader = new SourceLoader();
  loader.load(Resource);
  loader.on('success', function(item) {
  }).on('complete', function(resource) {
    new Application(screen, resource);
    timer.listen(screen).start();
  });

})(this);
