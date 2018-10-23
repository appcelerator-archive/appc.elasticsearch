var _ = require('lodash')
var path = require('path')
var pkginfo = require('pkginfo')(module) && module.exports
var defaultConfig = require('fs').readFileSync(path.join(__dirname, '/../../conf/example.config.js'), 'utf8')

module.exports = function (Arrow, server) {
  return {

    /**
         * The metadata of the connector plucked from the package.json
         */
    pkginfo: _.pick(pkginfo, 'name', 'version', 'description', 'author', 'license', 'keywords', 'repository'),

    /**
         * The logger of the connector.
         */
    logger: server && (server.logger || Arrow.createLogger({}, { name: pkginfo.name })),

    /**
         * Any models in use.
         */
    models: Arrow.loadModelsForConnector(pkginfo.name, module, path.join(__dirname, '/../../models')),

    /**
         * Default configuration for appc.redis.
         */
    defaultConfig: defaultConfig

  }
}
