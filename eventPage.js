chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create({
    "id": "savePage",
    "title": "Save Page",
    "contexts": ["all"]
  })
  chrome.contextMenus.create({
    "id": "deletePage",
    "title": "Delete Page",
    "contexts": ["all"]
  })
  chrome.contextMenus.create({
    "id": "deleteSession",
    "title": "Delete Session",
    "contexts": ["all"]
  })
  chrome.contextMenus.create({
    "id": "rename",
    "title": "Rename",
    "contexts": ["all"]
  })
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    if (info.menuItemId === "savePage") {
      url = tabs[0].url;
      currentUrl = url;
      window.localStorage.setItem(String(url), url);
    } 
  });
})

