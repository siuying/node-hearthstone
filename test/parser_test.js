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

  });
})