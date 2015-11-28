var initializeEngineVersion = function(line) {
    if (line.match(/^Initialize engine version/)) {
        return ["startup"];
    }
};
