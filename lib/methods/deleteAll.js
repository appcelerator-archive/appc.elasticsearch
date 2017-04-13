module.exports = function () {
  return function deleteAll (Model, callback) {
    var index = this.getIndex(Model)
    var refresh = this.getRefresh(Model)
    var type = this.getType(Model)

    this.client.deleteByQuery({
      index: index,
      type: type,
      body: {
        query: {
          match_all: { }
        }
      },
      refresh: refresh.delete
    }, function (err/*, response */) {
      if (err && err.message.indexOf('IndexMissingException') === -1) {
        return callback(err)
      }
      callback()
    })
  }
}
