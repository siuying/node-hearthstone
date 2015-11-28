"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var parseZoneChange = function parseZoneChange(id, local, name, entityId, zone, zonePos, cardId, playerId, fromZone, toZone) {
    return ["zone_change", { id: entityId, player_id: playerId, card_id: cardId, from_zone: fromZone, to_zone: toZone }];
};

var parsePosChange = function parsePosChange(entityId, zone, zonePos, cardId, playerId, fromPos, toPos) {
    return ["pos_change", { id: entityId, player_id: playerId, card_id: cardId, from_pos: fromPos, to_pos: toPos, zone: zone }];
};

var detectPlayerZoneChange = function detectPlayerZoneChange(line) {
    var match = line.match(/ZoneChangeList\.ProcessChanges\(\) -\Wid=(\d*) local=(.*) \[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] zone from (.*) -> (.*)/);
    if (match) {
        var _match = _slicedToArray(match, 11);

        var id = _match[1];
        var local = _match[2];
        var name = _match[3];
        var entityId = _match[4];
        var zone = _match[5];
        var zonePos = _match[6];
        var cardId = _match[7];
        var playerId = _match[8];
        var fromZone = _match[9];
        var toZone = _match[10];

        return parseZoneChange(id, local, name, parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), fromZone, toZone);
    }
};

var detectOpponentCardChange = function detectOpponentCardChange(line) {
    var match = line.match(/ZoneChangeList\.ProcessChanges\(\) -\Wid=(\d*) local=(.*) \[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] zone from (.*) -> (.*)/);
    if (match) {
        var _match2 = _slicedToArray(match, 11);

        var id = _match2[1];
        var local = _match2[2];
        var entityId = _match2[3];
        var cardId = _match2[4];
        var type = _match2[5];
        var zone = _match2[6];
        var zonePos = _match2[7];
        var playerId = _match2[8];
        var fromZone = _match2[9];
        var toZone = _match2[10];

        return parseZoneChange(id, local, "", parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), fromZone, toZone);
    }
};

var detectPlayerPositionZoneChange = function detectPlayerPositionZoneChange(line) {
    var match = line.match(/ZoneChangeList\.ProcessChanges\(\) -\Wid=(\d*) local=(.*) \[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] pos from (\d*) -> (\d*)/);
    if (match) {
        var _match3 = _slicedToArray(match, 11);

        var id = _match3[1];
        var local = _match3[2];
        var name = _match3[3];
        var entityId = _match3[4];
        var zone = _match3[5];
        var zonePos = _match3[6];
        var cardId = _match3[7];
        var playerId = _match3[8];
        var fromPos = _match3[9];
        var toPos = _match3[10];

        return parsePosChange(parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), parseInt(fromPos), parseInt(toPos));
    }
};

var detectOpponentPositionZoneChange = function detectOpponentPositionZoneChange(line) {
    var match = line.match(/ZoneChangeList\.ProcessChanges\(\) -\Wid=(\d*) local=(.*) \[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] pos from (\d*) -> (\d*)/);
    if (match) {
        var _match4 = _slicedToArray(match, 11);

        var id = _match4[1];
        var local = _match4[2];
        var entityId = _match4[3];
        var cardId = _match4[4];
        var type = _match4[5];
        var zone = _match4[6];
        var zonePos = _match4[7];
        var playerId = _match4[8];
        var fromPos = _match4[9];
        var toPos = _match4[10];

        return parsePosChange(parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), parseInt(fromPos), parseInt(toPos));
    }
};

module.exports = {
    filename: "Zone.log",
    parsers: [detectPlayerZoneChange, detectOpponentCardChange, detectPlayerPositionZoneChange, detectOpponentPositionZoneChange]
};