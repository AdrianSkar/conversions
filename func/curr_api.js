// /.netlify/functions/curr_api

exports.handler = function (event, context, callback) {
	//event - similar to express Request object
	console.log(event);

	let curr_key = process.env.CURR_KEY;
	console.log(curr_key);

	callback(null, {
		statusCode: 200,
		body: JSON.stringify({ msg: `Yep. Yep. Yep. ${curr_key}` }),
	});
};
