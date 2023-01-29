let currentSeconds; // total seconds the user has been focusing in current session
let marshmallowCount;
let timer;
let fireStrength;
let secondsSinceLastFireIncrease;

let endTime; // the total number of seconds the user has decided to work for (30 minutes to 4 hours)


let isDistracted;
let distractedSeconds; // total seconds the user has been distracted in current session

let maxFocusTime = 6000;
let focusUrls = ["default.com", "youtube.com"];

function updateConfigs(){
    chrome.storage.sync.get({
        focusTime: 0,
        focusUrl: "example.com"
    }, function(items){
        maxFocusTime = items.focusTime;
        focusUrls = items.focusUrl.split("|");
    });
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
        console.log(maxFocusTime);
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
            updateConfigs();
            overlay();
        }
        else if (request.content === "stopTimer"){
            stopTimer();
        }
    }
)

function countTime(oldSeconds, oldDistractedSeconds){
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
        fireStrengthIncreaseThresh = 60 * 15;
    }
    else{
        fireStrengthIncreaseThresh = 60 * 30;
    }

    if (secondsSinceLastFireIncrease > fireStrengthIncreaseThresh){
            secondsSinceLastFireIncrease = 0;
            fireStrength += 1;
            updateFireStrength();
    }
    else{
        secondsSinceLastFireIncrease += 1;
    }

    timer = setTimeOut(countTime, 1000, newSeconds);
}

function startTimer(){
    // execute countTime with parameter 0 after 1000ms
    secondsSinceLastFireIncrease = 0;
    timer = setTimeOut(countTime, 1000, 0);
}

function stopTimer(){
    // stop the timer
    clearTimeout(timer)
}

function updateFireStrength(){
    // send updated fireStrength to contentscript
    chrome.runtime.sendMessage(fireStrength);
}


function overlay(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id,{file:"js/overlay.js"});
      });
}