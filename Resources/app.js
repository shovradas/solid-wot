const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
app.use(express.static(path.join(__dirname, 'assets')));
app.listen(10000, () => console.log('Server listening on port 10000!'));
app.get('/', (req, res) => {
	res.set('Content-Type', 'text/html');
	res.sendFile('index.html', { root: __dirname });
});