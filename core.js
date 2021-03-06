const Path = require('path');

module.exports = class CatSDKCore {
    get(required, exportFn) {
        return this._resolveDeps(required, exportFn, this.module)
    }

    _resolveDeps(required, exportFn, resolveFn) {
        const requires = required instanceof Function;
        const requiredModules = (requires) ? [] : required;
        const exportFunction = ((requires) ? required : exportFn) || (a => a);

        const utils = requiredModules.reduce((_utils, moduleName) => {
            return resolveFn.call(this, moduleName);
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
}