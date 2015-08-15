"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');

var Configurator = (function () {
    function Configurator(path) {
        _classCallCheck(this, Configurator);

        this.path = path ? path : Configurator.defaultConfigPath();
    }

    _createClass(Configurator, [{
        key: "configNeeded",
        value: function configNeeded() {
            if (!this.path) {
                throw "Path cannot be nil";
            }

            if (!fs.existsSync(this.path)) {
                return true;
            }

            var data = fs.readFileSync(this.path).toString();
            return !data.match(/\[Zone\]/) && !data.match(/\[Power\]/) && !data.match(/\[LoadingScreen\]/);
        }
    }, {
        key: "config",
        value: function config() {
            if (!this.path) {
                throw "Path cannot be nil";
            }

            var config = "[ZONE]\n" + "LogLevel=1\n" + "FilePrinting=false\n" + "ConsolePrinting=true\n" + "ScreenPrinting=false\n\n" + "[Power]\n" + "LogLevel=1\n" + "ConsolePrinting=true\n" + "[LoadingScreen]\n" + "LogLevel=1\n" + "FilePrinting=false\n" + "ConsolePrinting=true\n" + "ScreenPrinting=false";

            var mode = "w";
            if (fs.existsSync(this.path)) {
                mode = "a";
            }
            fs.writeFileSync(this.path, config, { flag: mode });
        }
    }], [{
        key: "getUserHome",
        value: function getUserHome() {
            var isWindows = process.platform === 'win32';
            return isWindows ? process.env.USERPROFILE : process.env.HOME;
        }
    }, {
        key: "defaultConfigPath",
        value: function defaultConfigPath() {
            var home = this.getUserHome();
            return home + "/Library/Preferences/Blizzard/Hearthstone/log.config";
        }
    }, {
        key: "defaultInputPath",
        value: function defaultInputPath() {
            var home = this.getUserHome();
            return home + "/Library/Logs/Unity/Player.log";
        }
    }, {
        key: "defaultOutputPath",
        value: function defaultOutputPath() {
            var home = this.getUserHome();
            return home + "/Documents/hearthstone";
        }
    }]);

    return Configurator;
})();

;

module.exports = Configurator;