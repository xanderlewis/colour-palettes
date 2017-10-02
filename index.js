const express = require('express');
const handlebars = require('express-handlebars');
const paletteUtils = require('./palette-utils.js');
const app = express();

// Handle static files (in public directory)
app.use(express.static('public'));

// Set up handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Handle request for palette
app.get('/palette/:paletteString', function (req,res) {
  const palette = paletteUtils.decodePaletteString(req.params.paletteString);
  res.render('palette', {hexColours: palette.map(x => paletteUtils.colourToHex(x))});
});

// Listen for requests
app.listen(process.env.PORT || 3000, function () {
  console.log('Listening.');
});
