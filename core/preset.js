module.exports = (core) => core.get(["export"], (utils) => {
    utils.usePreset = (presetName, options = {}) => {
        const {
            defaultKey
        } = options;

        const defaultKeyFallbackLocation = '$default';

        try {
            const preset = JSON.parse(pm.collectionVariables.get(presetName)) || {}
            const defaultValue = (defaultKey) ? preset[defaultKey]
             : (preset[defaultKeyFallbackLocation]) ? preset[preset[defaultKeyFallbackLocation]] 
             : null;

            if (defaultValue) {
                if (typeof defaultValue == 'object') {
                    utils._exportVariable('variables', presetName, JSON.stringify(defaultValue), options);
                    utils._deepExportObject('variables', presetName, defaultValue, options);
                } else
                    utils._exportVariable('variables', presetName, defaultValue, options);
            }
            
            delete preset[defaultKeyFallbackLocation];
            utils._deepExportObject("variables", presetName, preset, options);
        } catch (e) {
            console.warn(`Failed to import preset "${presetName}"`, e)
        }
    }
});
