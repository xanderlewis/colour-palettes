const express = require('express');
const handlebars = require('express-handlebars');
const app = express();

const paletteString = require('./public/palette-string.js');
const colourUtils = require('./public/colours.js');

// Handle static files (in public directory)
app.use(express.static('public'));

// Set up handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Handle request for palette
app.get('/palette/:paletteString', function (req,res) {
    const palette = paletteString.decodePaletteString(req.params.paletteString);
    const swatches = palette.reduce((total, current) => total.concat([{hexColour: colourUtils.colourToHex(current), darkLabel: colourUtils.requiresDarkLabel(current)}]), []);

    res.render('palette', {
        swatches: swatches,
        new: req.query.new == 'true' // Indicates whether the palette was just generated or not
    });
});

// Listen for requests
app.listen(process.env.PORT || 3000, function () {
    console.log('Listening.');
});