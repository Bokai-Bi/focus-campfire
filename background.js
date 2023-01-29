let currentSeconds; // total seconds the user has been focusing in current session
let marshmallowCount;
let timer;
let fireStrength;
let secondsSinceLastFireIncrease;

let endTime = 30; // the total number of minutes the user has decided to work for (30 minutes to 4 hours)


let isDistracted;
let distractedSeconds; // total seconds the user has been distracted in current session

let focusUrls = ["default.com", "youtube.com"];

function updateConfigs(){
    console.log("updating configs")
    chrome.storage.sync.get({
        focusTime: 0,
        focusUrl: "example.com"
    }, function(items){
        endTime = items.focusTime;
        focusUrls = items.focusUrl.split("|");
    });
    console.log(endTime + " + " + focusUrls);
}

// Listener that activates when the tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the current page is a focus webpage, set isDistracted accordingly
    // console.log(tab.url);
    isDistracted = !(focusUrls.reduce(
        (foundFocus, currentFocus) =>
        (foundFocus || tab.url.includes(currentFocus)), false));
    console.log(isDistracted);

    if (tab.url.includes("thwiki.cc")){
        console.log("Updating config");
        updateConfigs();
        console.log(endTime);
        console.log(focusUrls);
    }
})

// Listener that activates when the tab switches
chrome.tabs.onActivated.addListener((changeInfo) => {
    // Check if the current page is a focus webpage, set isDistracted accordingly
    chrome.tabs.query({currentWindow: true, active: true}, function(newTabs){
        const newUrl = newTabs[0].url;
        // console.log(newUrl);
        isDistracted = !(focusUrls.reduce(
            (foundFocus, currentFocus) =>
            (foundFocus || newUrl.includes(currentFocus)), false)); 
        console.log(isDistracted);
    })
})

// Listener that activates on installing the extension
chrome.runtime.onInstalled.addListener(() => {
    // leads the user to setup focustime and username? other first time configs
    chrome.contextMenus.create({
        "id": "sampleContextMenu",
        "title": "Sample Context Menu",
        "contexts": ["selection"]
    });
});

// Listener that activates on receiving a message (from content script probably)
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if (request.content === "startTimer"){
            startTimer();
            fireStrength = 1;
            updateConfigs();
            //overlay();
        }
        else if (request.content === "stopTimer"){
            stopTimer();
        }
    }
)

function countTime(oldSeconds, oldDistractedSeconds){

    console.log("seconds: " + oldSeconds);
    console.log("distracted seconds: " + oldDistractedSeconds);
    console.log("fire strength: " + fireStrength);

    let newSeconds;
    let newDistractedSeconds;
    if (isDistracted){
        newDistractedSeconds = oldDistractedSeconds + 1;
        newSeconds = oldSeconds;
    }
    else{
        newDistractedSeconds = oldDistractedSeconds;
        newSeconds = oldSeconds + 1;
    }
    currentSeconds = newSeconds;
    distractedSeconds = newDistractedSeconds;

    // increase marshmellow count based on the current number of seconds
    marshmallowCount = Math.ceil((endTime/72) / (1 + Math.E^((-12/endTime) * (currentSeconds - 0.5 * endTime))));

    // increase fire strength every 15 min if strength < 4, else every 30 min
    let fireStrengthIncreaseThresh;
    if (fireStrength <= 4){
        fireStrengthIncreaseThresh = 15;
    }
    else{
        fireStrengthIncreaseThresh = 30;
    }

    if (secondsSinceLastFireIncrease >= fireStrengthIncreaseThresh){
            secondsSinceLastFireIncrease = 0;
            if (fireStrength < 10){
                fireStrength += 1;
                updateFireStrength();
            }
    }
    secondsSinceLastFireIncrease += 1;

    // decrease fire strength for every 2 minute spent distracted
    if ((distractedSeconds%10 == 0) && (distractedSeconds != 0)){
        if (fireStrength > 1){
            fireStrength -= 1;
            updateFireStrength();
        }
    }
    if (newSeconds + newDistractedSeconds > endTime){
        // end the fire
    }
    else{
        timer = setTimeout(countTime, 1000, newSeconds, newDistractedSeconds);
    }
}

function startTimer(){
    // execute countTime with parameter 0 after 1000ms
    console.log("Timer started from 0");
    secondsSinceLastFireIncrease = 0;
    timer = setTimeout(countTime, 1000, 0, 0);
    updateFireStrength();
}

function stopTimer(){
    // stop the timer
    clearTimeout(timer)
}

function updateFireStrength(){
    // send updated fireStrength to contentscript
    console.log("sending updated fire strength with window: " + fireStrength);
    //window.postMessage({content: "fireUpdate", firestrength: fireStrength});
    //chrome.runtime.sendMessage({content: "fireUpdate", value: fireStrength});
    /*chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
        chrome.tabs.sendMessage(tabs[0].id, {content: "fireUpdate", firestrength: fireStrength});
    })*/
    (async () => {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        const response = await chrome.tabs.sendMessage(tab.id, {content: "fireUpdate", firestrength: fireStrength});
        // do something with response here, not outside the function
      })();
}


/*function overlay(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id,{file:"js/overlay.js"});
      });
}*/

