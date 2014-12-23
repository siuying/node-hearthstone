var Player = require('./player');

class Game {
    constructor(mode="unknown") {
        this.mode = mode;
        this.players = [];
        this.events = [];
    }

    addEvent(event) {
        var [name, data] = event;

        if (name == "tag_change") {
            var {type, name, player_id, state} = data;
            switch(type) {
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
    }

    playerWithIdOrName(id, name) {
        var player = this.players.find(p => (id && p.id === id) || (name && p.name === name));
        if (!player) {
            player = new Player(id, name);
            this.players.push(player);
        }
        return player;
    }

    isCompleted() {
        return this.players.filter(p => p.result).length == 2
    }
}

module.exports = Game;