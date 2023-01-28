let currentSeconds; // total seconds the user has been focusing in current session
let marshmallowCount;
let timer;
let fireStrength;
let secondsSinceLastFireIncrease;

let isDistracted;
let distractedSeconds; // total seconds the user has been distracted in current session

// Listener that activates when the tab switches
chrome.tabs.onUpdated.addListener((tabId, tab) => {
    // Check if the current page is a focus webpage, set isDistracted accordingly
    if (
        // condition check tab.url
    ){
        // is distracted
        isDistracted = true;
    }
    else{
        // is not distracted
        isDistracted = false;
    }
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
    
}