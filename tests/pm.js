const container = () => {
    return {
        get(key) { 
            return this[key]
        },
        set(key, value) {
            return this[key] = value;
        }
    }
}

module.exports = () => ({
    collectionVariables: container(),
    environment: container(),
    variables: container(),
    globals: container()
})