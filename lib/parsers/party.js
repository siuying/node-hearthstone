// POWER
var beginSpectatorMode = function(line) {
    if (line.match(/Begin Spectating/)) {
        return ["begin_spectator_mode"];
    }
};

// POWER
var endSpectatorMode = function(line) {
    if (line.match(/End Spectator/)) {
        return ["end_spectator_mode"];
    }
};

module.exports = {
    filename: "Party.log",
    parsers: [
        beginSpectatorMode, 
        endSpectatorMode
    ]
}