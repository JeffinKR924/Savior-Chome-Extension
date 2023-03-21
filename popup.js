let save = document.getElementById("save");
let saveSession = document.getElementById("saveSession");
let clearAll = document.getElementById("clearAll");
var myDiv = document.getElementById("dynamicBtnDiv");


savePage();
async function savePage() {
  const result = await new Promise(resolve => {
    chrome.storage.local.get(['tempData'], function(result) {
      resolve(result);
    });
  });
  
  if (result.tempData) {
    for (let i = ((result.tempData.length)-1); i >= 0; i--) {
      valueArray = [];
      urlArray = [];
      urlArray.push(result.tempData[i]);
      valueArray.push(urlArray);
      currentUrl = result.tempData[i];
      currentName = btnNamer(currentUrl);
      valueArray.push(currentName);
      const redun = await redundancyChecker(urlArray);
      if (redun == false) {
        const key = await buttonKeyIncrementer();
        await localforage.setItem(key, JSON.stringify(valueArray));
      }
    }
    chrome.storage.local.remove('tempData', function() {
      console.log('Removed tempData');
    });
  }
  createButtons();
}


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
    btnName = btnName.slice(0, 44)+"...";
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
  btnName = nameTrimmer(btnName);
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
        tab = (String(((value))[0]));
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
// createButtons();

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
        }
        callingFunction();
      }
    }); 

    btn = document.createElement("BUTTON");
    btn.className = 'dynamicButton';
    btn.innerHTML = (currentName);
    btn.name = urlArray;
    btn.appendChild(favIconImage);
    btn.appendChild(faIconFile);
    btn.onclick = function() {
      chrome.tabs.create({
        url: url
      });
      // console.log(url);
    }
    myDiv.appendChild(btn);
  });
}


saveSession.onclick = function (element) {
  chrome.tabs.query({currentWindow: true}, tabs => {
    if (tabs.length==1){
      save.onclick();
    }
    else {
      valueArray = [];
      urlArray = [];
      for (i = 0; i<tabs.length; i++){
        url = tabs[i].url;
        urlArray.push(url);
      }
      valueArray.push(urlArray);
      var arrayName = ("SESSION924"+urlArray.toString());
      redundancyChecker(urlArray).then(redun => {
        if (redun == false) {
          async function callingFunction() {
            const key = await buttonKeyIncrementer();
            btnVisibleName = key.replace('BTN924:N', '');
            valueArray.push("Session " + btnVisibleName);
            localforage.setItem(key, JSON.stringify(valueArray));

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
          newName = nameTrimmer(newName);
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
  // console.log(event);
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
        // console.log("getSelf: ", extensionInfo);
        chrome.tabs.query({url: "chrome-extension://jgcbiapajnpiekmfmnohjmccjfafelbg/*"}, function(tabs) {
            // console.log("tabs: ", tabs);
            var currentTab = tabs[0];
            var tabId = currentTab.id;
            chrome.tabs.get(tabId, function(tab) {
                // console.log("tab: ", tab);
                var windowId = tab.windowId;
                // console.log("windowId: ", windowId);
            });
        });
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "saveButtonClick") {
    save.onclick();
  }
});


// Change font for button text and make sure max btn character limit is good
// gonna keep 10.4 font size. should i get rid of one char lenght?
// 18 chars isnt long. if it goes longer, should i add a second line. there is room
// weird bug. when you save two of the same pages. it does a weird add thing
// bug. cant rename right after saving a page. have to refresh







