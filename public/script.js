//import extractColourPalette from 'colours';

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
            canvas.height = aspectRatio * 100;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Extract colour palette from image
            const palette = extractColourPalette(canvas);

            // Post palette back to server
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
              if (req.readyState == 4 && req.status == 200) {

                // Show response HTML
                document.open();
                document.write(req.response);
                document.close();
              }
            };
            req.open('POST', 'palette');
            req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            req.send(JSON.stringify(palette));
        }
    }
    reader.readAsDataURL(e.target.files[0]);
  }, false);
});
