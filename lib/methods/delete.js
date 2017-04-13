module.exports = function () {
  return function deleteOne (Model, instance, callback) {
    var index = this.getIndex(Model)
    var refresh = this.getRefresh(Model)
    var type = this.getType(Model)

    this.client.delete({
      index: index,
      type: type,
      id: instance.getPrimaryKey(),
      refresh: refresh.delete
    }, function (err, response) {
      if (err && err.message.indexOf('IndexMissingException') === -1) {
        return callback(err)
      }

      if (!response.found) {
        return callback()
      }

      callback(null, instance)
    })
  }
}
