// used when Github uses push state.
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    chrome.tabs.executeScript(null, { file: "jquery/jquery-3.2.0.min.js", runAt: 'document_end' }, (j) => {
        chrome.tabs.executeScript(null, { file: "app.js", runAt: 'document_end' }, (a) => {
            chrome.tabs.insertCSS(null, { file: "css/style.css", runAt: 'document_end' });
        });
    })
})

// open the Kamino Github page on installed
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'installed') {
        chrome.tabs.create({ url: 'https://github.com/gatewayapps/kamino' }, (tab) => {
            console.log("Kamino Github page launched")
        })
    }
})

// listen for tab change requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // get settings
    chrome.storage.sync.get({
        goToList: false,
        createTab: true
    }, (item) => {
        if (item.goToList) {
            // if user setting is set, open issue list and set focus and open cloned issue in tab
            chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
                setTimeout(() => {
                    if(item.createTab) {
                        chrome.tabs.create({ url: 'https://github.com/' + request.repo + '/issues/' + request.issueNumber, selected: false })
                    }
                    chrome.tabs.update(tabs[0].id, { url: 'https://github.com/' + request.organization + '/' + request.oldRepo + '/issues', selected: true })
                }, 1000)
            })
        }
        else {
            if(item.createTab) {
                // if user setting is not set, open open cloned issue in new tab and set focus to that tab
                setTimeout(() => { chrome.tabs.create({ url: 'https://github.com/' + request.repo + '/issues/' + request.issueNumber, selected: true }) }, 1000)
            }
        }
    })
})