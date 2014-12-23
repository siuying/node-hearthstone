$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var fs = require('fs');
  var path = require('path');
  var Parser = require('./parser');
  var Tail = require('tail').Tail;
  var Logger = function Logger(parser, outputPath) {
    this.parser = parser;
    this.mode = null;
    this.outputPath = outputPath;
    var logger = this;
    this.parser.on('mode', function(mode) {
      logger.mode = mode;
      logger.startGame();
    });
    this.parser.on('action_start', function(data) {
      logger.game.addEvent(['action_start', data]);
    });
    this.parser.on('zone_change', function(data) {
      logger.game.addEvent(['zone_change', data]);
    });
    this.parser.on('pos_change', function(data) {
      logger.game.addEvent(['pos_change', data]);
    });
    this.parser.on('tag_change', function(data) {
      logger.game.addEvent(['tag_change', data]);
      var type = data.type;
      if (type === "game_over") {
        if (logger.game.isCompleted()) {
          logger.saveGame();
          logger.startGame();
        }
      }
    });
  };
  ($traceurRuntime.createClass)(Logger, {
    startGame: function() {
      this.game = new Game(this.mode);
    },
    addEvent: function(event, data) {
      if (this.game) {
        this.game.addEvent([event, data]);
      }
    },
    saveGame: function() {
      if (this.game) {
        var jsonStr = JSON.stringify(this.game.toObject());
        var filename = (this.game.filename() + ".json");
        var fullpath = path.join(this.outputPath, filename);
        fs.writeFile(fullpath, jsonStr);
      }
    }
  }, {});
  module.exports = Logger;
  return {};
});
