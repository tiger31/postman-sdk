module.exports = (core) => core.get((utils) => {

    utils._exportVariable = (scope, name, variable, options = {}) => {
        const { 
            printValue
        } = options;

        pm[scope].set(name, variable);
        if (printValue)
            console.log(`[${scope}] ${name} -> ${variable}`);
    }

    utils._deepExportObject = (scope, prefix, obj, options = {}) => {
        const { 
            delimiter = '.'
        } = options;

        const objectKeys = Object.keys(obj);
        for (const key of objectKeys) {
            const exportKey = prefix.concat(delimiter, key);
            const value = obj[key];
            if (typeof(value) == 'object' && value !== null) {
                const objJson = JSON.stringify(value)
                utils._exportVariable(scope, exportKey, objJson, options)
                utils._deepExportObject(scope, exportKey, value, options)
            } else 
                utils._exportVariable(scope, exportKey, value, options)
        }
    }
});