(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const stats = require('./stats-utils.js');

// Method for comparing arrays (because JavaScript doesn't provide this for some reason)
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, 'equals', {enumerable: false});

/**
* Generates a random integer in the closed interval specified by a and b
* @param {Number} a - lower bound
* @param {Number} b - upper bound
* @return {Number} randomInt - random integer generated
*/
function randomIntBetween(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

/**
* Calculates the Euclidean distance between two points.
* @param {Array} a - first point
* @param {Array} b - second point
* @return {Number} distance - Euclidean distance between the points
*/
function euclideanDistance(a, b) {
    if (a.length != b.length) {
        //throw 'Error calculating Euclidean distance. Input vectors must have same number of dimensions!';
        return Math.infinity;
    }
    var sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += Math.pow(b[i] - a[i], 2);
    }
    return Math.sqrt(sum);
}

/**
* Calculates the range of a one-dimensional data set
* @param {Array} data - data set
* @return {Number} range - range of the data set
*/
function rangeOf(data) {
    return data.reduce(function(total,current) {
        if (current < total.min) { total.min = current; }
        if (current > total.max) { total.max = current; }
        return total;
    }, {min: data[0], max: data[0]});
}

/**
* Calculates the ranges of each 'component' in an n-dimensional data set
* @param {Array} data - data set
* @return {Number} range - range of the data set
*/
function rangesOf(data) {
    var ranges = [];
    for (let i = 0; i < data[0].length; i++) {
        ranges.push(rangeOf(data.map(x => x[i])));
    }
    return ranges;
}

/**
* Initialises the centroids for the k-means algorithm
* @param {Array} data - data set
* @param {Number} k - number of clusters/centroids
* @return {Array} centroids - array of centroid vectors
*/
function initialiseCentroidsRandomly(data, k) {
    var ranges = rangesOf(data);
    var centroids = [];
    for (let i = 0; i < k; i++) {
        var centroid = [];
        for (var r in ranges) {
            centroid.push(randomIntBetween(ranges[r].min, ranges[r].max));
        }
        centroids.push(centroid);
    }
    return centroids;
}

/**
* Attributes data points to the nearest centroid's cluster
* @param {Array} data - data set
* @param {Array} centroids - array of centroid vectors
* @return {Array} clusters - array of clusters
*/
function clusterDataPoints(data, centroids) {
    var clusters = [];
    centroids.forEach(function () {
        clusters.push([]);
    });
    data.forEach(function (point) {
        var nearestCentroid = centroids[0];
        centroids.forEach(function (centroid) {
            if (euclideanDistance(point, centroid) < euclideanDistance(point, nearestCentroid)) {
                nearestCentroid = centroid;
            }
        });
        clusters[centroids.indexOf(nearestCentroid)].push(point);
    });
    return clusters;
}

/**
* Calculates the new vectors of the centroids based on their respective clusters
* @param {Array} clusters - array of clusters
* @return {Array} centroids - new centroid vectors
*/
function getNewCentroids(clusters) {
    var centroids = [];
    clusters.forEach(function (cluster) {
        centroids.push(stats.meanPoint(cluster));
    });
    return centroids;
}

/**
* Performs k-means clustering on a data set
* @param {Array} data - data set
* @param {Array} k - number of clusters for data points to be partitioned into
* @return {Array} clusters - array of clusters (each containing an array of vectors representing a data point)
*/
function kMeans(data, k) {
    var centroids;
    var clusters;
    var oldClusters;
    var converged = false;
    const iterationLimit = 500;
    var iterations = 0;

    // STEP ONE: Initialise centroids
    centroids = initialiseCentroidsRandomly(data, k);

    while (!converged) {
        console.log('iterated.');
        iterations += 1;
        // STEP TWO: Cluster data points according to nearest centroid (assignment step)
        oldClusters = clusters;
        clusters = clusterDataPoints(data, centroids);

        // Check for empty clusters. If so, just retry!
        if (clusters.some(x => x.length == 0)) {
            console.log('Empty clusters found. Restarting k-means.');
            return kMeans(data, k);
        }

        console.log(iterations, iterationLimit);
        if (clusters.equals(oldClusters) || iterations >= iterationLimit) {
            converged = true;
        }

        // STEP THREE: Set centroids to mean point of points belonging to their respective clusters (update step)
        centroids = getNewCentroids(clusters);
    }
    return clusters;
}

module.exports = {
    kMeans: kMeans
};
},{"./stats-utils.js":4}],2:[function(require,module,exports){
const statsUtils = require('./stats-utils.js');
const clustering = require('./clustering.js');

function lerp(start, end, amount) {
    return start + (end - start) * amount;
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
    const clusters = clustering.kMeans(allColours, k);

    // Calculate palette (mean colour of each cluster)
    const colours = clusters.map(x => statsUtils.meanPoint(x));
    const palette = colours.map(x => ({r: x[0], g: x[1], b: x[2], a: x[3]}));

    return palette;
}

module.exports = {
    colourToHex: colourToHex,
    extractColourPalette: extractColourPalette
};
},{"./clustering.js":1,"./stats-utils.js":4}],3:[function(require,module,exports){
const colourUtils = require('./colours.js');

function generatePaletteString(colours) {
    return colours.reduce(function(total, current){
        return total += colourUtils.colourToHex(current);
    },'');
}

window.addEventListener('load', function () {
    const imageUpload = document.getElementById('image-upload');
    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d');

    // Set up image upload
    imageUpload.addEventListener('change', function (e) {
    // Draw image to canvas
        const reader = new FileReader();
        reader.onload = function(event){
            const img = new Image();
            img.src = event.target.result;
            img.onload = function(){
            // Scale image so that width is 100px.
                const aspectRatio = img.height / img.width;
                canvas.width = 100;
                canvas.height = aspectRatio * canvas.width;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const container = document.getElementById('container');
                const loadingAnim = document.getElementById('loading-anim');

                // Fade out UI
                container.classList.add('fade-out');
                container.addEventListener('animationend', function () {

                    // Show loading animation
                    loadingAnim.classList.add('fade-in');
                    loadingAnim.addEventListener('animationend', function () {
                        // Extract colour palette from image
                        const palette = colourUtils.extractColourPalette(canvas, document.getElementById('num-colours').value);

                        // GET page for palette
                        window.location.href = 'palette/' + generatePaletteString(palette) + '?new=true';
                    });
                });
            };
        };
        reader.readAsDataURL(e.target.files[0]);
    }, false);
});

},{"./colours.js":2}],4:[function(require,module,exports){
/**
* Calculates the mean value of a one-dimensional dataset
* @param {Array} data - data set
* @return {Number} mean value of data set
*/
function mean(data) {
    return data.reduce((total,current) => total += current, 0) / data.length;
}
/**
* Calculates the mean point of an n-dimensional dataset
* @param {Array} data - data set
* @return {Array} mean point of data set
*/
function meanPoint(data) {
    var theMeanPoint = [];
    if (data.length != 0) {
        for (let i = 0; i < data[0].length; i++) {
            theMeanPoint.push(mean(data.map(x => x[i])));
        }
    }
    return theMeanPoint;
}

module.exports = {
    mean: mean,
    meanPoint: meanPoint
};
},{}]},{},[3]);
