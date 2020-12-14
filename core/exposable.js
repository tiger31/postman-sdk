/**
 * Abstract class, commonly desinged to be inherited from objects with generated properties
 * _expose(options) method exports all properties from class expect constructor
 */
module.exports = (core) => core.get((utils) => {
    utils.Exposable = class Exposable {
        _expose(options) {
            const {
                printValue = false
            } = options;

            const toExpose = Array.prototype.concat.apply(
                Object.getOwnPropertyNames(this),
                Object.getOwnPropertyNames(this.constructor.prototype)
            ).filter(p => p !== 'constructor')
            .reduce((o, p) => { o[p] = this[p]; return o }, {});
            
            if (printValue)
                console.log(toExpose);
            return toExpose;
        }
    }
})