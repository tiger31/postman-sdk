/* 
 * Exports functions via collection scope. 
 * This gives opportunity to use them anywehre in scripts 
 */
const _export = (generator, name) => {
    pm.collectionVariables.set(name, generator.toString() + `; ${name}();`);
};

/* 
 * Object to variable utils
 */
_export(function _utils() {
    const utils = {};

    utils.exportObject = (obj) => {
        for (const property of Object.keys(obj))
            pm.variables.set(property, obj[property]);
    }  

    utils.exposeExportedObject = (obj) => {
        for (const property of Object.keys(obj))
            console.log(`${property} -> ${pm.variables.get(property)}`);
    }

    utils.use = (presetName, printValue = false) => {
        utils._exportPreset(presetName, printValue)
    }

    utils._exportPreset = (presetName, printValue = false) => {
        try {
            const preset = JSON.parse(pm.collectionVariables.get(presetName)) || {}
            utils._deepExportObject("variables", presetName, preset, printValue);
        } catch (e) {
            console.warn(`Failed to import preset "${presetName}"`, e)
        }
    }

    utils._exportVariable = (scope, name, variable, printValue = false) => {
        pm[scope].set(name, variable);
        if (printValue)
            console.log(`[${scope}] ${name} -> ${variable}`);
    }

    utils._deepExportObject = (scope, prefix, obj, printValue = false) => {
        const objectKeys = Object.keys(obj);
        for (const key of objectKeys) {
            const exportKey = prefix.concat('.', key) //hardcoded delim
            const value = obj[key];
            if (typeof(value) == 'object') {
                const objJson = JSON.stringify(value)
                utils._exportVariable(scope, exportKey, objJson, printValue)
                utils._deepExportObject(scope, exportKey, value, printValue)
            } else 
                utils._exportVariable(scope, exportKey, value, printValue)
        }
    }
    
    return utils;
}, "_utils");
const utils = eval(pm.collectionVariables.get("_utils"));

const _exportObjectToScope = (scope, obj) => {
    for (const key in obj)
        utils._exportVariable(scope, key, obj[key]);
}

const _importScopeToObect = (scope, keys) => {
    return keys.reduce((o, k) => {
        o[k] = pm[scope].get(k);
        return o;
    }, {});
}

/*
 * Environment autogen
 */
const URL = require('postman-collection').Url;

const exposable = class {
    _expose() {
        const toExpose = Array.prototype.concat.apply(
            Object.getOwnPropertyNames(this),
            Object.getOwnPropertyNames(this.constructor.prototype)
        ).filter(p => p !== 'constructor')
         .reduce((o, p) => { o[p] = this[p]; return o }, {});
        
        console.log(toExpose);
        return toExpose;
    }
}

const enviroment = class _Environment extends exposable {
    constructor(obj) {
        super();
        if (!obj.hpHost)
            throw new Error("Cannot create Environment without HostPilot host set")

        this._generate = obj._generate || false;
        this.hpHost = obj.hpHost;
        this.vpsHost = obj.vpsHost;
        this.vpsVersion = obj.vpsVersion;
        if (this._generate)
            _exportObjectToScope("environment", this._expose());
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

const env = new enviroment(_importScopeToObect(
    "environment",
     ["_generate", "hpHost", "vpsHost", "vpsVersion"])
);


