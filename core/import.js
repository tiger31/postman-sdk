module.exports = (core) => core.get((utils) => {
    utils._importObject = (scope, keys) => {
        return keys.reduce((o, k) => {
            o[k] = pm[scope].get(k);
            return o;
        }, {});
    }
})