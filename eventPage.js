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

function btnNamer(btnName) {
  btnName = new URL(btnName);
  btnName = btnName.hostname;
  btnName = btnName.toString();
  subDomain = ["www.", "www4.", "www3.", ".com", ".net", ".org", ".co", ".us", ".gov", ".edu"];
  for (var i =0; i < subDomain.length; i++){
    btnName = btnName.replaceAll(subDomain[i], "");
  }
  btnName = btnName.charAt(0).toUpperCase()+btnName.slice(1);
  checkSt = btnName.includes(".");
  if (checkSt==true) {
    checkIndex = btnName.indexOf(".");
    btnName = btnName.slice(0, checkIndex+1)+btnName.charAt(checkIndex+1).toUpperCase()+btnName.slice(checkIndex+2);
  }
  btnName = btnName.trim();
  if (btnName.length>19){
    btnName = btnName.slice(0, 19)+"...";
  }
  return btnName;
}

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
