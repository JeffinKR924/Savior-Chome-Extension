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
    else if (info.menuItemId === "deletePage"){
      var pageFlagList = (sessionStorage.getItem('pageFlag'));
      var pageLink = pageFlagList.slice(pageFlagList.indexOf(',') + 1);
      var pageFlag = pageFlagList.slice(0, pageFlagList.indexOf(','));
      if (pageFlag == 'up'){
        window.localStorage.removeItem(pageLink);
        window.open('', '_blank').close();
      }
    }
    else if (info.menuItemId === "deleteSession") {
      var sessionFlagList = (sessionStorage.getItem('sessionFlag'));
      var sessionLink = sessionFlagList.slice(sessionFlagList.indexOf(',') + 1);
      var sessionFlag = sessionFlagList.slice(0, sessionFlagList.indexOf(','));
      if (sessionFlag == 'up'){
        window.localStorage.removeItem(sessionLink);
        window.open('', '_blank').close();
      }
    }
    else if (info.menuItemId === "deleteSession") {
      
    }
  });
})

    // else {
    //   try {
    //     var pageFlagList = (sessionStorage.getItem('pageFlag'));
    //     var pageLink = pageFlagList.slice(pageFlagList.indexOf(',') + 1);
    //     var pageFlag = pageFlagList.slice(0, pageFlagList.indexOf(','));
    //   }

    //   catch (e) {
    //     var sessionFlagList = (sessionStorage.getItem('sessionFlag'));
    //     var sessionLink = sessionFlagList.slice(sessionFlagList.indexOf(',') + 1);
    //     var sessionFlag = sessionFlagList.slice(0, sessionFlagList.indexOf(','));
    //   }

    //   if (sessionFlag == 'up' || pageFlag == 'up'){
    //     console.log('hello');
    //     val = prompt('Whats up?');
    //   }
    // }
