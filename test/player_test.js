var Player = require("../lib/player");
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
var should = chai.should(), expect = chai.expect;

describe('Player', function(){
  var player = new Player(1, "siuying");
  describe("toObject()", function(){
    it("should return data object", function(){
        var data = player.toObject();
        expect(data).to.deep.equal({id: 1, name: "siuying", first_player: false, result: null})
    });

    it("should return data object with result", function(){
        player.result = "WON";
        player.firstPlayer = true;
        var data = player.toObject();

        expect(data).to.deep.equal({id: 1, name: "siuying", first_player: true, result: "WON"})
    });
  });
});