function colourToHex(colour) {
  return Object.values(colour).reduce(function (total, current, index) {
    // (ignore alpha information for hex string)
    if (index != 3) {
      return total += Math.round(current).toString(16);
    } else {
      return total
    }
  }, '#');
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

module.exports = {
  colourToHex: colourToHex,
  colourToRGBAString: colourToRGBAString
};
