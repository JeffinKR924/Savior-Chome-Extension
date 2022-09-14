import {btnNamer} from 'popup.js';

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
      valueArray = [];
      urlArray = [];
      url = tabs[0].url;
      urlArray.push(url);
      valueArray.push(urlArray);
      currentUrl = url;
      currentName = btnNamer(currentUrl);
      valueArray.push(currentName);
      window.localStorage.setItem(String(url), JSON.stringify(valueArray));
    } 
  });
})

// cant add this func inside of popup because hover is req. it doesnt work rn
// because of an issue with btnNamer i believe. fix issue.