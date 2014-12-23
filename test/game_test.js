var Game = require("../lib/game");
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
var should = chai.should(), expect = chai.expect;

describe('Game', function(){
  var game;

  beforeEach(function(){
    game = new Game();  
  });  

  describe("addEvent", function(){
    describe('tag_change', function(){
        it("should set player_id", function(){
            game.addEvent(["tag_change", {type: "player_id", name: "siuying", player_id: 1}]);

            var siuying = game.players[0];
            expect(siuying.name).to.equal("siuying");
            expect(siuying.id).to.equal(1);
        })

        it("should set first_player", function(){
            game.addEvent(["tag_change", {type: "player_id", name: "siuying", player_id: 1}]);
            game.addEvent(["tag_change", {type: "player_id", name: "cho", player_id: 2}]);

            var cho = game.players[1];
            expect(cho.name).to.equal("cho");
            expect(cho.id).to.equal(2);
            expect(cho.firstPlayer).to.equal(false);

            game.addEvent(["tag_change", {type: "first_player", name: "cho"}]);
            expect(cho.firstPlayer).to.equal(true);
        })

        it("should set result", function(){
            game.addEvent(["tag_change", {type: "player_id", name: "siuying", player_id: 1}]);
            game.addEvent(["tag_change", {type: "game_over", name: "siuying", state: "WON"}]);

            var siuying = game.players[0];
            expect(siuying.result).to.equal("WON");
        })
      })
  })

  describe("isCompleted()", function(){
    it("should return false when game is not ended", function(){
        game.addEvent(["tag_change", {type: "player_id", name: "siuying", player_id: 1}]);
        game.addEvent(["tag_change", {type: "player_id", name: "cho", player_id: 2}]);
        expect(game.isCompleted()).to.equal(false);
    })

    it("should return true when game has ended", function(){
        game.addEvent(["tag_change", {type: "player_id", name: "siuying", player_id: 1}]);
        game.addEvent(["tag_change", {type: "player_id", name: "cho", player_id: 2}]);
        game.addEvent(["tag_change", {type: "game_over", name: "siuying", state: "WON"}])
        game.addEvent(["tag_change", {type: "game_over", name: "cho", state: "LOST"}])
        expect(game.isCompleted()).to.equal(true);
    })
  });

  describe("toObject()", function(){
    it("should return data object", function(){
        game.mode = "ranked"
        game.addEvent(["tag_change", {type: "player_id", name: "siuying", player_id: 1}]);
        game.addEvent(["tag_change", {type: "player_id", name: "cho", player_id: 2}]);
        game.addEvent(["tag_change", {type: "first_player", name: "siuying"}]);
        game.addEvent(["tag_change", {type: "game_over", name: "siuying", state: "WON"}])
        game.addEvent(["tag_change", {type: "game_over", name: "cho", state: "LOST"}])

        expect(game.toObject()).to.deep.equal({
            mode: "ranked", 
            players: [
                {id: 1, name: "siuying", first_player: true, result: "WON"}, 
                {id: 2, name: "cho", first_player: false, result: "LOST"}
            ], 
            events: [ ["tag_change", {type: "player_id", name: "siuying", player_id: 1}], 
                ["tag_change", {type: "player_id", name: "cho", player_id: 2}],
                ["tag_change", {type: "first_player", name: "siuying"}],
                ["tag_change", {type: "game_over", name: "siuying", state: "WON"}],
                ["tag_change", {type: "game_over", name: "cho", state: "LOST"}]
            ]
        });
    });

    describe("filename", function(){
        it("should return filename", function(){
            game.mode = "ranked";
            game.addEvent(["tag_change", {type: "player_id", name: "siuying", player_id: 1}]);
            game.addEvent(["tag_change", {type: "player_id", name: "cho", player_id: 2}]);
            game.addEvent(["tag_change", {type: "game_start", timestamp: 1419332929}]);
            expect(game.filename()).to.equal("1419332929_ranked_siuying_v_cho");
        });
    });
  });
  
});