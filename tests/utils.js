const mapObjectKeys = (obj, mapperFn) => {
    return Object.keys(obj).reduce((o, k) => {
        o[mapperFn(k)] = obj[k];
        return o;
    }, {})
}

const mappers = {
    prefix: (prefix, delimiter = '.') => (key) => prefix.concat(delimiter, key)
}


module.exports = { mapObjectKeys, mappers }