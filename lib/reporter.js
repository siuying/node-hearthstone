var colors = require('colors/safe');

// print all known events on screen
class Reporter {
    constructor(parser, options) {
        this.parser = parser;
        this.playerNames = {};       // playerId => name
        this.playerResults = {}; // name => result

        this.parser.on('startup', this.onStartUp.bind(this));
        this.parser.on('mode', this.onMode.bind(this));
        this.parser.on('action_start', this.onActionStart.bind(this));
        this.parser.on('zone_change', this.onZoneChange.bind(this));
        this.parser.on('pos_change', this.onPosChange.bind(this));
        this.parser.on('tag_change', this.onTagChange.bind(this));

        this.report = console.log;
    }

    onStartUp() {
        this.report(colors.grey("Hearthstone Started"));
    }

    onMode(mode) {
        var _, name = mode
        this.report(colors.grey("Mode: " + name));
    }

    onActionStart(data) {
    }

    onZoneChange(data) {
    }

    onPosChange(data) {
    }

    onTagChange(data) {
        var {type, name, state} = data;
        switch (type) {
            case "player_id":
                this.onPlayerId(name, state);
                break;
            case "first_player":
                console.log(colors.white(name + " play first."));
                break;
            case "playstate":
                if (state == "WON" || state == "LOST" || state == "DRAW") {
                    console.log(colors.red("Game finished: " + name + " " + state));
                }
                break;
        }
    }

    onGameOver(name, result) {
        this.playerResults[name] = result;
        let players = Object.keys(this.playerResults)
        if (players.length == 2) {
            let message = `${players[0]} ${this.playerResults[players[0]]}`
            this.report(colors.white(message));
        }
    }

    onPlayerId(name, playerId) {
        this.playerNames[playerId] = name;
        let names = Object.entries(this.playerNames)
        if (names.length == 2) {
            let message = names.join(" vs ");
            this.report(colors.white(message));
        }
    }
}

module.exports = Reporter;