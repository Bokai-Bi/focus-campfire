// Saves options to chrome.storage
function save_options() {
    var time = document.getElementById('focusTime').value;
    var url = document.getElementById('focusUrl').value;
    var show = document.getElementById('show').checked;

    chrome.runtime.sendMessage({content:"startTimer"});

    chrome.storage.sync.set({
      focusTime: time,
      focusUrl: url,
      showCampfire: show
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    chrome.storage.sync.get({
      focusTime: '30',
      focusUrl: "https://example.com",
      showCampfire: false,
    }, function(items) {
      document.getElementById('focusTime').value = items.focusTime;
      document.getElementById('focusUrl').value = items.focusUrl;
      document.getElementById('show').checked = items.showCampfire;
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);