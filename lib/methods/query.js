module.exports = function () {

    return function query(Model, options, callback) {

        var index = this.getIndex(Model),
            type = this.getType(Model),
            body = this.calculateQueryParams(Model, options);

        var request = {
            index: index,
            type: type,
            body: body
        };

        if(options.page){
            request.from = (options.page - 1) * (options.per_page || 10);
        }

        if(options.per_page){
            request.size = options.per_page;
        }

        this.client.search(request, function (err, response) {
            if (err && err.message.indexOf('IndexMissingException') === -1) {
                return callback(err);
            }

            var records = response.hits.hits.map(function(hit){

                if(hit.fields) {
                    this.convertFieldsToSource(hit);
                }
                return this.createInstanceFromSource(Model, hit);

            }.bind(this));

            callback(null, records);

        }.bind(this));

    };

};