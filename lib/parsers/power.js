var parseTagChange = function(type, playerName, state, playerId, entityId, zone, zonePos, cardId) {
    switch(type) {
        case "PLAYER_ID":
            return ["tag_change", {type: "player_id", name: playerName, player_id: parseInt(state)}];
        case "FIRST_PLAYER":
            return ["tag_change", {type: "first_player", name: playerName}];
        case "PLAYSTATE":
            return ["tag_change", {type: "playstate", name: playerName, state: state}];
        case "CURRENT_PLAYER":
            if (state == "1") {
                return ["tag_change", {type: "current_player", name: playerName}];
            }
            break;
        case "RESOURCES":
            return ["tag_change", {type: "resources", name: playerName, resources: parseInt(state)}];
        case "TURN":
            return ["tag_change", {type: "turn", number: parseInt(state)}];
        case "DAMAGE":
            return ["tag_change", {type: "damage", id: entityId, player_id: playerId, value: parseInt(state), card_id: cardId}];
        case "ATTACKING":
            if (state == "1") {
                return ["tag_change", {type: "attacking", id: entityId, player_id: playerId, card_id: cardId}];
            }
            break;            
        case "DEFENDING":
            if (state == "1") {
                return ["tag_change", {type: "defending", id: entityId, player_id: playerId, card_id: cardId}];
            }
            break;
        case "CARD_TARGET":
            return ["tag_change", {type: "card_target", id: entityId, player_id: playerId, target_id: parseInt(state), card_id: cardId}];
        case "ARMOR":
            return ["tag_change", {type: "armor", card_id: cardId, player_id: playerId, id: entityId, armor: parseInt(state)}];
        case "ATK":
            return ["tag_change", {type: "attack", card_id: cardId, player_id: playerId, id: entityId, attack: parseInt(state)}];
        case "HEALTH":
            return ["tag_change", {type: "health", card_id: cardId, player_id: playerId, id: entityId, health: parseInt(state)}];
        case "STATE":
            if (playerName == "GameEntity") {
                switch (state) {
                case "RUNNING":
                    return ["tag_change", {type: "game_start"}];
                case "COMPLETE":
                    return ["tag_change", {type: "game_over"}];
                }
            }
            break;            
        default:
            return null;
    }
};

var parseActionStart = function(type, sourceId, sourceCardId, sourcePlayerId, targetId, targetCardId, targetPlayerId) {
    var source = {id: sourceId, card_id: sourceCardId, player_id: sourcePlayerId};
    var target = {id: targetId};
    if (targetCardId) {
        target.card_id = targetCardId;
    }
    if (targetCardId) {
        target.player_id = targetPlayerId;
    }
    return ["action_start", {type: type, source: source, target: target}];
};

/*
 * This function tracks tag changes related to damage, attacking, defending, card target, armor, attack, and health
 */
var detectChangeWithDetails = function(line) {
    var match = line.match(/GameState\.DebugPrintPower\(\) -\W+TAG_CHANGE Entity=\[.*id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d)\] tag=(.*) value=(.*)/);
    if (match) {
        var [, entityId, zone, zonePos, cardId, playerId, type, state] = match;
        return parseTagChange(type, null, state, parseInt(playerId), parseInt(entityId), zone, parseInt(zonePos), cardId);
    }
};

/*
 * This function tracks changes in tags related to player id, player number, win state, game start, turn start, and turn number
 */
var detectTagChange = function(line) {
    var match = line.match(/GameState\.DebugPrintPower\(\) -\W+TAG_CHANGE Entity=(.*) tag=(.*) value=(.*)/);
    if (match) {
        var [, player, type, state] = match;
        return parseTagChange(type, player, state);
    }
};

var detectAttack = function(line) {
    var match = line.match(/GameState\.DebugPrintPower\(\) -\W+ACTION_START Entity=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\] BlockType=ATTACK .* Target=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\]/);
    if (match) {
        var [, id, cardId, playerId, targetId, targetCardId, targetPlayerId] = match;
        return parseActionStart("attack", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), targetCardId, parseInt(targetPlayerId));
    }
};

var detectPowerWithTarget = function(line) {
    var match = line.match(/GameState\.DebugPrintPower\(\) -\W+ACTION_START Entity=\[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] BlockType=POWER Index=(.*) Target=\[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\]/);
    if (match) {
        var [, name, id, zone, zonePos, cardId, playerId, index, targetName, targetId, targetZone, targetZonePos, targetCardId, targetPlayerId] = match;
        return parseActionStart("power", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), targetCardId, parseInt(targetPlayerId));
    }
};

var detectPowerWithoutTarget = function(line) {
    var match = line.match(/GameState\.DebugPrintPower\(\) -\W+ACTION_START Entity=\[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] BlockType=POWER Index=(.*) Target=(\d+)/);
    if (match) {
        var [, id, cardId, type, zone, zonePos, playerId, index, targetId] = match;
        return parseActionStart("power", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), null, null);
    }
};

var detectPlay = function(line) {
    var match = line.match(/GameState\.DebugPrintPower\(\) -\WACTION_START Entity=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\] BlockType=PLAY Index=(.*) Target=(\d+)/);
    if (match) {
        var [, id, cardId, playerId, index, targetId] = match;
        return parseActionStart("play", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), null, null);
    }
};

var detectPlayWithDetail = function(line) {
    var match = line.match(/GameState\.DebugPrintPower\(\) -\WACTION_START Entity=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\] BlockType=PLAY Index=(.*) Target=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\]/);
    if (match) {
        var [, id, cardId, playerId, index, targetId, targetCardId, targetPlayerId] = match;
        return parseActionStart("play", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), targetCardId, parseInt(targetPlayerId));
    }
};

module.exports = {
    filename: "Power.log",
    parsers: [
        detectChangeWithDetails, 
        detectTagChange,
        detectAttack,
        detectPowerWithTarget,
        detectPowerWithoutTarget,
        detectPlay,
        detectPlayWithDetail
    ]
}