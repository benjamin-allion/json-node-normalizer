/***
 * Class used to store schema information (dereferenced schema for ex.)
 */
class SchemaCache {
    /**
     * Default constructor
     */
    constructor() {
        this.cache = {};
    }

    /**
     * Returns data object from cache
     * @param {string} objectName
     * @return {object}
     */
    getData(objectName) {
        return this.cache[objectName];
    }

    /**
     * Set data into the cache
     * @param {string} objectName
     * @param {object} objectValue
     * @param {number} cacheDuration
     */
    setData(objectName, objectValue, cacheDuration) {
        if(this.cache[objectName]){ return }
        this.cache[objectName] = objectValue;
        setTimeout(() => { delete this.cache[objectName] }, Number(cacheDuration));
    }

    /**
     * Reset cache
     */
    clearCache() {
        this.cache = {}
    }
}

module.exports = new SchemaCache();
