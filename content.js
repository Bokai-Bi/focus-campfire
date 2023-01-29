const site = window.location.hostname;
alert("Injection works to " + site);

var fire = document.createElement("img");
fire.src = "https://cs.brown.edu/courses/csci0190/2022/shriram.jpg"
var src = document.getElementById("body");
document.body.append(fire);
alert("done");