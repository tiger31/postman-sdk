const core = new (require(`../../core.js`))();
const { expect } = require('chai');
const pm = require('../pm');

describe("Export module", () => {
    //Emit postman behaviour
    beforeEach(() => {
        global.pm = pm();
    })
    after(() => {
        delete global.pm;
    })

    describe("usePreset", () => {
        it("Export preset", () => {
            const presetModule = core.module('preset');
            const presetName = "foo";
            const presetValue = {
                foo: "bar",
                bar: {
                    baz: 42
                }
            }

            global.pm.collectionVariables.set(presetName, JSON.stringify(presetValue));

            const expected = Object.assign({
                foo: presetValue.foo,
                bar: JSON.stringify(presetValue.bar),
            }, utils.mapObjectKeys(presetValue.bar, utils.mappers.prefix('bar')))

            var expectedExports = utils.mapObjectKeys(expected, utils.mappers.prefix(presetName))

            presetModule.usePreset(presetName);
            expect(global.pm).to.include.property('variables')
                .and.to.include(expectedExports)
        });
        it("Export preset with default key referencing non-object type", () => {
            const presetModule = core.module('preset');
            const presetName = "foo";
            const presetValue = {
                $default: "foo",
                foo: "bar",
                bar: "baz",
            }

            global.pm.collectionVariables.set(presetName, JSON.stringify(presetValue));

            const expectedExports = utils.mapObjectKeys({
                foo: "bar",
                bar: "baz",
            }, utils.mappers.prefix(presetName))
            expectedExports[presetName] = presetValue[presetValue.$default];

            presetModule.usePreset(presetName);

            expect(global.pm).to.include.property('variables')
                .and.to.have.keys(...Object.keys(expectedExports))

            expect(global.pm).to.include.property('variables')
                .not.to.have.keys('$default');

            expect(global.pm).to.include.property('variables')
                .to.include(expectedExports)
        })
        it("Export preset with default key referencing object", () => {
            const presetModule = core.module('preset');
            const presetName = "foo";
            const presetValue = {
                $default: "bar",
                foo: "bar",
                bar: {
                    baz: 42
                }
            }

            global.pm.collectionVariables.set(presetName, JSON.stringify(presetValue));

            const expected = Object.assign({
                foo: presetValue.foo,
                bar: JSON.stringify(presetValue.bar),
            }, utils.mapObjectKeys(presetValue.bar, utils.mappers.prefix('bar')));

            var expectedExports = utils.mapObjectKeys(expected, utils.mappers.prefix(presetName))
            expectedExports[presetName] = JSON.stringify(presetValue.bar);
            Object.assign(expectedExports, utils.mapObjectKeys(presetValue.bar, utils.mappers.prefix(presetName)));

            presetModule.usePreset(presetName);

            expect(global.pm).to.include.property('variables')
                .and.to.have.keys(...Object.keys(expectedExports))

            expect(global.pm).to.include.property('variables')
                .not.to.have.keys('$default');

            expect(global.pm).to.include.property('variables')
                .to.include(expectedExports)
        });
        it("Export preset with override default key", () => {
            const presetModule = core.module('preset');
            const presetName = "foo";
            const presetValue = {
                $default: "foo",
                foo: "bar",
                bar: {
                    baz: 42
                }
            }

            global.pm.collectionVariables.set(presetName, JSON.stringify(presetValue));

            const expected = Object.assign({
                foo: presetValue.foo,
                bar: JSON.stringify(presetValue.bar),
            }, utils.mapObjectKeys(presetValue.bar, utils.mappers.prefix('bar')));

            var expectedExports = utils.mapObjectKeys(expected, utils.mappers.prefix(presetName))
            expectedExports[presetName] = JSON.stringify(presetValue.bar);
            Object.assign(expectedExports, utils.mapObjectKeys(presetValue.bar, utils.mappers.prefix(presetName)));

            presetModule.usePreset(presetName, { defaultKey: 'bar' });

            expect(global.pm).to.include.property('variables')
                .and.to.have.keys(...Object.keys(expectedExports))

            expect(global.pm).to.include.property('variables')
                .not.to.have.keys('$default');

            expect(global.pm).to.include.property('variables')
                .to.include(expectedExports)
        });
    });
});