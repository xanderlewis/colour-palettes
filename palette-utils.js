function colourToHex(colour) {
  return Object.values(colour).reduce(function (total, current) {
    return total += current.toString(16);
  }, '#');
}

function colourToRGBAString(colour) {
  return Object.values(colour).reduce(function (total, current, index) {
    var newTotal = total
    newTotal += Math.round(current);
    if (index == Object.values(colour).length - 1) {
      newTotal += ')';
    } else {
      newTotal += ',';
    }
    return newTotal
  }, 'rgba(');
}

module.exports = {
  colourToHex: colourToHex,
  colourToRGBAString: colourToRGBAString
};
