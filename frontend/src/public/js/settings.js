$(document).ready(function(){
  document.getElementById('file-input').onchange = function (e) {
    var file = e.target.files[0];
    var filter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

    if (!filter.test(file.type)) {
      alert("You must select a valid image file!");
      return e.target.files[0] == undefined;
    }

    var loadingImage = window.loadImage(
      file,
      function (img) {
        if(img.type === "error") {
          console.log("Error loading image ");
        } else {
          document.body.appendChild(img);
        }
      },
      {
        maxWidth: 50,
        maxHeight: 50,
        minWidth: 50,
        minHeight: 50,
        canvas: true,
        noRevoke: true
      }
    );
    if (!loadingImage) {
      console.log("No loading ");
    }
  };
});