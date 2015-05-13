module.exports = function () {

    return function findAll(Model, callback) {

        this.query(Model, { limit: 1000 }, callback);

    };

};