import request from 'superagent';

/**
 * InfluxDB reporter.
 */
export default {
	/**
	 * Each 'reporter' should have a name, since this determines the config
	 * that is passed to the 'initialize'.
	 */
	name: 'influxdb',

	/**
	 * Backend initialization should be done in this method, this means that if
	 * the module needs to create a connection to somewhere like a database, we
	 * do it here.
	 *
	 * @param {object} config  The configuration object for this reporter. Note
	 *                         that 'this.name' will be used as a 'key' to pick
	 *                         out the configuration for this reporter.
	 */
	initialize(config = {}) {
		this.config = config;
	},

	/**
	 * Flush given data to InfluxDB.
	 *
	 * @param {object[]} points  Upon each flush cycle, depending on the server
	 *                           configuration, we receive a set of data which
	 *                           we must 'flush' somewhere.
	 */
	flush(points) {
		return new Promise((resolve, reject) => {
			if(points.length === 0) return resolve();

			let payload = {
				points:   points.map(format),
				database: this.config.database
			}
			return post(JSON.stringify(payload), this.config)
				.then(resolve, reject);
		});
	}
}

/**
 * Send a POST request to InfluxDB.
 *
 * @param {string} payload  Stringified JSON payload.
 * @param {object} config   The configuration for this reporter.
 *
 * @return {Promise} Promise resolved when the data has been sent to InfluxDB.
 */
function post(payload, config) {
	return new Promise((resolve, reject) => {
		// We create a POST request object to the configured InfluxDB host.
		let req = request.post(`${config.host}:${config.port}/write`)
		// We use 'basic' authentication for our request.
			.auth(config.username, config.password);
		// The promise is resolved at the end of the request.
		return req.end((err, res) => err ? reject(err) : resolve());
	});
}

/**
 * Format given points so that they will match the format used by InfluxDB.
 */
function format(point) {
	return {
		name:   point.data.name,
		tags:   point.data.tags,
		fields: point.data.fields,
		// If the data itself contains a timestamp, we use that instead of the
		// default timestamp added when the message is received here.
		timestamp: point.data.timestamp || point.timestamp
	}
}
