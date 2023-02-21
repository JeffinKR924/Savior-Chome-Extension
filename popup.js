let save = document.getElementById("save");
let saveSession = document.getElementById("saveSession");
let clearAll = document.getElementById("clearAll");
var myDiv = document.getElementById("dynamicBtnDiv");


async function buttonKeyIncrementer() {
  let keyNum;
  let newKeyName;
  newKeyName = await localforage.getItem('btnKeyNum').then((value) => {
    keyNum = value;
    if (keyNum == null) {
      keyNum = 1;
      localforage.setItem('btnKeyNum', keyNum);
    }
    else {
      keyNum = parseInt(keyNum) + 1;
      localforage.setItem('btnKeyNum', keyNum);
    }
    newKeyName = ('BTN924:N' + String(keyNum));
    return Promise.resolve(newKeyName);
  });
  return newKeyName;
}

async function redundancyChecker(urlArray) {
  let savedItems = await localforage.length();
  if (savedItems !== 0) {
    for (let i = 0; i < savedItems; i++) {
      let storageKey = await localforage.key(i);
      let storageVal = JSON.parse((await localforage.getItem(storageKey)))[0];
      // console.log(JSON.stringify(storageVal));
      // console.log(JSON.stringify(urlArray));
      if (JSON.stringify(storageVal) === JSON.stringify(urlArray)) {
        return true;
      }
    }
  }
  return false;
}

function nameTrimmer(btnName) {
  if (btnName.length>19){
    btnName = btnName.slice(0, 19)+"...";
  }
  return btnName;
}

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

var nameNum = 0;
orderCheckList = [];
async function createButtons() {
  let savedItems = await localforage.length();
  compareVal = 1;
  for (var i = 0; i < savedItems; i++){
    let nameUrl = await localforage.key(i);
    if (nameUrl.startsWith("BTN924")) {
      orderCheck = parseInt(nameUrl.replace("BTN924:N", ""));
      orderCheckList.push(orderCheck);
    }
  }
  orderCheckList.sort(function(a, b) {
    return a - b;
  });
  for (orderNum in orderCheckList) {
    nameUrl = 'BTN924:N' + String(orderCheckList[orderNum]);
    let value = await localforage.getItem(nameUrl);
    value = JSON.parse(value);
    btnLen = (value[0].length)
    if (btnLen == 1) {
      pageBtn = document.createElement("button");
      pageBtn.className = 'dynamicButton';
      pastUrl = nameUrl;
      pastName = btnNamer(pastUrl);
      var favIconImage = document.createElement('img');
      pageBtnName = (((value)))[1];
      pageBtn.innerHTML = (pageBtnName);
      arrVal = (String(((value))[0]));
      const favIconURL = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(arrVal)}&size=23`;
      favIconImage.src = favIconURL;
      favIconImage.className = 'favIcon';
      var faIconFile = document.createElement("h5");
      faIconFile.innerHTML = '<i class="fa-solid fa-file"></i>';
      faIconFile.className = 'faIconFiles';
      pageBtn.appendChild(favIconImage);
      pageBtn.appendChild(faIconFile);
      pageBtn.name = nameUrl;
      pageBtn.onclick = function() {
        tab = (String((JSON.parse(value))[0]));
        chrome.tabs.create({
          url: tab
        });
      }
      myDiv.appendChild(pageBtn);
    }
    else {
      sessionBtn = document.createElement("button");
      sessionBtn.className = 'dynamicButton';
      nameNum+=1;
      var favIconImage = document.createElement('img');
      sessionBtnName = ((value))[1];
      sessionBtnName = sessionBtnName.replace("BTN924:N", "");
      sessionBtn.innerHTML = sessionBtnName;
      sessionFavIcon = (((value))[0]);
      arrVal = String(((value))[0][0]);
      const favIconURL = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(arrVal)}&size=23`;
      favIconImage.src = favIconURL;
      favIconImage.className = 'favIcon';
      var faIconFolder = document.createElement("h5");
      faIconFolder.innerHTML = '<i class="fa fa-folder"></i>';
      faIconFolder.className = 'faIconFolders';
      sessionBtn.name = nameUrl;
      sessionBtn.id = String(nameNum);
      sessionBtn.appendChild(favIconImage);
      sessionBtn.appendChild(faIconFolder);
      sessionBtn.onclick = function() {
        session = ((value))[0];
        for (var z = 0; z < session.length; z++) {
          chrome.tabs.create({
            url: session[z]
          });
        }
      }
      myDiv.appendChild(sessionBtn);
    }
  }
}
createButtons();


