var fs = require('fs'),
	stream = fs.createReadStream(__dirname + '/contents/OMG_WRONG_FILE.html');

stream.on('data', function(chunk) {
	// output chunk to terminal
	console.log(chunk.toString());
});

stream.on('end', function() {
	console.log('END');
});

stream.on('error', function(err) {
	console.log('error', err);
});