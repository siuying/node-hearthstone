"use strict";

var detectCurrentMode = function detectCurrentMode(line) {
    var match = line.match(/LoadingScreen.OnSceneLoaded\(\) - prevMode=.* currMode=(.*)/);
    if (match) {
        var mode = match[1];
        switch (mode) {
            case "DRAFT":
                result = ["mode", "arena"];
                return true;
            case "TOURNAMENT":
                result = ["mode", "ranked"];
                return true;
            case "ADVENTURE":
                result = ["mode", "solo"];
                return true;
            case "TAVERN_BRAWL":
                result = ["mode", "brawl"];
                return true;
        }
    }
};