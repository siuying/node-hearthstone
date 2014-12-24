var fs = require('fs');

class Configurator {
    constructor(path) {
        this.path = path ? path : Configurator.defaultConfigPath();
    }

    configNeeded() {
        if (!this.path) {
            throw "Path cannot be nil";
        }

        if (!fs.existsSync(this.path)) {
            return true;
        }

        var data = fs.readFileSync(this.path).toString();
        return !data.match(/\[Zone\]/) && !data.match(/\[Power\]/) && !data.match(/\[LoadingScreen\]/);
    }

    config() {
        if (!this.path) {
            throw "Path cannot be nil";
        }

        var config = "[ZONE]\n" + 
            "LogLevel=1\n" + 
            "FilePrinting=false\n" + 
            "ConsolePrinting=true\n" + 
            "ScreenPrinting=false\n\n" + 
            "[Power]\n" + 
            "LogLevel=1\n" + 
            "ConsolePrinting=true\n" + 
            "[LoadingScreen]\n" +
            "LogLevel=1\n" +
            "FilePrinting=false\n" +
            "ConsolePrinting=true\n" +
            "ScreenPrinting=false"

        var mode = "w"
        if (fs.existsSync(this.path)) {
            mode = "a"
        }
        fs.writeFileSync(this.path, config, {flag: mode});
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
        return `${home}/Library/Logs/Unity/Player.log`;
    }

    static defaultOutputPath() {
        var home = this.getUserHome();
        return `${home}/Documents/hearthstone`;
    }
};

module.exports = Configurator;