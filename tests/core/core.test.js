const Core = require(`../../core.js`);

describe("Core", () => {
    describe("Core.get [Module resolvation]", () => {
        it("Resolve independent module", () => {
            const core = new Core();
            const exportModule = core.module("export");
            chai.expect(exportModule).to.include.keys(['_exportVariable', '_deepExportObject'])
        });
        it("Resolve module with one dependency", () => {
            const core = new Core();
            const exportModule = core.module("preset");
            chai.expect(exportModule).to.include.keys(['_exportVariable', '_deepExportObject', 'usePreset'])
        })
    });
});