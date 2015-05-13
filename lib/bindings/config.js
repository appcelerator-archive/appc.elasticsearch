var _ = require('lodash'),
    pkginfo = require('pkginfo')(module) && module.exports,
    defaultConfig = require('fs').readFileSync(__dirname + '/../../conf/example.config.js', 'utf8');

module.exports = function (Arrow, server) {

    return {

        /**
         * The metadata of the connector plucked from the package.json
         */
        pkginfo: _.pick(pkginfo, 'name', 'version', 'description', 'author', 'license', 'keywords', 'repository'),

        /**
         * The logger of the connector.
         */
        logger: server && server.logger || Arrow.createLogger({}, { name: pkginfo.name }),

        /**
         * Any models in use.
         */
        models: Arrow.loadModelsForConnector(pkginfo.name, module, __dirname + '/../../models'),

        /**
         * Default configuration for appc.redis.
         */
        defaultConfig: defaultConfig

    };

};