var Player = require('./player');
var slugify = require('underscore.string/slugify');

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
                case "playstate":
                    var player = this.playerWithIdOrName(null, name);
                    player.result = state;
                    break;
                default:
            }
        }

        this.events.push(event);
    }

    playerWithIdOrName(id, name) {
        var player = this.players.filter(p => (id && p.id === id) || (name && p.name === name))[0];
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
    }

    isCompleted() {
        return this.players.filter((p) => { return (p.result == "WON") || (p.result == "LOST") || (p.result == "DRAW") }).length == 2
    }

    filename() {
        var firstPlayer = this.players[0];
        var secondPlayer = this.players[1];
        var firstPlayerName = firstPlayer ? firstPlayer.name : "UNKNOWN";
        var secondPlayerName = secondPlayer ? secondPlayer.name : "UNKNOWN";
        var gameStartEvent = this.events.filter(e => e[0] == "tag_change" && e[1]['type'] == "game_start")[0]
        var time = gameStartEvent ? (gameStartEvent[1]['timestamp']) : (new Date().valueOf()/1000);
        return `${time}_${this.mode}_${slugify(firstPlayerName)}_v_${slugify(secondPlayerName)}`;
    }

    toObject() {
        var players = this.players.map(p => p.toObject())
        return {mode: this.mode, players: players, events: this.events};
    }
}

module.exports = Game;