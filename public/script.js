//import extractColourPalette from 'colours';

function generatePaletteString(colours) {
  return colours.reduce(function(total, current){
    return total += colourToHex(current);
  },'');
}

window.addEventListener('load', function () {
  const imageUpload = document.getElementById('image-upload');
  const canvas = document.getElementById('image-canvas');
  const ctx = canvas.getContext('2d');

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

            // Extract colour palette from image
            const palette = extractColourPalette(canvas);

            console.log(palette);
            console.log(palette.map(x => colourToHex(x)));

            // GET page for palette
            window.location.href = 'palette/' + generatePaletteString(palette);
        }
    }
    reader.readAsDataURL(e.target.files[0]);
  }, false);
});
