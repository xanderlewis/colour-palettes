//import kMeans from 'clustering';

function lerp(start, end, amount) {
    return start + (end - start) * amount;
}

function mean(data) {
    return data.reduce((total,current) => total += current, 0) / data.length;
}

function meanColour(colours) {
    var meanColour = [];
    for (var i = 0; i < 4; i++) {
        meanColour[i] = mean(colours.map(x => x[i]));
    }

    // Shift value upwards slightly
    //meanColour = increaseValueOfRGB(meanColour, 0.2);
    //meanColour = increaseSaturationOfRGB(meanColour, 0.2);

    return meanColour;
}

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
            return total;
        }
    }, '');
}

function increaseValueOfRGB(colour, percent) {
    console.log(colour);
    var hsv = rgbToHSV(colour);
    console.log(hsv);
    hsv[2] = lerp(hsv[2], 1, percent);
    console.log(hsv);
    return hsvToRGB(hsv);
}

function increaseSaturationOfRGB(colour, percent) {
    console.log(colour);
    var hsv = rgbToHSV(colour);
    console.log(hsv);
    hsv[1] = lerp(hsv[1], 1, percent);
    console.log(hsv);
    return hsvToRGB(hsv);
}

function rgbToHSV(colour){
    r = colour[0]/255, g = colour[1]/255, b = colour[2]/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0;
    } else {
        switch(max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h,s,v];
}

function hsvToRGB(colour){
    var r, g, b;
    var h = colour[0];
    var s = colour[1];
    var v = colour[2];

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
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

function extractColourPalette(canvas, k) {
    // Extract raw colours from image
    const allColours = extractPixelData(canvas);

    // Cluster raw colours
    const clusters = kMeans(allColours, k);

    // Calculate palette (mean colour of each cluster)
    const colours = clusters.map(x => meanColour(x));
    const palette = colours.map(x => ({r: x[0], g: x[1], b: x[2], a: x[3]}));

    return palette;
}

//export extractColourPalette;
