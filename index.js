const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const paletteUtils = require('./palette-utils.js');
const app = express();

app.use(express.static('public'));
const jsonParser = bodyParser.json();

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/palette.css', function (req, res) {
  res.sendFile(__dirname + '/palette.css');
  console.log('palette.css requested.');
});

app.post('/palette', jsonParser, function (req,res) {
  const palette = req.body;

  // Respond with dynamically-generated colour palette page (using handlebars as template engine)
  res.render('palette', {colours: palette.map(x => paletteUtils.colourToHex(x))});
});

app.listen(3000, function () {
  console.log('Listening on port 3000.');
});
