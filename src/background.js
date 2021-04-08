
chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
  	console.info("onupdated");
    // read changeInfo data and do something with it
    // like send the new url to contentscripts.js
    if (changeInfo.url) {
      chrome.tabs.sendMessage( tabId, {
        message: 'hello!',
        url: changeInfo.url
      })
    }
  }
);
