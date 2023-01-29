const imgurlinks = {
    fire_1: "https://i.imgur.com/kW4VZMI.gif",
    fire_2: "https://i.imgur.com/k6MYOsI.gif",
    fire_3: "https://i.imgur.com/P80fvF9.gif",
    fire_4: "https://i.imgur.com/AV52THF.gif",
    fire_5: "https://i.imgur.com/SvOld88.gif",
    fire_6: "https://i.imgur.com/K0SFGJz.gif",
    fire_7: "https://i.imgur.com/wbioXIu.gif",
    fire_8: "https://i.imgur.com/GkS4Hnw.gif",
    fire_9: "https://i.imgur.com/GmiANJD.gif",
    fire_0: "https://i.imgur.com/Yf4iFR3.png",
    fire_10: "https://i.imgur.com/4XsxdJg.gif",
    bg: "https://i.imgur.com/5zYjMqH.png"
};


const site = window.location.hostname;
var fire = document.createElement("img");
fire.src = imgurlinks.fire_9;
fire.style.position = "fixed";
fire.style.bottom = "10px";
fire.style.left = 0;
fire.style.zIndex = 9999;
fire.width = 100;

var src = document.getElementById("body");
document.body.append(fire);

/*window.addEventListener("message", function (event){
    if (event.data.content === "fireUpdate"){
        this.alert("New fire strength: " + event.data.firestrength);
    }
})*/

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        console.log("Received");
        if (request.content === "fireUpdate"){
            alert(request.firestrength);
        }
        else if (request.content === "stopTimer"){
            stopTimer();
        }
    }
)