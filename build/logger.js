$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var lineReader = require('line-reader');
  var Logger = function Logger() {};
  ($traceurRuntime.createClass)(Logger, {
    logFile: function(file) {
      var logger = this;
      lineReader.eachLine(file, function(line, last) {
        logger.logLine(line);
      });
    },
    logLine: function(line) {},
    currentGame: function() {}
  }, {});
  module.exports = Logger;
  return {};
});
