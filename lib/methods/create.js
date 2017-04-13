module.exports = function () {
  return function create (Model, values, callback) {
    var instance = Model.instance(values, false)
    var refresh = this.getRefresh(Model)
    var index = this.getIndex(Model)
    var type = this.getType(Model)

    this.client.index({
      index: index,
      type: type,
      body: instance.toPayload(),
      refresh: refresh.create
    }, function (err, result) {
      if (err && err.message.indexOf('IndexMissingException') === -1) {
        return callback(err)
      }

      if (!result) {
        return callback()
      }

      instance.setPrimaryKey(result._id)

      callback(null, instance)
    })
  }
}
