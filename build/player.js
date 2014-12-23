$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Player = function Player(id, name) {
    this.id = id;
    this.name = name;
    this.firstPlayer = false;
    this.result = null;
  };
  ($traceurRuntime.createClass)(Player, {}, {});
  module.exports = Player;
  return {};
});
