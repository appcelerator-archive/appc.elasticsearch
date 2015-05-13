module.exports = {
    connectors: {
        'appc.elasticsearch': {
            index: 'default',
            disableAnalysis: false,
            refreshOnCreate: true,
            refreshOnDelete: true,
            configuration: {
                host: 'localhost:9200',
                log: 'info'
            }
        }
    }
};