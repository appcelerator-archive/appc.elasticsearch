#!groovy
@Library('pipeline-library') _

timestamps {
	node('git && (osx || linux)') {
		stage('Checkout') {
			checkout scm
		}

		buildConnector {
			// don't override anything yet
		}
	}
}
