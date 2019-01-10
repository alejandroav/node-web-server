const express = require('express');
const fs = require('fs');
const hbs = require('hbs');
const app = express();

const PORT = process.env.PORT || 3000;
const MAINTENANCE_MODE = false;

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now} ${req.method} ${req.url} ${req.ip}`;

	fs.appendFile('server.log', log + '\r\n', (err) => {
		if (err) {
			console.log('Error writing log.');			
		}
	});

	next();
});

app.use((req, res, next) => {
	if (MAINTENANCE_MODE) {
		res.render('maintenance.hbs');
	}
	next();
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

app.get('/', (req, res) => {	
	res.render('home.hbs', {
		pageTitle: 'Home Page',
		welcomeMessage: 'Welcome to my site'
	});
});

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'About Page'
	});
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Error!'
	});
});

app.listen(PORT, () => {
	console.log(`Server is up on port ${PORT}.`);
});