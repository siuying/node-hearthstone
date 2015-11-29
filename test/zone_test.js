var Parser = require("../lib/parser");
var Zone = require("../lib/parsers/zone");
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
var should = chai.should(), expect = chai.expect;

describe('Zone', function(){
    let parser = new Parser()
    var result;
    var line;

    describe('#parseLine()', function(){
        it('should parse opposing card zone change', function(){
            line = "D 19:53:42.9968740 ZoneChangeList.ProcessChanges() - id=17 local=False [name=Blessing of Kings id=26 zone=GRAVEYARD zonePos=0 cardId=CS2_092 player=1] zone from  -> OPPOSING GRAVEYARD"
            result = parser.parseLine(Zone.parsers, line);
            expect(result).to.deep.equal(["zone_change", {"card_id": "CS2_092", "from_zone": "", "id": 26, "player_id": 1, "to_zone": "OPPOSING GRAVEYARD"}]);

            line = "D 19:55:30.7675890 ZoneChangeList.ProcessChanges() - id=39 local=False [id=25 cardId= type=INVALID zone=HAND zonePos=0 player=1] zone from OPPOSING DECK -> OPPOSING HAND"
            result = parser.parseLine(Zone.parsers, line);
            expect(result).to.deep.equal(["zone_change", {"card_id": "", "from_zone": "OPPOSING DECK", "id": 25, "player_id": 1, "to_zone": "OPPOSING HAND"}]);
        });

        it('should parse friendly card zone change', function(){
            line = "D 19:52:05.0011970 ZoneChangeList.ProcessChanges() - id=1 local=False [id=37 cardId= type=INVALID zone=DECK zonePos=0 player=2] zone from  -> FRIENDLY DECK"
            result = parser.parseLine(Zone.parsers, line);
            expect(result).to.deep.equal(["zone_change", {"card_id": "", "from_zone": "", "id": 37, "player_id": 2, "to_zone": "FRIENDLY DECK"}]);

            line = "D 19:55:11.4950970 ZoneChangeList.ProcessChanges() - id=33 local=False [name=Northshire Cleric id=61 zone=HAND zonePos=0 cardId=CS2_235 player=2] zone from FRIENDLY DECK -> FRIENDLY HAND"
            result = parser.parseLine(Zone.parsers, line);
            expect(result).to.deep.equal(["zone_change", {"card_id": "CS2_235", "from_zone": "FRIENDLY DECK", "id": 61, "player_id": 2, "to_zone": "FRIENDLY HAND"}]);
        })
    })
})