# Elasticsearch Connector [![Build Status](https://travis-ci.org/appcelerator/appc.elasticsearch.svg?branch=master)](https://travis-ci.org/appcelerator/appc.elasticsearch)

This is an Arrow connector for Elasticsearch.

## Installation

```bash
$ appc install connector/appc.elasticsearch
```

## Usage

If you wish to simply use the default Arrow CRUD operations, you can create and extend your own models:

```javascript
var User = Arrow.Model.extend('user', {
	fields: {
		name: { type: String, required: false, validator: /[a-zA-Z]{3,}/ }
	},
	connector: 'appc.elasticsearch'
});
```

## Configuration

Example configurations can be found in `conf/`. You can set any of the following on the connector:

* configuration
    - the configuration settings to pass to the internal Elasticsearch client, as described [here](http://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/configuration.html).
* disableAnalysis
    - by default, indexed strings are set to not analyzed in the Elasticsearch mappings (see [Mappings](#mappings)).
* index
	- the main index to use inside Elasticsearch (defaults to `default`).
	- `arrow:` is prepended to this index name in order to differentiate better between Arrow and non-Arrow indices.
* refreshOnCreate
	- whether to refresh the Elasticsearch index on a CU operation (defaults to `false`).
* refreshOnDelete
	- whether to refresh the Elasticsearch index on a D operation (defaults to `false`).
* refresh
	- whether to refresh the Elasticsearch index on any operations (defaults to `false`).
	- if true, this will override both `refreshOnCreate` and `refreshOnDelete`.
	
In addition, any of the following can also be set on Models themselves. These values override the connector-specified values where applicable:

* index
	- specified index for the given model (defaults to connector value).
* type
	- the type the model should be placed in (defaults to model name).
* refresh(onCreate|onDelete)
	- whether to refresh after certain operations on this model (defaults to connector values).

## Mappings

In order to avoid any unexpected behaviour, the connector binds a template to Elasticsearch (on indices matching `arrow:*`) to disable String analysis.

If you wish to maintain String analysis, you can set `disableAnalysis` to true in the connector config. 

## Development

> This section is for individuals developing the Elasticsearch Connector and not intended
  for end-users.

```bash
$ npm install
$ node app.js
```

### Running Unit Tests

When running the tests remember that appc.elasticsearch will use the index `arrow:test` for testing and *will* empty it. You can override this using the `TEST_INDEX` environment variable if needed. 

```bash
$ npm test
```

# Contributing

This project is open source and licensed under the [Apache Public License (version 2)](http://www.apache.org/licenses/LICENSE-2.0).  Please consider forking this project to improve, enhance or fix issues. If you feel like the community will benefit from your fork, please open a pull request. 

To protect the interests of the contributors, Appcelerator, customers and end users we require contributors to sign a Contributors License Agreement (CLA) before we pull the changes into the main repository. Our CLA is simple and straightforward - it requires that the contributions you make to any Appcelerator open source project are properly licensed and that you have the legal authority to make those changes. This helps us significantly reduce future legal risk for everyone involved. It is easy, helps everyone, takes only a few minutes, and only needs to be completed once. 

[You can digitally sign the CLA](http://bit.ly/app_cla) online. Please indicate your email address in your first pull request so that we can make sure that will locate your CLA.  Once you've submitted it, you no longer need to send one for subsequent submissions.

# Legal Stuff

Appcelerator is a registered trademark of Appcelerator, Inc. Arrow and associated marks are trademarks of Appcelerator. All other marks are intellectual property of their respective owners. Please see the LEGAL information about using our trademarks, privacy policy, terms of usage and other legal information at [http://www.appcelerator.com/legal](http://www.appcelerator.com/legal).
