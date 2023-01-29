
displayBackground();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
    
});

function displayBackground(src) { //Display the background image
    var img = document.createElement("firebg.png");
    img.src = src;
    img.width = 48;
    img.height = 64;
    document.body.appendChild(img);
   }
   