module.exports = function () {

    var elasticsearch = require('elasticsearch');

    return {

        /**
         * This method is called before the server starts to allow the connector to connect to any external
         * resources if necessary (such as a Database, etc.).
         *
         * @param callback
         */
        connect: function connect(callback) {
            // Notify connection attempt
            this.logger.debug('connecting');

            // Bind a new Client instance
            this.client = new elasticsearch.Client(this.config.configuration || {});

            // Bound templates function
            var hasBound = function (err) {
                if(err){
                    return callback(err);
                }

                // Retrieve the existing schema
                this.fetchSchema(function (err, schema) {
                    if (err) {
                        return callback(err);
                    }

                    // If we want to generate models from the existing schema
                    if (this.config.generateModelsFromSchema === undefined || this.config.generateModelsFromSchema) {
                        // Generate the models with from schema
                        this.generateModelsFromSchema(schema);
                    }

                    // Connected!
                    callback();

                }.bind(this));

            }.bind(this);

            // Check if the user wants to maintain analysis
            if(!this.config.disableAnalysis) {
                // By default, analysis is expensive and translates fields in order
                // to use them for text search. Seeing as text based searches are
                // not available via the connector, it's more performant to disable
                // analysis on all String fields. Analysis also has the caveat of
                // lower casing all String types.
                this.client.indices.putTemplate({
                    name: 'disable_analysis',
                    body: {
                        template: 'arrow:*',
                        mappings: {
                            _default_: {
                                dynamic_templates: [
                                    {
                                        disable_analysis: {
                                            match: '*',
                                            match_mapping_type: 'string',
                                            mapping: {
                                                type: 'string',
                                                index: 'not_analyzed'
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }, hasBound);
            } else {
                hasBound();
            }
        },

        /**
         * This method is called before shutdown to allow the connector to cleanup any resources.
         *
         * @param callback
         */
        disconnect: function disconnect(callback) {
            this.logger.trace('disconnected');
            callback();
        }

    };

};