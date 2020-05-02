'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({disabled: true}, () => {});
  console.log('Disabled: ' + true );
});

chrome.browserAction.onClicked.addListener(function() {
    updateIcon()
});

function updateIcon() {
    chrome.storage.sync.get('disabled', (data) => {
        var disabled = data.disabled;
        if (disabled === true) {
            chrome.browserAction.setIcon(
                {path: '/images/icon.png'}
            );
            disabled = false;
        }
        else {
            chrome.browserAction.setIcon(
                {path: '/images/icon_g.png'}
            );
            disabled = true;
        }

        chrome.storage.sync.set({disabled: disabled}, function() {
            console.log('Disabled: ' + disabled);
        });
    });  
    reloadActiveTab();  
}

// myURLs contains the websites where you want your content script to run
const myURLs = ['scholar.google.com'];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete' && myURLs.some(url => tab.url.includes(url))) {
        hideRecoDiv();
    }
});

function hideRecoDiv() {
    chrome.storage.sync.get('disabled', (data) => {
        if (data.disabled === true) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.executeScript(null, { file: "jquery.slim.min.js" }, function() {
                    chrome.tabs.executeScript(tabs[0].id, {file: "hide.js"});
                  });
            });
        }
    });
}

function reloadActiveTab() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    });
}
