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

    describe("TAG_CHANGE", function(){
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
  });
})