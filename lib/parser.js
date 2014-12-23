var EventEmitter = require('events').EventEmitter;
var Tail = require('tail').Tail;

class Parser extends EventEmitter {
    parse(file, fromBeginning = true) {
        var parser = this;
        var tail = new Tail(file, '\n', {}, fromBeginning);
        tail.on("line", function(line) {
            parser.parseLine(line);
        });   
    }

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

        } else if (match = line.match(/TAG_CHANGE Entity=\[.*id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d)\] tag=(.*) value=(.*)/)) {
            var [, entityId, zone, zonePos, cardId, playerId, type, state] = match;
            result = this.parseTagChange(type, null, state, parseInt(playerId), parseInt(entityId), zone, parseInt(zonePos), cardId);

        } else if (match = line.match(/TAG_CHANGE Entity=(.*) tag=(.*) value=(.*)/)) {
            var [, player, type, state] = match;
            result = this.parseTagChange(type, player, state);

        } else if (match = line.match(/\[Zone\] ZoneChangeList\.ProcessChanges\(\) - id=(\d*) local=(.*) \[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] zone from (.*) -> (.*)/)) {
            var [, id, local, name, entityId, zone, zonePos, cardId, playerId, fromZone, toZone] = match;
            result = this.parseZoneChange(id, local, name, parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), fromZone, toZone)

        } else if (match = line.match(/\[Zone\] ZoneChangeList\.ProcessChanges\(\) - id=(\d*) local=(.*) \[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] zone from (.*) -> (.*)/)) {
            var [, id, local, entityId, cardId, type, zone, zonePos, playerId, fromZone, toZone] = match;
            result = this.parseZoneChange(id, local, "", parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), fromZone, toZone)

        } else if (match = line.match(/\[Zone\] ZoneChangeList\.ProcessChanges\(\) - id=(\d*) local=(.*) \[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] pos from (\d*) -> (\d*)/)) {
            var [, id, local, name, entityId, zone, zonePos, cardId, playerId, fromPos, toPos] = match;
            result = this.parsePosChange(parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), parseInt(fromPos), parseInt(toPos));

        } else if (match = line.match(/\[Zone\] ZoneChangeList\.ProcessChanges\(\) - id=(\d*) local=(.*) \[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] pos from (\d*) -> (\d*)/)) {
            var [, id, local, entityId, cardId, type, zone, zonePos, playerId, fromPos, toPos] = match;
            result = this.parsePosChange(parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), parseInt(fromPos), parseInt(toPos));

        } else if (match = line.match(/ACTION_START Entity=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\] SubType=ATTACK .* Target=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\]/)) {
            var [, id, cardId, playerId, targetId, targetCardId, targetPlayerId] = match;
            result = this.parseActionStart("attack", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), targetCardId, parseInt(targetPlayerId));

        } else if (match = line.match(/ACTION_START Entity=\[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] SubType=POWER Index=(.*) Target=\[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\]/)) {
            var [, name, id, zone, zonePos, cardId, playerId, index, targetName, targetId, targetZone, targetZonePos, targetCardId, targetPlayerId] = match;
            result = this.parseActionStart("power", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), targetCardId, parseInt(targetPlayerId));

        } else if (match = line.match(/ACTION_START Entity=\[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] SubType=POWER Index=(.*) Target=(\d*)/)) {
            var [, id, cardId, type, zone, zonePos, playerId, index, targetId] = match;
            result = this.parseActionStart("power", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), null, null);
        } else if (match = line.match(/ACTION_START Entity=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\] SubType=PLAY Index=(.*) Target=(\d*)/)) {
            var [, id, cardId, playerId, index, targetId] = match;
            result = this.parseActionStart("play", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), null, null);
        }

        this.emit.apply(this, result);
        return result;
    }

    parseTagChange(type, playerName, state, playerId, entityId, zone, zonePos, cardId) {
        switch(type) {
            case "PLAYER_ID":
                return ["tag_change", {type: "player_id", name: playerName, player_id: parseInt(state)}];
            case "FIRST_PLAYER":
                return ["tag_change", {type: "first_player", name: playerName}];
            case "PLAYSTATE":
                return ["tag_change", {type: "game_over", name: playerName, state: state}];
            case "TURN_START":
                if (playerName == "GameEntity") {
                    return ["tag_change", {type: "game_start", timestamp: parseInt(state)}];
                } else {
                    return ["tag_change", {type: "turn_start", name: playerName, timestamp: parseInt(state)}];    
                }
            case "RESOURCES":
                return ["tag_change", {type: "resources", name: playerName, resources: parseInt(state)}];
            case "TURN":
                return ["tag_change", {type: "turn", number: parseInt(state)}];
            case "DAMAGE":
                return ["tag_change", {type: "damage", id: entityId, player_id: playerId, value: parseInt(state), card_id: cardId}];
            case "ATTACKING":
                return ["tag_change", {type: "attacking", id: entityId, player_id: playerId, card_id: cardId}];
            case "DEFENDING":
                return ["tag_change", {type: "defending", id: entityId, player_id: playerId, card_id: cardId}];
            case "CARD_TARGET":
                return ["tag_change", {type: "card_target", id: entityId, player_id: playerId, target_id: parseInt(state), card_id: cardId}];
            case "ARMOR":
                return ["tag_change", {type: "armor", id: entityId, armor: parseInt(state)}];
            case "ATK":
                return ["tag_change", {type: "attack", id: entityId, attack: parseInt(state)}];
            case "HEALTH":
                return ["tag_change", {type: "health", id: entityId, health: parseInt(state)}];

        }
    }

    parseZoneChange(id, local, name, entityId, zone, zonePos, cardId, playerId, fromZone, toZone) {
        return ["zone_change", {id: entityId, player_id: playerId, card_id: cardId, from_zone: fromZone, to_zone: toZone}]
    }

    parsePosChange(entityId, zone, zonePos, cardId, playerId, fromPos, toPos) {
        return ["pos_change", {id: entityId, player_id: playerId, card_id: cardId, from_pos: fromPos, to_pos: toPos, zone: zone}]
    }

    parseActionStart(type, sourceId, sourceCardId, sourcePlayerId, targetId, targetCardId, targetPlayerId) {
        var source = {id: sourceId, card_id: sourceCardId, player_id: sourcePlayerId};
        var target = {id: targetId};
        if (targetCardId) {
            target.card_id = targetCardId;
        }
        if (targetCardId) {
            target.player_id = targetPlayerId;
        }
        return ["action_start", {type: type, source: source, target: target}];
    }
}

module.exports = Parser; 