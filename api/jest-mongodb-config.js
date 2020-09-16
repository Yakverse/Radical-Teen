module.exports = {
    mongodbMemoryServerOptions: {
        instance: {
            dbName: 'jest'
        },
        binary: {
            version: '4.2.9',
            skipMD5: true
        },
        autoStart: false
    }
};