const colourUtils = require('./colours.js');
const paletteString = require('./palette-string.js');

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
                        window.location.href = 'palette/' + paletteString.encodePaletteString(palette) + '?new=true';
                    });
                });
            };
        };
        reader.readAsDataURL(e.target.files[0]);
    }, false);
});
