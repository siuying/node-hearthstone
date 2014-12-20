var EventEmitter = require('events').EventEmitter;

class Parser extends EventEmitter {
    parseLine(line) {
        var match = null;
        var result = null;

        if (line.match(/^Initialize engine version/)) {
            result = ["startup"];

        } else if (line.match(/\[Power\] .* Begin Spectating/)) {
            result = ["begin_spectator_mode"];

        } else if (line.match(/\[Power\] .* End Spectator/)) {
            result = ["end_spectator_mode"];

        } else if (match = line.match(/\[LoadingScreen\] LoadingScreen.OnSceneLoaded\(\) - prevMode=.* currMode=(.*)/)) {
            var mode = match[1];
            switch(mode) {
                case "DRAFT":
                    result = ["mode", "arena"];
                    break;
                case "TOURNAMENT":
                    result = ["mode", "ranked"];
                    break;
                case "ADVENTURE":
                    result = ["mode", "solo"];
                    break;
            }

        } else if (match = line.match(/\[Power\] GameState.DebugPrintPower\(\) -\s*TAG_CHANGE Entity=(.*) tag=(.*) value=(.*)/)) {
            var [, player, type, state] = match;
            result = this.parseTagChange(type, player, state);
        }

        this.emit.apply(this, result);
        return result;
    }

    parseTagChange(type, playerName, state) {
        switch(type) {
            case "PLAYER_ID":
                return ["player_id", {name: playerName, player_id: parseInt(state)}];
            case "FIRST_PLAYER":
                return ["first_player", {name: playerName}];
            case "PLAYSTATE":
                return ["game_over", {name: playerName, state: state}];
            case "TURN_START":
                if (playerName == "GameEntity") {
                    return ["game_start", {timestamp: parseInt(state)}];
                } else {
                    return ["turn_start", {name: playerName, timestamp: parseInt(state)}];    
                }                
            case "TURN":
                return ["turn", 3];
        }
    }
}

module.exports = Parser; 