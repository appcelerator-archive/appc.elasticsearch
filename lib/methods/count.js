module.exports = function () {
  return function count (Model, instance, callback) {
    var index = this.getIndex(Model)
    var type = this.getType(Model)

    this.client.count({
      index: index,
      type: type
    }, function (err, response) {
      if (err && err.message.indexOf('IndexMissingException') === -1) {
        return callback(err)
      }

      callback(null, (response && response.count) || 0)
    })
  }
}
