module.exports = function () {
  var _ = require('lodash')

  return {

    /**
         * Converts a list of fields into a source object.
         *
         * @param hit the hit from Elasticsearch
         */
    convertFieldsToSource: function convertFieldsToSource (hit) {
      hit._source = {}
      Object.keys(hit.fields).forEach(function (key) {
        hit._source[key] = hit.fields[key][0]
      })
      delete hit.fields
    },

    /**
         * Return the index based on the Model name or configured from metadata.
         *
         * @param Model the model in use
         * @returns {string}
         */
    getIndex: function getIndex (Model) {
      return 'arrow:' + (Model && (Model.getMeta('index') || this.config.index || 'default'))
    },

    /**
         * Return whether create requests should refresh the indexes.
         *
         * @param Model the model in use
         * @returns {{create: boolean, delete: boolean}}
         */
    getRefresh: function getRefresh (Model) {
      var refresh = Model && (Model.getMeta('refresh') || this.config.refresh)
      return {
        create: Boolean(refresh || (Model && Model.getMeta('refreshOnCreate')) || this.config.refreshOnCreate),
        delete: Boolean(refresh || (Model && Model.getMeta('refreshOnDelete')) || this.config.refreshOnDelete)
      }
    },

    /**
         * Return the type based on the Model name or configured from metadata
         *
         * @param Model the model in use
         * @returns {string}
         */
    getType: function getType (Model) {
      return Model.getMeta('type') || Model.name
    },

    /**
         * Return a new instance from an ES query source item.
         */

    /**
         * Return a new instance from an ES query source item.
         *
         * @param Model the model in use
         * @param hit the hit from Elasticsearch
         * @returns {instance}
         */
    createInstanceFromSource: function createInstanceFromSource (Model, hit) {
      return this.createInstanceFromResult(Model, _.merge({ _id: hit._id }, hit._source))
    },

    /**
         * Return a new instance from an ES query result.
         *
         * @param Model the model in use
         * @param record the Elasticsearch record
         * @returns {instance}
         */
    createInstanceFromResult: function createInstanceFromResult (Model, record) {
      var instance = Model.instance(record, true)
      instance.setPrimaryKey(record._id)
      return instance
    },

    /**
         * Normalize ElasticSearch types to JavaScript types.
         *
         * @param type the type to convert
         * @return {string}
         */
    normalizeElasticSearchTypes: function normalizeElasticSearchTypes (type) {
      switch (type) {
        case 'float':
        case 'double':
        case 'byte':
        case 'short':
        case 'integer':
        case 'long':
          return 'number'
        case 'binary':
          return 'string'
        default:
          return type
      }
    },

    /**
         * Calculates the parameters for a query based on the provided options.
         *
         * @param Model the model in use
         * @param options the query options
         * @returns {*} an Elasticsearch query
         */
    calculateQueryParams: function calculateQueryParams (Model, options) {
      var shell = {
        query: {}
      }

      var _source = []
      var filters = []
      var sort = []

      if (options.where && _.isPlainObject(options.where)) {
        Object.keys(options.where).forEach(function (k) {
          var obj = { term: {} }

          obj.term[k] = options.where[k]

          filters.push(obj)
        })
      }

      if (options.limit) {
        shell.size = options.limit
      }

      if (options.sel) {
        _source = Object.keys(options.sel)
      }

      if (options.unsel) {
        var ignoredKeys = Object.keys(options.unsel)

        _source = Object.keys(Model.fields).filter(function (key) {
          return ignoredKeys.indexOf(key) === -1
        })
      }

      if (options.sel || options.unsel) {
        shell._source = _source
      }

      if (options.order) {
        for (var orderKey in options.order) {
          if (options.order.hasOwnProperty(orderKey)) {
            if (typeof options.order[orderKey] === 'string') {
              options.order[orderKey] = parseInt(options.order[orderKey], 10)
            }

            var obj = { }

            obj[orderKey] = {
              order: options.order[orderKey] === 1 ? 'desc' : 'asc'
            }

            sort.push(obj)
          }
        }
      }

      if (sort.length) {
        shell.sort = sort
      }

      if (filters.length) {
        shell.query.bool = {
          filter: filters
        }
      }

      if (Object.keys(shell.query).length === 0) {
        delete shell.query
      }

      return shell
    }

  }
}
