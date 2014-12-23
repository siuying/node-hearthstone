$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Player = require('./player');
  var Game = function Game() {
    var mode = arguments[0] !== (void 0) ? arguments[0] : "unknown";
    this.mode = mode;
    this.players = [];
    this.events = [];
  };
  ($traceurRuntime.createClass)(Game, {
    addEvent: function(event) {
      var $__1 = event,
          name = $__1[0],
          data = $__1[1];
      if (name == "tag_change") {
        var $__2 = data,
            type = $__2.type,
            name = $__2.name,
            player_id = $__2.player_id,
            state = $__2.state;
        switch (type) {
          case "player_id":
            this.playerWithIdOrName(player_id, name);
            break;
          case "first_player":
            var player = this.playerWithIdOrName(null, name);
            player.firstPlayer = true;
            break;
          case "game_over":
            var player = this.playerWithIdOrName(null, name);
            player.result = state;
            break;
          default:
        }
      }
      this.events.push(event);
    },
    playerWithIdOrName: function(id, name) {
      var player = this.players.find((function(p) {
        return (id && p.id === id) || (name && p.name === name);
      }));
      if (player) {
        if (name) {
          player.name = name;
        }
        if (id) {
          player.id = id;
        }
      } else {
        player = new Player(id, name);
        this.players.push(player);
      }
      return player;
    },
    isCompleted: function() {
      return this.players.filter((function(p) {
        return p.result;
      })).length == 2;
    },
    filename: function() {
      var firstPlayer = this.players[0];
      var secondPlayer = this.players[1];
      var firstPlayerName = firstPlayer ? firstPlayer.name : "UNKNOWN";
      var secondPlayerName = secondPlayer ? secondPlayer.name : "UNKNOWN";
      var gameStartEvent = this.events.find((function(e) {
        return e[0] == "tag_change" && e[1]['type'] == "game_start";
      }));
      var time = gameStartEvent ? (gameStartEvent[1]['timestamp']) : (new Date().valueOf() / 1000);
      return (time + "_" + this.mode + "_" + firstPlayerName + "_v_" + secondPlayerName);
    },
    toObject: function() {
      var players = this.players.map((function(p) {
        return p.toObject();
      }));
      return {
        mode: this.mode,
        players: players,
        events: this.events
      };
    }
  }, {});
  module.exports = Game;
  return {};
});
