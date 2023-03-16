// Creates context menu for saving page, deleting page, and renaming page
chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create({
    "id": "savePage",
    "title": "Save Page",
    "contexts": ["all"]
  })
  chrome.contextMenus.create({
    "id": "delete",
    "title": "Delete",
    "contexts": ["all"]
  })
  chrome.contextMenus.create({
    "id": "rename",
    "title": "Rename",
    "contexts": ["all"]
  })
});

// Adds listener for save page in context menu
chrome.contextMenus.onClicked.addListener((info) => {
  chrome.tabs.query({active: true, currentWindow: true}, tab => {
    // Gets the url of the current tab and window when save page is clicked, then stores into a list
    if (info.menuItemId === "savePage") {
      const url = tab[0].url;
      const data = [url];
      // Gets tempUrlList from chrome.storage, and if it exists, then it adds those urls to data list and stores in chrome.storage
      chrome.storage.local.get('tempData', async (tempUrlList) => {
        if (tempUrlList.tempData) {
          data.push(...tempUrlList.tempData);
        }
        await chrome.storage.local.set({'tempData': data});
      });
    }
  });
})

