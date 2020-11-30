module.exports = (core) => core.get(['export'], (utils) => {

    utils._getDefinedContextKeys = (contextName) => {
        return Object.keys(pm.environment)
            .filter(key => key.startsWith(`${contextName}:`));
    }
    
    utils.getContext = (contextName, options) => {
        return utils._getDefinedContextKeys(contextName).reduce((o, key) => {
            const realKey = key.replace(`${contextName}:`, '');
            o[realKey] = pm.environment.get(key);
            return o;
        }, {})
    };

    utils.setContext = (contextName, obj, options = {}) => {
        const {
            clear = false
        } = options;

        if (clear)
            utils.clearContext(contextName, options);

        for (const key in obj) {
            const exportKey = `${contextName}:${key}`;
            utils._exportVariable('environment', exportKey, obj[key], options)
        }
    };

    utils.clearContext = (contextName, options = {}) => {
        const {
            soft = false
        } = options;

        for (const key of utils._getDefinedContextKeys(contextName)) {
            if (soft)
                pm.environment.set(key, '');
            else
                pm.environment.unset(key);
        }
    };
})