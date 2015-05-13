module.exports = function () {

    return function save(Model, instance, callback) {

        var index = this.getIndex(Model),
            refresh = this.getRefresh(Model),
            type = this.getType(Model);

        this.client.update({
            index: index,
            type: type,
            id: instance.getPrimaryKey(),
            body: {
                doc: instance.toPayload()
            },
            refresh: refresh.create
        }, function(err, result){
            if (err && err.message.indexOf('IndexMissingException') === -1) {
                return callback(err);
            }

            if (!result) {
                return callback();
            }

            callback(null, instance);
        });

    };

};