save.onclick = function (element) {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    // currentWindow seems to be working, but test it because i thought issues occured before when i
// used it years ago
    valueArray = [];
    urlArray = [];
    url = tabs[0].url;
    urlArray.push(url);
    valueArray.push(urlArray);
    const favIconURL = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=23`;
    var favIconImage = document.createElement('img');
    favIconImage.src = favIconURL;
    favIconImage.className = 'favIcon';
    var faIconFile = document.createElement("h5");
    faIconFile.innerHTML = '<i class="fa-solid fa-file"></i>';
    faIconFile.className = 'faIconFiles';
    currentUrl = url;
    currentName = btnNamer(currentUrl);
    valueArray.push(currentName);
    redundancyChecker(urlArray).then(redun => {
      // console.log(redun);
      if (redun == false) {
        async function callingFunction() {
          const key = await buttonKeyIncrementer();
          // console.log(key);
          localforage.setItem(key, JSON.stringify(valueArray));
          btn.className = 'dynamicButton';
        }
        callingFunction();
      }
    }); 

    btn = document.createElement("BUTTON");
    // btn.className = 'dynamicButton';
    btn.innerHTML = (currentName);
    btn.name = urlArray;
    btn.appendChild(favIconImage);
    btn.appendChild(faIconFile);
    btn.onclick = function() {
      chrome.tabs.create({
        url: url
      });
      console.log(url);
    }
    myDiv.appendChild(btn);
  });
}


saveSession.onclick = function (element) {
  chrome.tabs.query({currentWindow: true}, tabs => {
    if (tabs.length==1){
      console.log('hello');
      save.onclick();
    }
    else {
    //   console.log('zaza');
      valueArray = [];
      urlArray = [];
      for (i = 0; i<tabs.length; i++){
        url = tabs[i].url;
        urlArray.push(url);
      }
      // console.log(urlArray);
      valueArray.push(urlArray);
      // console.log(valueArray);
      // localStorageLength = Math.floor(Math.random()*100);
      // valueArray.push("Session " + String(localStorageLength));
      var arrayName = ("SESSION924"+urlArray.toString());
      console.log(arrayName);
      redundancyChecker(urlArray).then(redun => {
        // console.log(redun);
        if (redun == false) {
          async function callingFunction() {
            const key = await buttonKeyIncrementer();
            btnVisibleName = key.replace('SESSION924:N', '');
            valueArray.push("Session " + btnVisibleName);
            localforage.setItem(key, JSON.stringify(valueArray));
            // console.log(btnVisibleName);

          }
          callingFunction();
        }
      }); 
      btn = document.createElement("BUTTON");
      btn.className = 'dynamicButton';
      btn.innerHTML = ("New Session");
      arrVal = String(urlArray[0]);
      const favIconURL = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(arrVal)}&size=23`;
      var favIconImage = document.createElement('img');
      favIconImage.src = favIconURL;
      favIconImage.className = 'favIcon';
      var faIconFolder = document.createElement("h5");
      faIconFolder.innerHTML = '<i class="fa fa-folder"></i>';
      faIconFolder.className = 'faIconFolders';
      btn.name = arrayName;
      btn.appendChild(favIconImage);
      btn.appendChild(faIconFolder);
      myDiv.appendChild(btn);
      btn.onclick = function() {
        for (var a = 0; a < urlArray.length; a++) {
          chrome.tabs.create({
            url: urlArray[a]
          });
        }
      }
    }
  }); 
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    if (info.menuItemId === "delete") {
      if (objectName != null && objectName != '') {
        localforage.removeItem(objectName);
        window.open('', '_blank').close();
      }
    }
    else if (info.menuItemId === "rename") {
      if (objectName != null && objectName != '') {
        oldName = null;
        localforage.getItem(objectName).then((value) => {
          oldName = JSON.parse(value);
          let newName = prompt("Enter a new name:", String(oldName[1]));
          oldName[1] = newName;
          localforage.setItem(String(objectName), JSON.stringify(oldName));
          window.close();
      });
      }
    }
  });
});


clearAll.onclick = function (element) {
  var result = confirm("Are you sure you want to delete all saved pages and sessions?");
  if (result) {
    localforage.clear();
    window.open('', '_blank').close();
  }
};

window.addEventListener('mousedown', (event) => {
  console.log(event);
  if (event.which === 3) {
    divTest = String(event.target.className); 
    obj = event.target;
    // console.log(obj);
    if (divTest == 'fa-solid fa-file' || divTest == 'favIcon' || divTest == 'fa fa-folder') {
      while(divTest != 'dynamicButton'){
        obj = obj.parentElement;
        divTest = String(obj.className);
      }
      objectName = obj.name;
    }
    else if (divTest == 'dynamicButton') {
      objectName = obj.name
    }
    else {
      objectName = null;
    }
    // console.log(objectName);
  }
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.management.getSelf(function(extensionInfo) {
        console.log("getSelf: ", extensionInfo);
        chrome.tabs.query({url: "chrome-extension://jgcbiapajnpiekmfmnohjmccjfafelbg/*"}, function(tabs) {
            console.log("tabs: ", tabs);
            var currentTab = tabs[0];
            var tabId = currentTab.id;
            chrome.tabs.get(tabId, function(tab) {
                console.log("tab: ", tab);
                var windowId = tab.windowId;
                console.log("windowId: ", windowId);
            });
        });
    });
});

// New Bug: Right clicking and deleting a page causes the next page to delete. so deleting session
// 1 deletes session 2 instead for some reason. The problem is with mouse down windoweventlistener.
// The problem cant be with the bubbling event.target thing that i worked on because clicking
// directly on the button, not even the favicon or faicon, returns next button num.
// Also nothing else is calling this mousedown event listener at all. Only right clicking calls
// the function, that is the only way to run it.
// Idea: I assign the name and details to a button in the async function, so it technically
// should not be available outside of the scope of that function. The name is assigned to the
// button inside of the async function, so maybe thats the problem. Maybe i need to make it
// global somehow.
// UPDATE: Issue lies in the createButtons function. Go to line 111.





