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

    describe("_exportVariable", () => {
        it("Export variable to scope", () => {
            const exportModule = core.module('export');
            const scope = "variables";
            const key = "foo";
            const value = "bar";

            exportModule._exportVariable(scope, key, value)
            chai.expect(global.pm).to.include.property(scope)
                .and.to.include.property(key, value);
        })
    })
    describe("_deepExportObject", () => {
        it("Export flat object with all non-object types", () => {
            const exportModule = core.module('export');
            const scope = "variables";
            const key = "foo";
            const objToExport = {
                foo: "bar",
                bar: 42,
                baz: false,
                flo: 123.456,
                nil: null,
            };

            var expectedExports = utils.mapObjectKeys(objToExport, utils.mappers.prefix(key))

            exportModule._deepExportObject(scope, key, objToExport);
            chai.expect(global.pm).to.include.property(scope)
                .and.to.include(expectedExports);
        });

        it("Export with nested objects", () => {
            const exportModule = core.module('export');
            const scope = "variables";
            const key = "foo";
            const objToExport = {
                foo: "bar",
                bar: {
                    baz: 42
                }
            }
            
            const expected = Object.assign({
                foo: objToExport.foo,
                bar: JSON.stringify(objToExport.bar),
            }, utils.mapObjectKeys(objToExport.bar, utils.mappers.prefix('bar')))

            var expectedExports = utils.mapObjectKeys(expected, utils.mappers.prefix(key))

            exportModule._deepExportObject(scope, key, objToExport);
            expect(global.pm).to.include.property(scope)
                .and.to.include(expectedExports)
        });
        it("Export with custom delimiter", () => {
            const exportModule = core.module('export');
            const scope = "variables";
            const key = "foo";
            const delimiter = ':';
            const objToExport = {
                foo: "bar",
                bar: {
                    baz: 42
                }
            }
            
            const expected = Object.assign({
                foo: objToExport.foo,
                bar: JSON.stringify(objToExport.bar),
            }, utils.mapObjectKeys(objToExport.bar, utils.mappers.prefix('bar', delimiter)))

            var expectedExports = utils.mapObjectKeys(expected, utils.mappers.prefix(key, delimiter))

            exportModule._deepExportObject(scope, key, objToExport, { delimiter: });
            expect(global.pm).to.include.property(scope)
                .and.to.include(expectedExports)
        })
    })
});