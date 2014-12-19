$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var EventEmitter = require('events').EventEmitter;
  var Parser = function Parser() {
    $traceurRuntime.superConstructor($Parser).apply(this, arguments);
  };
  var $Parser = Parser;
  ($traceurRuntime.createClass)(Parser, {parseLine: function(line) {
      if (line.match(/^Initialize engine version/)) {
        this.emit("startup");
        return;
      }
      if (line.match(/\[Power\] .* Begin Spectating/)) {
        this.emit("begin_spectator_mode");
        return;
      }
      if (line.match(/\[Power\] .* End Spectating/)) {
        this.emit("end_spectator_mode");
        return;
      }
    }}, {}, EventEmitter);
  return {};
});
