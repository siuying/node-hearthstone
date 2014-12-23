$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Player = function Player(id, name) {
    this.id = id;
    this.name = name;
    this.firstPlayer = false;
    this.result = null;
  };
  ($traceurRuntime.createClass)(Player, {toObject: function() {
      return {
        id: this.id,
        name: this.name,
        first_player: this.firstPlayer,
        result: this.result
      };
    }}, {});
  module.exports = Player;
  return {};
});
