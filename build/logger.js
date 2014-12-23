$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Parser = require('./parser');
  var Tail = require('tail').Tail;
  var Logger = function Logger(parser) {
    this.parser = parser;
    this.mode = null;
    var logger = this;
    this.parser.on('mode', function(mode) {
      logger.mode = mode;
    });
    this.parser.on('action_start', function() {});
    this.parser.on('zone_change', function(data) {});
    this.parser.on('pos_change', function(data) {});
    this.parser.on('tag_change', function() {});
  };
  ($traceurRuntime.createClass)(Logger, {currentGame: function() {}}, {});
  module.exports = Logger;
  return {};
});
