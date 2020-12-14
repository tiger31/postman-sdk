module.exports = (core) => core.get(['export', 'import', 'exposable'], (utils) => {
    utils.Environment = class Environment extends utils.Exposable {
        constructor(obj) {
            super();
            if (!obj.hpHost)
                throw new Error("Cannot create Environment without HostPilot host set")

            this._generate = obj._generate || false;
            this.hpHost = obj.hpHost;
            this.vpsHost = obj.vpsHost;
            this.vpsVersion = obj.vpsVersion;
            if (this._generate)
                _exportObject("environment", this._expose());
        }
        _generate;
        hpHost;
        vpsHost;
        vpsVersion;
        get siteURL() {
            return this.hpHost
        }
        get vpsURL() {
            const u = new URL({
                host: this.vpsHost,
                path: this.vpsVersion
            });
            return u.toString();
        }
    }
})