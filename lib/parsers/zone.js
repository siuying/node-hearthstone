var parseZoneChange = function(id, local, name, entityId, zone, zonePos, cardId, playerId, fromZone, toZone) {
    return ["zone_change", {id: entityId, player_id: playerId, card_id: cardId, from_zone: fromZone, to_zone: toZone}];
};

var parsePosChange = function(entityId, zone, zonePos, cardId, playerId, fromPos, toPos) {
    return ["pos_change", {id: entityId, player_id: playerId, card_id: cardId, from_pos: fromPos, to_pos: toPos, zone: zone}];
};

var detectPlayerZoneChange = function(line) {
    var match = line.match(/ZoneChangeList\.ProcessChanges\(\) -\Wid=(\d*) local=(.*) \[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] zone from (.*) -> (.*)/);
    if (match) {
        var [, id, local, name, entityId, zone, zonePos, cardId, playerId, fromZone, toZone] = match;
        return parseZoneChange(id, local, name, parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), fromZone, toZone);
    }
};

var detectOpponentCardChange = function(line) {
    var match = line.match(/ZoneChangeList\.ProcessChanges\(\) -\Wid=(\d*) local=(.*) \[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] zone from (.*) -> (.*)/);
    if (match) {
        var [, id, local, entityId, cardId, type, zone, zonePos, playerId, fromZone, toZone] = match;
        return parseZoneChange(id, local, "", parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), fromZone, toZone);
    }
};

var detectPlayerPositionZoneChange = function(line) {
    var match = line.match(/ZoneChangeList\.ProcessChanges\(\) -\Wid=(\d*) local=(.*) \[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] pos from (\d*) -> (\d*)/);
    if (match) {
        var [, id, local, name, entityId, zone, zonePos, cardId, playerId, fromPos, toPos] = match;
        return parsePosChange(parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), parseInt(fromPos), parseInt(toPos));
    }
};

var detectOpponentPositionZoneChange = function(line) {
    var match = line.match(/ZoneChangeList\.ProcessChanges\(\) -\Wid=(\d*) local=(.*) \[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] pos from (\d*) -> (\d*)/);
    if (match) {
        var [, id, local, entityId, cardId, type, zone, zonePos, playerId, fromPos, toPos] = match;
        return parsePosChange(parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), parseInt(fromPos), parseInt(toPos));
    }
};

module.exports = {
    filename: "Zone.log",
    parsers: [
        detectPlayerZoneChange, 
        detectOpponentCardChange,
        detectPlayerPositionZoneChange,
        detectOpponentPositionZoneChange
    ]
}