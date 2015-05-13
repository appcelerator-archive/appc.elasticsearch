var Arrow = require('arrow'),
    server = new Arrow({ ignoreDuplicateModels: true, logLevel: 'fatal' }),
    log = server && server.logger || Arrow.createLogger({}, { name: 'appc.elasticsearch TEST' });

exports.Arrow = Arrow;
exports.log = log;
exports.server = server;
exports.test_index = process.env['TEST_INDEX'] || 'test';

before(function (next) {
    exports.connector = server.getConnector('appc.elasticsearch');
    exports.connector.config.index = exports.test_index;

    log.info('Elasticsearch test index: ' + exports.connector.getIndex());

    server.start(next);
});

after(function (next) {
    if (!exports.connector) {
        return server.stop(next);
    }
    exports.connector.client.indices.delete({
        index: exports.connector.getIndex()
    }, function(err) {
        if (err) {
            log.error(err.message);
        } else {
            log.info('Dropped test index at: ' + exports.connector.getIndex());
        }
        server.stop(next);
    });
});