module.exports = function (Arrow, server) {
  var _ = require('lodash')
  var async = require('async')

  return {

        /**
         * Pulls all existing mappings from ElasticSearch and provides them through
         * the callback as models. Not entirely sure if this is the correct concept
         * for ElasticSearch, however it can always be stripped out.
         *
         * @param callback the callback to pass any schema too
         */
    fetchSchema: function fetchSchema (callback) {
            // Somewhere to hold the schema
      var schema = { }

            // Pull metadata for all Arrow-based indices
      this.client.indices.get({ index: 'arrow:*' }, function (err, results) {
        if (err) {
          return callback(err)
        }

                // Go through each index, one by one
        async.each(Object.keys(results), function (name, callback) {
                    // This isn't perfect, goes through the top level of a mapping
                    // pulling out any properties - again protect against any special
                    // indices by ignoring those starting with '_'
          Object.keys(results[name].mappings).filter(function (mapping) {
            return mapping[0] !== '_'
          }).forEach(function (mapping) {
                        // Grab the property set
            var result = results[name].mappings[mapping].properties
            var map = {}
            var keys = Object.keys(result).sort()

                        // For all properties in the mapping
            keys.forEach(function (key) {
                            // Skip on any _id fields (safety net)
              if (key !== '_id') {
                                // Pluck out the type, but normalize for safety
                map[key] = this.normalizeElasticSearchTypes(result[key].type)
              }
            }.bind(this))

                        // Initialize mapping schema to be 'schemaless'
            schema[mapping] = {
              schemaless: true,
              fields: { }
            }

                        // Map all properties to the schema
            Object.keys(map).forEach(function (field) {
              schema[mapping].fields[field] = {
                type: map[field]
              }
            })
          }.bind(this))

          callback()
        }.bind(this), function (err) {
          callback(err, schema)
        })
      }.bind(this))
    },

        /**
         * Converts the fetched schema into models and binds them to the
         * server.
         */
    generateModelsFromSchema: function generateModelsFromSchema (schema) {
      var models = {}

      Object.keys(schema).forEach(function (modelName) {
        var mName = this.pkginfo.name + '/' + modelName

        var Model = Arrow.Model.extend(mName, {
          name: mName,
          autogen: !!this.config.modelAutogen,
          fields: schema[modelName].fields || {},
          generated: true,
          connector: this
        })

        models[mName] = Model

        if (server) {
          server.addModel(Model)
        }
      }.bind(this))

      this.models = _.defaults(this.models || {}, models)

      if (server) {
        server.registerModelsForConnector(this, this.models)
      }
    }

  }
}
