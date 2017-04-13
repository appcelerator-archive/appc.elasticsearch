exports.create = function (Arrow, server) {
  var _ = require('lodash')
  var pkginfo = require('pkginfo')(module) && module.exports

  return Arrow.Connector.extend(_.defaults(

        _.pick(pkginfo, 'name', 'version', 'description', 'author', 'license', 'keywords', 'repository'),

        require('./bindings/config')(Arrow, server),

        require('./bindings/lifecycle')(Arrow, server),

        require('./bindings/metadata')(Arrow, server),

    {
      count: require('./methods/count')(Arrow, server),
      create: require('./methods/create')(Arrow, server),
      findAll: require('./methods/findAll')(Arrow, server),
      findOne: require('./methods/findOne')(Arrow, server),
      findByID: require('./methods/findByID')(Arrow, server),
      query: require('./methods/query')(Arrow, server),
      save: require('./methods/save')(Arrow, server),
      delete: require('./methods/delete')(Arrow, server),
      deleteAll: require('./methods/deleteAll')(Arrow, server)
    },

        require('./bindings/utility')(Arrow, server)

    ))
}
