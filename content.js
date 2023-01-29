
const imgurlist = ["https://i.imgur.com/Yf4iFR3.png", "https://i.imgur.com/kW4VZMI.gif", "https://i.imgur.com/k6MYOsI.gif", "https://i.imgur.com/P80fvF9.gif", 
"https://i.imgur.com/AV52THF.gif", "https://i.imgur.com/SvOld88.gif", "https://i.imgur.com/K0SFGJz.gif",
"https://i.imgur.com/wbioXIu.gif", "https://i.imgur.com/GkS4Hnw.gif", "https://i.imgur.com/GmiANJD.gif", "https://i.imgur.com/4XsxdJg.gif"
];
function changeFireLevel(fireStrength){

    currFire = imgurlist[fireStrength];

}

var currFire = "https://i.imgur.com/Yf4iFR3.png";


const site = window.location.hostname;
var fire = document.createElement("img");
fire.src = currFire;
fire.style.position = "fixed";
fire.style.bottom = "10px";
fire.style.left = 0;
fire.style.zIndex = 9999;
fire.width = 100;

var src = document.getElementById("body");
document.body.append(fire);