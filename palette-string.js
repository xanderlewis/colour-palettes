function hexToColour(hexString) {
    var colour = [];
    for (let i = 0; i < hexString.length; i += 2) {
        colour.push(parseInt(hexString.slice(i, i+2), 16));
    }
    return colour;
}

function decodePaletteString(paletteString) {
    var palette = [];
    for (let i = 0; i < paletteString.length; i += 6) {
        palette.push(hexToColour(paletteString.slice(i, i+6)));
    }
    return palette;
}

module.exports = {
    decodePaletteString: decodePaletteString
};