
let img;

displayBackground();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){            
        img = document.createElement("Fire"+request.content.toString()+".png");
        img.src = src;
        img.width = 48;
        img.height = 64;
        document.body.appendChild(img);
});

function displayBackground(src) { //Display the background image
    img = document.createElement("firebg.png");
    img.src = src;
    img.width = 48;
    img.height = 64;
    img.style.position = fixed;
    document.body.appendChild(img);
   }
   