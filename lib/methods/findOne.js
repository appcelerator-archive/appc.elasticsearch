module.exports = function () {

    return function findOne(Model, value, callback) {

        var index = this.getIndex(Model),
            type = this.getType(Model);

        if (!value || typeof value !== 'string') {
            return callback(new Error('unexpected value for findOne: ' + value));
        }

        this.client.get({
            index: index,
            type: type,
            id: value
        }, function (err, response){
            if (err && err.message.indexOf('IndexMissingException') === -1) {
                return callback(err);
            }

            if (!response) {
                return callback();
            }

            callback(null, this.createInstanceFromSource(Model, response));

        }.bind(this));

    };

};