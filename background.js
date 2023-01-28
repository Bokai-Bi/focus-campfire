let currentSeconds;
let currentMinutes;
let currentHours;
let marshmallowCount;
let timer;

chrome.tabs.onUpdated.addListener((tabId, tab) => {
    tab.url
})

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        "id": "sampleContextMenu",
        "title": "Sample Context Menu",
        "contexts": ["selection"]
    });
});

chrome.runtime.onMwessage.addListener(
    function(request, sender, sendResponse){
        if (request.content === "startTimer"){
            startTimer();
        }
        else if (request.content === "stopTimer"){
            stopTimer();
        }
    }
)

function countTime(h, m, s){
    newSeconds = s + 1;
    if (newSeconds >= 60){
        newSeconds -= 60;
        newMinutes = m + 1;
        if (newMinutes >= 60){
            newMinutes -= 60;
            newHours = h + 1;
        }
    }
    timer = setTimeOut(countTime, 1000, newHours, newMinutes, newSeconds)
}

function startTimer(){
    timer = setTimeOut(countTime, 1000, h, m, s);
}

function stopTimer(){
    clearTimeout(timer)
}