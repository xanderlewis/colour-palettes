const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const paletteUtils = require('./palette-utils.js');
const app = express();

// Handle static files (in public directory)
app.use(express.static('public'));

// Create JSON parser
const jsonParser = bodyParser.json();

// Set up handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Handle post request (sending colour palette to server)
app.post('/palette', jsonParser, function (req,res) {
  const palette = req.body;

  // Respond with dynamically-generated colour palette page (using handlebars as template engine)
  res.render('palette', {hexColours: palette.map(x => paletteUtils.colourToHex(x))});
});

// Listen for requests
app.listen(process.env.PORT || 3000, function () {
  console.log('Listening.');
});
