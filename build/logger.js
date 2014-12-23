$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var fs = require('fs');
  var path = require('path');
  var Parser = require('./parser');
  var Tail = require('tail').Tail;
  var Game = require('./game');
  var Logger = function Logger(parser, outputPath) {
    this.parser = parser;
    this.mode = null;
    this.outputPath = outputPath;
    this.game = new Game(null);
    var logger = this;
    this.parser.on('startup', function(mode) {
      console.log('startup');
    });
    this.parser.on('mode', function(mode) {
      console.log(("Mode: " + mode));
      logger.mode = mode;
      logger.game.mode = mode;
    });
    this.parser.on('action_start', function(data) {
      console.log("action_start:", data);
      logger.game.addEvent(['action_start', data]);
    });
    this.parser.on('zone_change', function(data) {
      console.log("zone_change:", data);
      logger.game.addEvent(['zone_change', data]);
    });
    this.parser.on('pos_change', function(data) {
      console.log("pos_change:", data);
      logger.game.addEvent(['pos_change', data]);
    });
    this.parser.on('tag_change', function(data) {
      console.log("tag_change:", data);
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
      console.log("Start new game");
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
        fs.writeFileSync(fullpath, jsonStr);
        console.log(("Saved match: " + filename));
      }
    }
  }, {});
  module.exports = Logger;
  return {};
});
