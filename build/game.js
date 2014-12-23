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
      if (!player) {
        player = new Player(id, name);
        this.players.push(player);
      }
      return player;
    }
  }, {});
  module.exports = Game;
  return {};
});
