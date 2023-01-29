let currentSeconds;
let distractedSeconds;

function pullTime(){
    //alert("Pulling time");
    (async () => {
        const response = await chrome.runtime.sendMessage({content: "timeRequest"});
        // do something with response here, not outside the function
        //alert(JSON.stringify(response));
        currentSeconds = response.currSec;
        distractedSeconds = response.distSec;
      })();
    //alert(currentSeconds + " | " + distractedSeconds);
    var time = Math.floor((currentSeconds + distractedSeconds) / 3600) + "h" + (Math.floor((currentSeconds + distractedSeconds) / 60) % 60)+ "m:"+ Math.floor((currentSeconds + distractedSeconds) % 60) + "s:";
    document.getElementById("timer").textContent = time;
    setTimeout(pullTime, 1000);
    
}

//alert("Is it running?")
pullTime();
//var time = currentSeconds + distractedSeconds / 3600+ ":"+ (currentSeconds + distractedSeconds % 3600) / 60+ ":"+ ((currentSeconds + distractedSeconds % 3600) / 60) % 60;
//document.getElementById("timer").textContent = time;

