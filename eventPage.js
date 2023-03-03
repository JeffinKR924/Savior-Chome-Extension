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


chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    if (info.menuItemId === "savePage") {
      const url = tabs[0].url;
      const data = [url];
      // Get tempData from local storage
      chrome.storage.local.get('tempData', async (result) => {
        // if tempData is not empty, add url to tempData
        if (result.tempData) {
          data.push(...result.tempData);
        }
        // else create new tempData
        await chrome.storage.local.set({'tempData': data}, () => {
          console.log('Data saved locally');
        }
        )
      });
    }
  });
})

