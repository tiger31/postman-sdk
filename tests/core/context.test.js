const core = new (require(`../../core.js`))();
const { expect } = require('chai');
const pm = require('../pm');
const utils = require('../utils.js');

describe("Context module", () => {
    //Emit postman behaviour
    beforeEach(() => {
        global.pm = pm();
    })
    after(() => {
        delete global.pm;
    })

    describe('setContext', () => {
        it('Set context with plain object', () => {
            const contextModule = core.module('context');
            const contextName = "foo";
            const objToExport = {
                foo: "bar",
                bar: 42,
                baz: false,
                flo: 123.456,
                nil: null,
            };

            const expectedExports = utils.mapObjectKeys(objToExport, utils.mappers.prefix(contextName, ':'))

            contextModule.setContext(contextName, objToExport);

            chai.expect(global.pm).to.include.property('environment')
                .and.to.include(expectedExports);
        })
        it('Set context with "clear" option', () => {
            const contextModule = core.module('context');
            const contextName = "foo";
            const objToExport = {
                foo: "bar",
                bar: 42,
                baz: false,
                flo: 123.456,
                nil: null,
            };

            contextModule.setContext(contextName, objToExport, { clear: true });

            delete objToExport['foo'];

            contextModule.setContext(contextName, objToExport, { clear: true });

            chai.expect(global.pm).to.include.property('environment')
                .and.to.not.include.keys('foo');
        })
    })
    describe('getContext', () => {
        it('Get previously exported context', () => {
            const contextModule = core.module('context');
            const contextName = "foo";
            const objToExport = {
                foo: "bar",
                bar: 42,
                baz: false,
                flo: 123.456,
                nil: null,
            };

            contextModule.setContext(contextName, objToExport);

            const actualExports = contextModule.getContext(contextName);

            chai.expect(actualExports).to.have.all.keys(Object.keys(objToExport));
            chai.expect(actualExports).to.include(objToExport);
        })
    })
    describe('clearContext', () => {
        it('Hard clear exported context', () => {
            const contextModule = core.module('context');
            const contextName = "foo";
            const objToExport = {
                foo: "bar",
                bar: 42,
                baz: false,
                flo: 123.456,
                nil: null,
            };

            contextModule.setContext(contextName, objToExport);
            contextModule.clearContext(contextName)

            chai.expect(global.pm).to.include.property('environment')
                .and.to.not.have.any.keys(Object.keys(objToExport));
        });
        it('Soft clear exported context', () => {
            const contextModule = core.module('context');
            const contextName = "foo";
            const objToExport = {
                foo: "bar",
                bar: 42,
                baz: false,
                flo: 123.456,
                nil: null,
            };

            const expected = utils.mapObjectKeys(objToExport, utils.mappers.prefix(contextName, ':'))

            contextModule.setContext(contextName, objToExport);
            contextModule.clearContext(contextName, { soft: true })

            const expectedExports = Object.keys(expected).reduce((o, k) => {
                o[k] = '';
                return o;
            }, { })

            chai.expect(global.pm).to.include.property('environment')
                .and.to.include(expectedExports);
        })
    })

});