'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var touch = require('touch');

var Configurator = (function () {
    function Configurator(configPath, inputPath) {
        _classCallCheck(this, Configurator);

        this.configPath = configPath ? configPath : Configurator.defaultConfigPath();
        this.inputPath = inputPath ? inputPath : Configurator.defaultInputPath();
    }

    _createClass(Configurator, [{
        key: 'configNeeded',
        value: function configNeeded() {
            if (!this.configPath) {
                throw "Path cannot be nil";
            }

            if (!fs.existsSync(this.configPath)) {
                return true;
            }

            var data = fs.readFileSync(this.configPath).toString();
            return !data.match(/\[Zone\]/) && !data.match(/\[Power\]/) && !data.match(/\[LoadingScreen\]/);
        }
    }, {
        key: 'config',
        value: function config() {
            if (!this.configPath) {
                throw "Config Path cannot be nil";
            }
            if (!this.inputPath) {
                throw "Input Path cannot be nil";
            }

            var config = "[Zone]\
LogLevel=1\
FilePrinting=true\
ConsolePrinting=false\
ScreenPrinting=false\
[Bob]\
LogLevel=1\
FilePrinting=true\
ConsolePrinting=false\
ScreenPrinting=false\
[Power]\
LogLevel=1\
FilePrinting=true\
ConsolePrinting=false\
ScreenPrinting=false\
[Asset]\
LogLevel=1\
FilePrinting=true\
ConsolePrinting=false\
ScreenPrinting=false\
[Rachelle]\
LogLevel=1\
FilePrinting=true\
ConsolePrinting=false\
ScreenPrinting=false\
[Arena]\
LogLevel=1\
FilePrinting=true\
ConsolePrinting=false\
ScreenPrinting=false";

            var mode = "w";
            if (fs.existsSync(this.configPath)) {
                mode = "a";
            }
            fs.writeFileSync(this.configPath, config, { flag: mode });
        }
    }], [{
        key: 'getUserHome',
        value: function getUserHome() {
            var isWindows = process.platform === 'win32';
            return isWindows ? process.env.USERPROFILE : process.env.HOME;
        }
    }, {
        key: 'defaultConfigPath',
        value: function defaultConfigPath() {
            var home = this.getUserHome();
            return home + '/Library/Preferences/Blizzard/Hearthstone/log.config';
        }
    }, {
        key: 'defaultInputPath',
        value: function defaultInputPath() {
            var home = this.getUserHome();
            return '/Applications/Hearthstone/Logs/';
        }
    }, {
        key: 'defaultOutputPath',
        value: function defaultOutputPath() {
            var home = this.getUserHome();
            return home + '/Documents/hearthstone';
        }
    }]);

    return Configurator;
})();

;

module.exports = Configurator;