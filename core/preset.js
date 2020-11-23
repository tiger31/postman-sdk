module.exports = (core) => core.get(["export"], (utils) => {
    utils.usePreset = (presetName, options = {}) => {
        const {
            defaultKey = '$default'
        } = options;

        try {
            const preset = JSON.parse(pm.collectionVariables.get(presetName)) || {}
            if (defaultKey && preset[defaultKey])
                utils._exportVariable("variables", presetName, preset[defaultKey])
            utils._deepExportObject("variables", presetName, preset, options);
        } catch (e) {
            console.warn(`Failed to import preset "${presetName}"`, e)
        }
    }
});
