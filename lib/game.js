var Player = require('./player');
var slugify = require('underscore.string/slugify');

class Game {
    constructor(mode="unknown") {
        this.mode = mode;
        this.turn = 0;
        this.players = [];
        this.events = [];
        this.currentPlayer = null;
        this.gameStartTime = new Date();
        this.gameEndTime = null;
    }

    addEvent(event) {
        var [name, data] = event;

        if (name == "tag_change") {
            var {type, name, player_id, state} = data;
            switch(type) {
                case "game_start":
                    this.gameStartTime = new Date();
                    return;
                case "game_over":
                    this.gameEndTime = new Date();
                    return;
                case "turn":
                    this.turn = state;
                    return;
                case "current_player":
                    this.currentPlayer = this.playerWithIdOrName(player_id, name);
                    return;
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
        var time = this.gameStartTime().valueOf()
        return `${time}_${slugify(firstPlayerName)}_v_${slugify(secondPlayerName)}`;
    }

    gameLength() {
        if (this.gameEndTime && this.gameStartTime) {
            return this.gameEndTime.valueOf() - this.gameStartTime.valueOf()
        } else {
            return null
        }        
    }

    toObject() {
        var players = this.players.map(p => p.toObject())
        return {
            mode: this.mode,
            players: players, 
            turn: this.turn,
            events: this.events,
            game_start: this.gameStartTime.valueOf(),
            game_end: this.gameEndTime.valueOf(),
            game_length: this.gameLength()
        };
    }
}

module.exports = Game;