function colourToHex(colour) {
  return Object.values(colour).reduce(function (total, current, index) {
    // (ignore alpha information for hex string)
    if (index != 3) {
      const hexValue = Math.round(current).toString(16);
      if (hexValue.length == 1) {
        return total += '0' + hexValue;
      } else {
        return total += hexValue;
      }

    } else {
      return total
    }
  }, '');
}

function hexToColour(hexString) {
  var colour = [];
  for (let i = 0; i < hexString.length; i += 2) {
    colour.push(parseInt(hexString.slice(i, i+2), 16));
  }
  return colour;
}

function colourToRGBAString(colour) {
  return Object.values(colour).reduce(function (total, current, index) {
    var newTotal = total
    newTotal += Math.round(current);
    // Add comma, or closing bracket if at end
    if (index == Object.values(colour).length - 1) {
      newTotal += ')';
    } else {
      newTotal += ',';
    }
    return newTotal
  }, 'rgba(');
}

function decodePaletteString(paletteString) {
  var palette = [];
  for (let i = 0; i < paletteString.length; i += 6) {
    palette.push(hexToColour(paletteString.slice(i, i+6)));
  }
  return palette;
}

module.exports = {
  colourToHex: colourToHex,
  colourToRGBAString: colourToRGBAString,
  decodePaletteString: decodePaletteString
};
