//import kMeans from 'clustering';

function mean(data) {
  return data.reduce((total,current) => total += current, 0) / data.length;
}

function meanColour(colours) {
  var meanColour = [];
  for (var i = 0; i < 4; i++) {
    meanColour[i] = mean(colours.map(x => x[i]));
  }

  return meanColour;
}

function extractPixelData(canvas) {
  // Separate out RGBA groups
  const ctx = canvas.getContext('2d');
  const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
  let colours = [];
  for (let i = 0; i < data.length; i += 4) {
    colours.push([data[i], data[i+1], data[i+2], data[i+3]]);
  }
  return colours;
}

function extractColourPalette(canvas) {
  // Extract raw colours from image
  const allColours = extractPixelData(canvas);

  // Cluster raw colours
  const clusters = kMeans(allColours, 5);

  // Calculate palette (mean colour of each cluster)
  const colours = clusters.map(x => meanColour(x));
  const palette = colours.map(x => ({r: x[0], g: x[1], b: x[2], a: x[3]}));

  return palette
}

//export extractColourPalette;
