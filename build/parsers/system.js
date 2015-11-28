"use strict";

var initializeEngineVersion = function initializeEngineVersion(line) {
    if (line.match(/^Initialize engine version/)) {
        return ["startup"];
    }
};