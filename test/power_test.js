var Parser = require("../lib/parser");
var Power = require("../lib/parsers/power");
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
var should = chai.should(), expect = chai.expect;

describe('Power', function(){
    let parser = new Parser()
    var result;
    var line;

    describe('#parseLine()', function(){
        it('should parse PLAYER_ID', function(){
            line = "D 19:52:05.1191330 GameState.DebugPrintPower() - TAG_CHANGE Entity=siuying tag=PLAYER_ID value=2"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"type": "player_id", "name": "siuying", "player_id": 2}]);
        });

        it('should parse FIRST_PLAYER', function() {
            line = "D 19:52:05.1190760 GameState.DebugPrintPower() - TAG_CHANGE Entity=siuying tag=FIRST_PLAYER value=1"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"type": "first_player", "name": "siuying"}]);            
        })

        it('should parse PLAYSTATE', function() {
            line = "D 19:58:13.9250650 GameState.DebugPrintPower() - TAG_CHANGE Entity=siuying tag=PLAYSTATE value=CONCEDED"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"type": "playstate", "name": "siuying", "state": "CONCEDED"}]);

            line = "D 19:58:13.9250890 GameState.DebugPrintPower() - TAG_CHANGE Entity=siuying tag=PLAYSTATE value=LOST"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"type": "playstate", "name": "siuying", "state": "LOST"}]);

            line = "D 19:58:13.9251010 GameState.DebugPrintPower() - TAG_CHANGE Entity=seeker tag=PLAYSTATE value=WON"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"type": "playstate", "name": "seeker", "state": "WON"}]);
        })

        it('should parse CURRENT_PLAYER', function(){
            line = "D 19:52:05.1188850 GameState.DebugPrintPower() - TAG_CHANGE Entity=siuying tag=CURRENT_PLAYER value=1"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"type": "current_player", "name": "siuying"}]);

            line = "D 19:54:24.8082720 GameState.DebugPrintPower() -     TAG_CHANGE Entity=seeker tag=CURRENT_PLAYER value=0"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.be.undefined
        })

        it('should parse RESOURCES', function(){
            line = "D 19:52:40.6321030 GameState.DebugPrintPower() -     TAG_CHANGE Entity=siuying tag=RESOURCES value=2"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"type": "resources", "name": "siuying", "resources": 2}]);
        })

        it('should parse TURN', function(){
            line = "D 19:52:05.1193920 GameState.DebugPrintPower() - TAG_CHANGE Entity=GameEntity tag=TURN value=1"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"type": "turn", "number": 1}]);
        })

        it('should parse DAMAGE', function(){
            line = "D 19:54:21.8076840 GameState.DebugPrintPower() -     TAG_CHANGE Entity=[name=Anduin Wrynn id=66 zone=PLAY zonePos=0 cardId=HERO_09 player=2] tag=DAMAGE value=8"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"card_id": "HERO_09", "id": 66, "player_id": 2, "type": "damage", "value": 8}]);

            line = "D 19:55:40.9542770 GameState.DebugPrintPower() -     TAG_CHANGE Entity=[name=Northshire Cleric id=61 zone=PLAY zonePos=1 cardId=CS2_235 player=2] tag=DAMAGE value=2"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"card_id": "CS2_235", "id": 61, "player_id": 2, "type": "damage", "value": 2}]);
        })

        it('should parse ATTACKING', function(){
            line = "D 19:54:20.0908850 GameState.DebugPrintPower() -     TAG_CHANGE Entity=[name=Shielded Minibot id=13 zone=PLAY zonePos=1 cardId=GVG_058 player=1] tag=ATTACKING value=1"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"card_id": "GVG_058", "id": 13, "player_id": 1, "type": "attacking"}]);

            line = "D 19:53:39.6649200 GameState.DebugPrintPower() -     TAG_CHANGE Entity=[name=Shielded Minibot id=13 zone=PLAY zonePos=1 cardId=GVG_058 player=1] tag=ATTACKING value=0"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.be.undefined
        })

        it('should parse DEFENDING', function(){
            line = "D 19:56:41.0524650 GameState.DebugPrintPower() -     TAG_CHANGE Entity=[name=Anduin Wrynn id=66 zone=PLAY zonePos=0 cardId=HERO_09 player=2] tag=DEFENDING value=1"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"card_id": "HERO_09", "id": 66, "player_id": 2, "type": "defending"}]);

            line = "D 19:56:41.0524650 GameState.DebugPrintPower() -     TAG_CHANGE Entity=[name=Anduin Wrynn id=66 zone=PLAY zonePos=0 cardId=HERO_09 player=2] tag=DEFENDING value=0"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.be.undefined
        })

        it('should parse CARD_TARGET', function(){
            line = "D 19:57:33.7840100 GameState.DebugPrintPower() -     TAG_CHANGE Entity=[name=Velen's Chosen id=45 zone=HAND zonePos=3 cardId=GVG_010 player=2] tag=CARD_TARGET value=57"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"card_id": "GVG_010", "id": 45, "player_id": 2, "target_id": 57,  "type": "card_target"}]);
        })
        
        it('should parse ARMOR', function(){
            // TODO: Add ARMOR
        })

        it('should parse ATK', function(){
            line = "D 19:57:33.7841640 GameState.DebugPrintPower() -     TAG_CHANGE Entity=[name=Wyrmrest Agent id=57 zone=PLAY zonePos=2 cardId=AT_116 player=2] tag=ATK value=4"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"card_id": "AT_116", "id": 57, "player_id": 2, "attack": 4, "type": "attack"}]);
        })

        it('should parse HEALTH', function(){
            line = "D 19:57:33.7841520 GameState.DebugPrintPower() -     TAG_CHANGE Entity=[name=Wyrmrest Agent id=57 zone=PLAY zonePos=2 cardId=AT_116 player=2] tag=HEALTH value=8"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"card_id": "AT_116", "id": 57, "player_id": 2, "health": 8, "type": "health"}]);
        })

        it('should parse GameEntity state change', () => {
            line = "D 19:58:13.9251880 GameState.DebugPrintPower() - TAG_CHANGE Entity=GameEntity tag=STATE value=COMPLETE"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"type": "game_over"}]);

            line = "D 19:58:13.9251880 GameState.DebugPrintPower() - TAG_CHANGE Entity=GameEntity tag=STATE value=RUNNING"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["tag_change", {"type": "game_start"}]);
        })

        it('should parse POWER with target', () => {
            line = "D 19:54:33.3756120 GameState.DebugPrintPower() -     ACTION_START Entity=[name=Lesser Heal id=67 zone=PLAY zonePos=0 cardId=CS1h_001 player=2] BlockType=POWER Index=-1 Target=[name=Anduin Wrynn id=66 zone=PLAY zonePos=0 cardId=HERO_09 player=2]"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["action_start", {"type": "power", "source": {"card_id": "CS1h_001", "id": 67, "player_id": 2}, "target": {"card_id": "HERO_09", "id": 66, "player_id": 2} }]);
        })

        it('should parse PLAY with target', () => {
            line = "D 19:57:40.5005690 GameState.DebugPrintPower() - ACTION_START Entity=[name=Lesser Heal id=67 zone=PLAY zonePos=0 cardId=CS1h_001 player=2] BlockType=PLAY Index=0 Target=[name=Anduin Wrynn id=66 zone=PLAY zonePos=0 cardId=HERO_09 player=2]"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["action_start", {"type": "play", "source": {"card_id": "CS1h_001", "id": 67, "player_id": 2}, "target": {"card_id": "HERO_09", "id": 66, "player_id": 2} }]);
        })

        it('should parse PLAY without target', () => {
            line = "D 19:56:54.7528260 GameState.DebugPrintPower() - ACTION_START Entity=[name=Lightbomb id=63 zone=HAND zonePos=4 cardId=GVG_008 player=2] BlockType=PLAY Index=0 Target=0"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["action_start", {
                "type": "play", 
                "source": {"card_id": "GVG_008", "id": 63, "player_id": 2}, 
                "target": {"id": 0} 
            }]);
        })

        it('should parse ATTACK', () => {
            line = "D 19:55:08.2397940 GameState.DebugPrintPower() - ACTION_START Entity=[name=Uther Lightbringer id=64 zone=PLAY zonePos=0 cardId=HERO_04 player=1] BlockType=ATTACK Index=-1 Target=[name=Anduin Wrynn id=66 zone=PLAY zonePos=0 cardId=HERO_09 player=2]"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["action_start", {
                "type": "attack", 
                "source": {"card_id": "HERO_04", "id": 64, "player_id": 1},
                "target": {"card_id": "HERO_09", "id": 66, "player_id": 2}
            }]);

            line = "D 19:55:53.4046920 GameState.DebugPrintPower() - ACTION_START Entity=[name=Twilight Guardian id=38 zone=PLAY zonePos=1 cardId=AT_017 player=2] BlockType=ATTACK Index=-1 Target=[name=Uther Lightbringer id=64 zone=PLAY zonePos=0 cardId=HERO_04 player=1]"
            result = parser.parseLine(Power.parsers, line);
            expect(result).to.deep.equal(["action_start", {
                "type": "attack", 
                "source": {"card_id": "AT_017", "id": 38, "player_id": 2},
                "target": {"card_id": "HERO_04", "id": 64, "player_id": 1}
            }]);
        })
    })
})