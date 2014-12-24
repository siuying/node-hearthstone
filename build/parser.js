$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var EventEmitter = require('events').EventEmitter;
  var Tail = require('file-tail');
  var Parser = function Parser() {
    $traceurRuntime.superConstructor($Parser).apply(this, arguments);
  };
  var $Parser = Parser;
  ($traceurRuntime.createClass)(Parser, {
    parse: function(file) {
      var parser = this;
      var tail = new Tail.startTailing(file);
      tail.on("line", function(line) {
        parser.parseLine(line);
      });
      tail.on('error', function(data) {
        console.error("error:", data);
      });
    },
    parseLine: function(line) {
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
        switch (mode) {
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
        var $__1 = match,
            entityId = $__1[1],
            zone = $__1[2],
            zonePos = $__1[3],
            cardId = $__1[4],
            playerId = $__1[5],
            type = $__1[6],
            state = $__1[7];
        result = this.parseTagChange(type, null, state, parseInt(playerId), parseInt(entityId), zone, parseInt(zonePos), cardId);
      } else if (match = line.match(/TAG_CHANGE Entity=(.*) tag=(.*) value=(.*)/)) {
        var $__2 = match,
            player = $__2[1],
            type = $__2[2],
            state = $__2[3];
        result = this.parseTagChange(type, player, state);
      } else if (match = line.match(/\[Zone\] ZoneChangeList\.ProcessChanges\(\) - id=(\d*) local=(.*) \[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] zone from (.*) -> (.*)/)) {
        var $__3 = match,
            id = $__3[1],
            local = $__3[2],
            name = $__3[3],
            entityId = $__3[4],
            zone = $__3[5],
            zonePos = $__3[6],
            cardId = $__3[7],
            playerId = $__3[8],
            fromZone = $__3[9],
            toZone = $__3[10];
        result = this.parseZoneChange(id, local, name, parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), fromZone, toZone);
      } else if (match = line.match(/\[Zone\] ZoneChangeList\.ProcessChanges\(\) - id=(\d*) local=(.*) \[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] zone from (.*) -> (.*)/)) {
        var $__4 = match,
            id = $__4[1],
            local = $__4[2],
            entityId = $__4[3],
            cardId = $__4[4],
            type = $__4[5],
            zone = $__4[6],
            zonePos = $__4[7],
            playerId = $__4[8],
            fromZone = $__4[9],
            toZone = $__4[10];
        result = this.parseZoneChange(id, local, "", parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), fromZone, toZone);
      } else if (match = line.match(/\[Zone\] ZoneChangeList\.ProcessChanges\(\) - id=(\d*) local=(.*) \[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] pos from (\d*) -> (\d*)/)) {
        var $__5 = match,
            id = $__5[1],
            local = $__5[2],
            name = $__5[3],
            entityId = $__5[4],
            zone = $__5[5],
            zonePos = $__5[6],
            cardId = $__5[7],
            playerId = $__5[8],
            fromPos = $__5[9],
            toPos = $__5[10];
        result = this.parsePosChange(parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), parseInt(fromPos), parseInt(toPos));
      } else if (match = line.match(/\[Zone\] ZoneChangeList\.ProcessChanges\(\) - id=(\d*) local=(.*) \[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] pos from (\d*) -> (\d*)/)) {
        var $__6 = match,
            id = $__6[1],
            local = $__6[2],
            entityId = $__6[3],
            cardId = $__6[4],
            type = $__6[5],
            zone = $__6[6],
            zonePos = $__6[7],
            playerId = $__6[8],
            fromPos = $__6[9],
            toPos = $__6[10];
        result = this.parsePosChange(parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), parseInt(fromPos), parseInt(toPos));
      } else if (match = line.match(/ACTION_START Entity=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\] SubType=ATTACK .* Target=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\]/)) {
        var $__7 = match,
            id = $__7[1],
            cardId = $__7[2],
            playerId = $__7[3],
            targetId = $__7[4],
            targetCardId = $__7[5],
            targetPlayerId = $__7[6];
        result = this.parseActionStart("attack", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), targetCardId, parseInt(targetPlayerId));
      } else if (match = line.match(/ACTION_START Entity=\[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] SubType=POWER Index=(.*) Target=\[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\]/)) {
        var $__8 = match,
            name = $__8[1],
            id = $__8[2],
            zone = $__8[3],
            zonePos = $__8[4],
            cardId = $__8[5],
            playerId = $__8[6],
            index = $__8[7],
            targetName = $__8[8],
            targetId = $__8[9],
            targetZone = $__8[10],
            targetZonePos = $__8[11],
            targetCardId = $__8[12],
            targetPlayerId = $__8[13];
        result = this.parseActionStart("power", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), targetCardId, parseInt(targetPlayerId));
      } else if (match = line.match(/ACTION_START Entity=\[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] SubType=POWER Index=(.*) Target=(\d*)/)) {
        var $__9 = match,
            id = $__9[1],
            cardId = $__9[2],
            type = $__9[3],
            zone = $__9[4],
            zonePos = $__9[5],
            playerId = $__9[6],
            index = $__9[7],
            targetId = $__9[8];
        result = this.parseActionStart("power", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), null, null);
      } else if (match = line.match(/ACTION_START Entity=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\] SubType=PLAY Index=(.*) Target=(\d*)/)) {
        var $__10 = match,
            id = $__10[1],
            cardId = $__10[2],
            playerId = $__10[3],
            index = $__10[4],
            targetId = $__10[5];
        result = this.parseActionStart("play", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), null, null);
      }
      this.emit.apply(this, result);
      return result;
    },
    parseTagChange: function(type, playerName, state, playerId, entityId, zone, zonePos, cardId) {
      switch (type) {
        case "PLAYER_ID":
          return ["tag_change", {
            type: "player_id",
            name: playerName,
            player_id: parseInt(state)
          }];
        case "FIRST_PLAYER":
          return ["tag_change", {
            type: "first_player",
            name: playerName
          }];
        case "PLAYSTATE":
          if (state == "WON" || state == "LOST") {
            return ["tag_change", {
              type: "game_over",
              name: playerName,
              state: state
            }];
          }
          break;
        case "TURN_START":
          if (playerName == "GameEntity") {
            return ["tag_change", {
              type: "game_start",
              timestamp: parseInt(state)
            }];
          } else {
            return ["tag_change", {
              type: "turn_start",
              name: playerName,
              timestamp: parseInt(state)
            }];
          }
        case "RESOURCES":
          return ["tag_change", {
            type: "resources",
            name: playerName,
            resources: parseInt(state)
          }];
        case "TURN":
          return ["tag_change", {
            type: "turn",
            number: parseInt(state)
          }];
        case "DAMAGE":
          return ["tag_change", {
            type: "damage",
            id: entityId,
            player_id: playerId,
            value: parseInt(state),
            card_id: cardId
          }];
        case "ATTACKING":
          return ["tag_change", {
            type: "attacking",
            id: entityId,
            player_id: playerId,
            card_id: cardId
          }];
        case "DEFENDING":
          return ["tag_change", {
            type: "defending",
            id: entityId,
            player_id: playerId,
            card_id: cardId
          }];
        case "CARD_TARGET":
          return ["tag_change", {
            type: "card_target",
            id: entityId,
            player_id: playerId,
            target_id: parseInt(state),
            card_id: cardId
          }];
        case "ARMOR":
          return ["tag_change", {
            type: "armor",
            id: entityId,
            armor: parseInt(state)
          }];
        case "ATK":
          return ["tag_change", {
            type: "attack",
            id: entityId,
            attack: parseInt(state)
          }];
        case "HEALTH":
          return ["tag_change", {
            type: "health",
            id: entityId,
            health: parseInt(state)
          }];
      }
    },
    parseZoneChange: function(id, local, name, entityId, zone, zonePos, cardId, playerId, fromZone, toZone) {
      return ["zone_change", {
        id: entityId,
        player_id: playerId,
        card_id: cardId,
        from_zone: fromZone,
        to_zone: toZone
      }];
    },
    parsePosChange: function(entityId, zone, zonePos, cardId, playerId, fromPos, toPos) {
      return ["pos_change", {
        id: entityId,
        player_id: playerId,
        card_id: cardId,
        from_pos: fromPos,
        to_pos: toPos,
        zone: zone
      }];
    },
    parseActionStart: function(type, sourceId, sourceCardId, sourcePlayerId, targetId, targetCardId, targetPlayerId) {
      var source = {
        id: sourceId,
        card_id: sourceCardId,
        player_id: sourcePlayerId
      };
      var target = {id: targetId};
      if (targetCardId) {
        target.card_id = targetCardId;
      }
      if (targetCardId) {
        target.player_id = targetPlayerId;
      }
      return ["action_start", {
        type: type,
        source: source,
        target: target
      }];
    }
  }, {}, EventEmitter);
  module.exports = Parser;
  return {};
});
