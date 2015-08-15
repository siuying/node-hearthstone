"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = (function () {
    function Player(id, name) {
        _classCallCheck(this, Player);

        this.id = id;
        this.name = name;
        this.firstPlayer = false;
        this.result = null;
    }

    _createClass(Player, [{
        key: "toObject",
        value: function toObject() {
            return { id: this.id, name: this.name, first_player: this.firstPlayer, result: this.result };
        }
    }]);

    return Player;
})();

module.exports = Player;