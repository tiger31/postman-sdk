const Path = require('path');

module.exports = class CatSDKCore {
    get(required, exportFn) {
        const requires = required instanceof Function;
        const requiredModules = (requires) ? [] : required;
        const exportFunction = ((requires) ? required : exportFn) || (a => a);

        const utils = requiredModules.reduce((_utils, moduleName) => {
            return this.module(moduleName);
        }, {})

        return exportFunction(utils) || utils;
    }

    module(moduleName) {
        const module = this._resolve('core', moduleName);
        return module(this);
    }

    _resolve(...path) {
        return require(Path.resolve(...path));
    }

    _resolveClass() {

    }
}