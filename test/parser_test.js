var Parser = require("../hearthstone").Parser;
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
var should = chai.should(), expect = chai.expect;

describe('Parser', function(){
  var parser = new Parser();
  var result;

  describe('#parseLine()', function(){
    it('should parse startup', function(){
        result = parser.parseLine('Initialize engine version 1');
        expect(result).to.deep.equal(["startup"]);
    });

    it('should parse begin speculator mode', function(){
        result = parser.parseLine("[Power]  Begin Spectating");
        expect(result).to.deep.equal(["begin_spectator_mode"]);
    });

    it('should parse end speculator mode', function(){
        result = parser.parseLine("[Power]  End Spectator Mode")
        expect(result).to.deep.equal(["end_spectator_mode"]);
    });

    it('should parse mode change', function(){
        result = parser.parseLine("[LoadingScreen] LoadingScreen.OnSceneLoaded() - prevMode=HUB currMode=DRAFT")
        expect(result).to.deep.equal(["mode", "arena"]);

        result = parser.parseLine("[LoadingScreen] LoadingScreen.OnSceneLoaded() - prevMode=HUB currMode=TOURNAMENT")
        expect(result).to.deep.equal(["mode", "ranked"]);

        result = parser.parseLine("[LoadingScreen] LoadingScreen.OnSceneLoaded() - prevMode=HUB currMode=ADVENTURE")
        expect(result).to.deep.equal(["mode", "solo"]);
    });

    describe("Tag Change", function(){
      it("should find player id", function(){
        result = parser.parseLine("[Power] GameState.DebugPrintPower() - TAG_CHANGE Entity=siuying tag=PLAYER_ID value=2")
        expect(result).to.deep.equal(["player_id", {name: "siuying", player_id: 2}]);
      })

      it("should find first player", function(){
        result = parser.parseLine("[Power] GameState.DebugPrintPower() - TAG_CHANGE Entity=begize tag=FIRST_PLAYER value=1")
        expect(result).to.deep.equal(["first_player", {name: "begize"}]);
      })

      it("should find player win state", function(){
        result = parser.parseLine("[Power] GameState.DebugPrintPower() - TAG_CHANGE Entity=begize tag=PLAYSTATE value=WON")
        expect(result).to.deep.equal(["game_over", {name: "begize", state: "WON"}]);
      })

      it("should find game start", function(){
        result = parser.parseLine("[Power] GameState.DebugPrintPower() - TAG_CHANGE Entity=GameEntity tag=TURN_START value=1418310864")
        expect(result).to.deep.equal(["game_start", {timestamp: 1418310864}]);
      })

      it("should find turn start", function(){
        result = parser.parseLine("[Power] GameState.DebugPrintPower() -     TAG_CHANGE Entity=siuying tag=TURN_START value=1418309639")
        expect(result).to.deep.equal(["turn_start", {name: "siuying", timestamp: 1418309639}]);
      })

      it("should find turn number", function(){
        result = parser.parseLine("[Power] GameState.DebugPrintPower() -     TAG_CHANGE Entity=GameEntity tag=TURN value=3")
        expect(result).to.deep.equal(["turn", 3]);
      })
    });

    describe("Tag Change with details", function(){
      it("should find damage", function(){
        result = parser.parseLine("[Power] GameState.DebugPrintPower() -     TAG_CHANGE Entity=[name=Silver Hand Recruit id=71 zone=PLAY zonePos=1 cardId=CS2_101t player=1] tag=DAMAGE value=2")
        expect(result).to.deep.equal(["damage", {id: 71, player_id: 1, value: 2, card_id: "CS2_101t"}]);
      });

      it("should find attacking", function(){
        result = parser.parseLine("[Power] GameState.DebugPrintPower() -     TAG_CHANGE Entity=[name=Uther Lightbringer id=4 zone=PLAY zonePos=0 cardId=HERO_04 player=1] tag=ATTACKING value=1")
        expect(result).to.deep.equal(["attacking", {id: 4, player_id: 1, card_id: "HERO_04"}]);
      });

      it("should find defending", function(){
        result = parser.parseLine("[Power] GameState.DebugPrintPower() -     TAG_CHANGE Entity=[name=Rexxar id=36 zone=PLAY zonePos=0 cardId=HERO_05 player=2] tag=DEFENDING value=1")
        expect(result).to.deep.equal(["defending", {id: 36, player_id: 2, card_id: "HERO_05"}]);
      });

      it("should find card target", function(){
        result = parser.parseLine("[Power] GameState.DebugPrintPower() -     TAG_CHANGE Entity=[name=Fireblast id=37 zone=PLAY zonePos=0 cardId=CS2_034 player=2] tag=CARD_TARGET value=9")
        expect(result).to.deep.equal(["card_target", {id: 37, player_id: 2, target_id: 9, card_id: "CS2_034"}]);
      });
    });

    describe("Zone Change", function(){
      describe("HAND", function(){
        it("should find card received", function(){
          result = parser.parseLine("[Zone] ZoneChangeList.ProcessChanges() - id=47 local=False [name=Reversing Switch id=72 zone=HAND zonePos=7 cardId=PART_006 player=1] zone from  -> FRIENDLY HAND")
          expect(result).to.deep.equal(["zone_change", {id: 72, player_id: 1, card_id: "PART_006", from_zone: "", to_zone: "FRIENDLY HAND"}]);
        })

        it("should find card received (opponent)", function(){
          result = parser.parseLine("[Zone] ZoneChangeList.ProcessChanges() - id=1 local=False [id=22 cardId= type=INVALID zone=HAND zonePos=4 player=1] zone from  -> OPPOSING HAND")
          expect(result).to.deep.equal(["zone_change", {id: 22, player_id: 1, card_id: "", from_zone: "", to_zone: "OPPOSING HAND"}]);
        })

        it("should find card draw", function(){
          var line = "[Zone] ZoneChangeList.ProcessChanges() - id=27 local=False [name=Boulderfist Ogre id=10 zone=HAND zonePos=0 cardId=CS2_200 player=1] zone from FRIENDLY DECK -> FRIENDLY HAND"
          result = parser.parseLine(line);
          expect(result).to.deep.equal(["zone_change", {id: 10, player_id: 1, card_id: "CS2_200", from_zone: "FRIENDLY DECK", to_zone: "FRIENDLY HAND"}]);
        })

        it("should find card draw (opponent)", function(){
          var line = "[Zone] ZoneChangeList.ProcessChanges() - id=16 local=False [id=57 cardId= type=INVALID zone=HAND zonePos=0 player=2] zone from OPPOSING DECK -> OPPOSING HAND"
          result = parser.parseLine(line);
          expect(result).to.deep.equal(["zone_change", {id: 57, player_id: 2, card_id: "", from_zone: "OPPOSING DECK", to_zone: "OPPOSING HAND"}]);
        })

        it("should find return card", function(){
          var line = "[Zone] ZoneChangeList.ProcessChanges() - id=45 local=False [name=Harvest Golem id=10 zone=HAND zonePos=1 cardId=EX1_556 player=1] zone from FRIENDLY PLAY -> FRIENDLY HAND"
          result = parser.parseLine(line);
          expect(result).to.deep.equal(["zone_change", {id: 10, player_id: 1, card_id: "EX1_556", from_zone: "FRIENDLY PLAY", to_zone: "FRIENDLY HAND"}]);
        })

        it("should find return card (opponent)", function(){
          var line = "[Zone] ZoneChangeList.ProcessChanges() - id=20 local=False [name=Leper Gnome id=26 zone=HAND zonePos=2 cardId=EX1_029 player=1] zone from OPPOSING PLAY -> OPPOSING HAND"
          result = parser.parseLine(line);
          expect(result).to.deep.equal(["zone_change", {id: 26, player_id: 1, card_id: "EX1_029", from_zone: "OPPOSING PLAY", to_zone: "OPPOSING HAND"}]);
        })
      });

      describe("PLAY", function(){
        var line;
        it("should find play card", function(){
          line = "[Zone] ZoneChangeList.ProcessChanges() - id=1 local=True [name=Loot Hoarder id=57 zone=HAND zonePos=2 cardId=EX1_096 player=2] zone from FRIENDLY HAND -> FRIENDLY PLAY"
          result = parser.parseLine(line);
          expect(result).to.deep.equal(["zone_change", {id: 57, player_id: 2, card_id: "EX1_096", from_zone: "FRIENDLY HAND", to_zone: "FRIENDLY PLAY"}]);
        })
      });
      
    });

    describe("Pos Change", function(){
        var line;
        it("should find zone position change", function(){
          line = "[Zone] ZoneChangeList.ProcessChanges() - id=1 local=True [name=Harvest Golem id=10 zone=HAND zonePos=3 cardId=EX1_556 player=1] pos from 3 -> 2"
          result = parser.parseLine(line);
          expect(result).to.deep.equal(["pos_change", {id: 10, player_id: 1, card_id: "EX1_556", from_pos: 3, to_pos: 2, zone: "HAND"}]);
        })
    });
  });


})