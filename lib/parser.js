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

        } else if (match = line.match(/\[Power\] GameState.DebugPrintPower\(\) -\s*TAG_CHANGE Entity=\[.*id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d)\] tag=(.*) value=(.*)/)) {
            var [, entityId, zone, zonePos, cardId, playerId, type, state] = match;
            result = this.parseTagChange(type, null, state, parseInt(playerId), parseInt(entityId), zone, parseInt(zonePos), cardId);

        } else if (match = line.match(/\[Power\] GameState.DebugPrintPower\(\) -\s*TAG_CHANGE Entity=(.*) tag=(.*) value=(.*)/)) {
            var [, player, type, state] = match;
            result = this.parseTagChange(type, player, state);

        } else if (match = line.match(/\[Zone\] ZoneChangeList\.ProcessChanges\(\) - id=(\d*) local=(.*) \[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] zone from (.*) -> (.*)/)) {
            var [, id, local, name, entityId, zone, zonePos, cardId, playerId, fromZone, toZone] = match;
            result = this.parseZoneChange(id, local, name, parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), fromZone, toZone)

        } else if (match = line.match(/\[Zone\] ZoneChangeList\.ProcessChanges\(\) - id=(\d*) local=(.*) \[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] zone from (.*) -> (.*)/)) {
            var [, id, local, entityId, cardId, type, zone, zonePos, playerId, fromZone, toZone] = match;
            result = this.parseZoneChange(id, local, "", parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), fromZone, toZone)

        }
 

        this.emit.apply(this, result);
        return result;
    }

    parseTagChange(type, playerName, state, playerId, entityId, zone, zonePos, cardId) {
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
                return ["turn", parseInt(state)];
            case "DAMAGE":
                return ["damage", {id: entityId, player_id: playerId, value: parseInt(state), card_id: cardId}];
            case "ATTACKING":
                return ["attacking", {id: entityId, player_id: playerId, card_id: cardId}];
            case "DEFENDING":
                return ["defending", {id: entityId, player_id: playerId, card_id: cardId}];
            case "CARD_TARGET":
                return ["card_target", {id: entityId, player_id: playerId, target_id: parseInt(state), card_id: cardId}];
        }
    }

    parseZoneChange(id, local, name, entityId, zone, zonePos, cardId, playerId, fromZone, toZone) {
        return ["zone_change", {id: entityId, player_id: playerId, card_id: cardId, from_zone: fromZone, to_zone: toZone, zone: zone, zone_pos: zonePos}]
    }
}

module.exports = Parser; 