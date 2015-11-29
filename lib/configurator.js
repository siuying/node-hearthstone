var fs = require('fs');
var touch = require('touch');

class Configurator {
    constructor(configPath, inputPath) {
        this.configPath = configPath ? configPath : Configurator.defaultConfigPath();
        this.inputPath = inputPath ? inputPath : Configurator.defaultInputPath();
    }

    configNeeded() {
        if (!this.configPath) {
            throw "Path cannot be nil";
        }

        if (!fs.existsSync(this.configPath)) {
            return true;
        }

        var data = fs.readFileSync(this.configPath).toString();
        return !data.match(/\[Zone\]/) && !data.match(/\[Power\]/) && !data.match(/\[LoadingScreen\]/);
    }

    config() {
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
ScreenPrinting=false"

        var mode = "w"
        if (fs.existsSync(this.configPath)) {
            mode = "a"
        }
        fs.writeFileSync(this.configPath, config, {flag: mode});
    }

    static getUserHome() {
        var isWindows = process.platform === 'win32';
        return isWindows ? process.env.USERPROFILE : process.env.HOME;
    }

    static defaultConfigPath() {
        var home = this.getUserHome();
        return `${home}/Library/Preferences/Blizzard/Hearthstone/log.config`;
    }

    static defaultInputPath() {
        var home = this.getUserHome();
        return `/Applications/Hearthstone/Logs/`;
    }

    static defaultOutputPath() {
        var home = this.getUserHome();
        return `${home}/Documents/hearthstone`;
    }
};

module.exports = Configurator;