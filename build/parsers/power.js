"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var parseTagChange = function parseTagChange(type, playerName, state, playerId, entityId, zone, zonePos, cardId) {
    switch (type) {
        case "PLAYER_ID":
            return ["tag_change", { type: "player_id", name: playerName, player_id: parseInt(state) }];
        case "FIRST_PLAYER":
            return ["tag_change", { type: "first_player", name: playerName }];
        case "PLAYSTATE":
            return ["tag_change", { type: "playstate", name: playerName, state: state }];
        case "CURRENT_PLAYER":
            if (state == "1") {
                return ["tag_change", { type: "current_player", name: playerName }];
            }
            break;
        case "RESOURCES":
            return ["tag_change", { type: "resources", name: playerName, resources: parseInt(state) }];
        case "TURN":
            return ["tag_change", { type: "turn", number: parseInt(state) }];
        case "DAMAGE":
            return ["tag_change", { type: "damage", id: entityId, player_id: playerId, value: parseInt(state), card_id: cardId }];
        case "ATTACKING":
            if (state == "1") {
                return ["tag_change", { type: "attacking", id: entityId, player_id: playerId, card_id: cardId }];
            }
            break;
        case "DEFENDING":
            if (state == "1") {
                return ["tag_change", { type: "defending", id: entityId, player_id: playerId, card_id: cardId }];
            }
            break;
        case "CARD_TARGET":
            return ["tag_change", { type: "card_target", id: entityId, player_id: playerId, target_id: parseInt(state), card_id: cardId }];
        case "ARMOR":
            return ["tag_change", { type: "armor", card_id: cardId, player_id: playerId, id: entityId, armor: parseInt(state) }];
        case "ATK":
            return ["tag_change", { type: "attack", card_id: cardId, player_id: playerId, id: entityId, attack: parseInt(state) }];
        case "HEALTH":
            return ["tag_change", { type: "health", card_id: cardId, player_id: playerId, id: entityId, health: parseInt(state) }];
        case "STATE":
            if (playerName == "GameEntity") {
                switch (state) {
                    case "RUNNING":
                        return ["tag_change", { type: "game_start" }];
                    case "COMPLETE":
                        return ["tag_change", { type: "game_over" }];
                }
            }
            break;
        default:
            return null;
    }
};

var parseActionStart = function parseActionStart(type, sourceId, sourceCardId, sourcePlayerId, targetId, targetCardId, targetPlayerId) {
    var source = { id: sourceId, card_id: sourceCardId, player_id: sourcePlayerId };
    var target = { id: targetId };
    if (targetCardId) {
        target.card_id = targetCardId;
    }
    if (targetCardId) {
        target.player_id = targetPlayerId;
    }
    return ["action_start", { type: type, source: source, target: target }];
};

/*
 * This function tracks tag changes related to damage, attacking, defending, card target, armor, attack, and health
 */
var detectChangeWithDetails = function detectChangeWithDetails(line) {
    var match = line.match(/GameState\.DebugPrintPower\(\) -\W+TAG_CHANGE Entity=\[.*id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d)\] tag=(.*) value=(.*)/);
    if (match) {
        var _match = _slicedToArray(match, 8);

        var entityId = _match[1];
        var zone = _match[2];
        var zonePos = _match[3];
        var cardId = _match[4];
        var playerId = _match[5];
        var type = _match[6];
        var state = _match[7];

        return parseTagChange(type, null, state, parseInt(playerId), parseInt(entityId), zone, parseInt(zonePos), cardId);
    }
};

/*
 * This function tracks changes in tags related to player id, player number, win state, game start, turn start, and turn number
 */
var detectTagChange = function detectTagChange(line) {
    var match = line.match(/GameState\.DebugPrintPower\(\) -\W+TAG_CHANGE Entity=(.*) tag=(.*) value=(.*)/);
    if (match) {
        var _match2 = _slicedToArray(match, 4);

        var player = _match2[1];
        var type = _match2[2];
        var state = _match2[3];

        return parseTagChange(type, player, state);
    }
};

var detectAttack = function detectAttack(line) {
    var match = line.match(/GameState\.DebugPrintPower\(\) -\W+ACTION_START Entity=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\] BlockType=ATTACK .* Target=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\]/);
    if (match) {
        var _match3 = _slicedToArray(match, 7);

        var id = _match3[1];
        var cardId = _match3[2];
        var playerId = _match3[3];
        var targetId = _match3[4];
        var targetCardId = _match3[5];
        var targetPlayerId = _match3[6];

        return parseActionStart("attack", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), targetCardId, parseInt(targetPlayerId));
    }
};

var detectPowerWithTarget = function detectPowerWithTarget(line) {
    var match = line.match(/GameState\.DebugPrintPower\(\) -\W+ACTION_START Entity=\[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] BlockType=POWER Index=(.*) Target=\[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\]/);
    if (match) {
        var _match4 = _slicedToArray(match, 14);

        var name = _match4[1];
        var id = _match4[2];
        var zone = _match4[3];
        var zonePos = _match4[4];
        var cardId = _match4[5];
        var playerId = _match4[6];
        var index = _match4[7];
        var targetName = _match4[8];
        var targetId = _match4[9];
        var targetZone = _match4[10];
        var targetZonePos = _match4[11];
        var targetCardId = _match4[12];
        var targetPlayerId = _match4[13];

        return parseActionStart("power", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), targetCardId, parseInt(targetPlayerId));
    }
};

var detectPowerWithoutTarget = function detectPowerWithoutTarget(line) {
    var match = line.match(/GameState\.DebugPrintPower\(\) -\W+ACTION_START Entity=\[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] BlockType=POWER Index=(.*) Target=(\d+)/);
    if (match) {
        var _match5 = _slicedToArray(match, 9);

        var id = _match5[1];
        var cardId = _match5[2];
        var type = _match5[3];
        var zone = _match5[4];
        var zonePos = _match5[5];
        var playerId = _match5[6];
        var index = _match5[7];
        var targetId = _match5[8];

        return parseActionStart("power", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), null, null);
    }
};

var detectPlay = function detectPlay(line) {
    var match = line.match(/GameState\.DebugPrintPower\(\) -\WACTION_START Entity=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\] BlockType=PLAY Index=(.*) Target=(\d+)/);
    if (match) {
        var _match6 = _slicedToArray(match, 6);

        var id = _match6[1];
        var cardId = _match6[2];
        var playerId = _match6[3];
        var index = _match6[4];
        var targetId = _match6[5];

        return parseActionStart("play", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), null, null);
    }
};

var detectPlayWithDetail = function detectPlayWithDetail(line) {
    var match = line.match(/GameState\.DebugPrintPower\(\) -\WACTION_START Entity=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\] BlockType=PLAY Index=(.*) Target=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\]/);
    if (match) {
        var _match7 = _slicedToArray(match, 8);

        var id = _match7[1];
        var cardId = _match7[2];
        var playerId = _match7[3];
        var index = _match7[4];
        var targetId = _match7[5];
        var targetCardId = _match7[6];
        var targetPlayerId = _match7[7];

        return parseActionStart("play", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), targetCardId, parseInt(targetPlayerId));
    }
};

module.exports = {
    filename: "Power.log",
    parsers: [detectChangeWithDetails, detectTagChange, detectAttack, detectPowerWithTarget, detectPowerWithoutTarget, detectPlay, detectPlayWithDetail]
};