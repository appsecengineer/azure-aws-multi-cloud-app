// Install/import necessary packages/files.
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const routes = require('./routes/routes');

// Configure app to use bodyParser().
// This will let us get the data from a POST.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure app to serve static files.
app.use(express.static('public'));

// Use routes.
routes(app);

// Set port for server to listen on.
var port = process.env.PORT || 3030;
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}`);
});
