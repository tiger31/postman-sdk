const container = () => {
    return {
        get(key) { 
            return this[key]
        },
        set(key, value) {
            return this[key] = value;
        },
        unset(key) {
            return delete this[key];
        }
    }
}

module.exports = () => ({
    collectionVariables: container(),
    environment: container(),
    variables: container(),
    globals: container()
})