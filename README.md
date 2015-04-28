# Jarmo InfluxDB Reporter
Reporter module for [Jarmo](https://github.com/N4SJAMK/jarmo), pushes data to
InfluxDB. Note that this module is for InfluxDB 0.9 and up!

## Configuration
Configuration can be passed in under the `influxdb` key. Like so:

```javascript
export default {
	reporters: [
		'../backends/influxdb'
	],
	influxdb: {
		host:     'localhost',  // Host of the InfluxDB server.
		port:     8000,         // Port of the InfluxDB server.
		database: 'test',       // Database name.
		username: 'test',       // Username for basic authentication.
		password: 'test'        // Password for basic authentication.
	}
}
```

## Data Format
Since Jarmo expects JSON, the received data is actually a JSON object. In order
for this reporter to work, the data should be in the following format:

```javascript
{
	name: 'response',  // InfluxDB 'series' name.
	tags: {
		// Tags for this 'data point'.
		host: 'abc_01'
	},
	fields: {
		// Fields for this 'data point'.
		response_time:   26,
		response_status: 300
	}
}
```
You can also add a `timestamp` field to the payload, which will overwrite the
timestamp set by Jarmo.
