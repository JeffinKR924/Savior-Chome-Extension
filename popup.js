// import localforage from "./localForage/src/localforage.js";

let save = document.getElementById("save");
let saveSession = document.getElementById("saveSession");
let clearAll = document.getElementById("clearAll");
var myDiv = document.getElementById("dynamicBtnDiv");

function buttonKeyIncrementer(btnType) {
  if (btnType == 'page') {
    keyNum = window.sessionStorage.getItem('pageKeyNum');
    if (keyNum == null) {
      console.log('bruh');
      keyNum = 1;
      window.sessionStorage.setItem('pageKeyNum', keyNum);
    }
    else {
      keyNum = keyNum + 1;
      window.sessionStorage.setItem('pageKeyNum', keyNum);
    }
    newKeyName = ('PAGE924:N' + String(keyNum));
  }
  else {
    keyNum = window.sessionStorage.getItem('sessionKeyNum');
    if (keyNum == null) {
      keyNum = 1;
      window.sessionStorage.setItem('sessionKeyNum', keyNum);
    }
    else {
      keyNum = keyNum + 1;
      window.sessionStorage.setItem('sessionKeyNum', keyNum);
    }
    newKeyName = ('SESSION924:N' + String(keyNum));
  }
  return(newKeyName);
}

function redundancyChecker(urlArray){
  savedItems = parseInt(window.localStorage.length);
  if (savedItems != 0) {
    for (var i = 0; i < savedItems; i++){
      storageKey = localStorage.key(i);
      storageVal = (JSON.parse(window.localStorage.getItem(storageKey)))[0];
      if (JSON.stringify(storageVal) == JSON.stringify(urlArray)){
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


savedItems = parseInt(window.localStorage.length);
var nameNum = 0;
for (var i = 0; i < savedItems; i++){
  nameUrl = localStorage.key(i);
  arrayTest = nameUrl.startsWith("SESSION924");
  if (arrayTest == false) {
    pageBtn = document.createElement("button");
    pageBtn.className = 'dynamicButton';
    pastUrl = nameUrl;
    pastName = btnNamer(pastUrl);
    pageBtnName = (JSON.parse(window.localStorage.getItem(nameUrl)))[1];
    pageBtn.innerHTML = (pageBtnName);
    favIconURL = "chrome://favicon/size/23@1x/" + nameUrl;
    var favIconImage = document.createElement('img');
    favIconImage.src = favIconURL;
    favIconImage.className = 'favIcon';
    var faIconFile = document.createElement("h5");
    faIconFile.innerHTML = '<i class="fa-solid fa-file"></i>';
    faIconFile.className = 'faIconFiles';
    pageBtn.appendChild(favIconImage);
    pageBtn.appendChild(faIconFile);
    pageBtn.name = nameUrl;
    pageBtn.onclick = function() {
      newUrl = String((JSON.parse(window.localStorage.getItem(this.name)))[0]);
      chrome.tabs.create({
        url: newUrl
      });
    }
    myDiv.appendChild(pageBtn);
  }
  else {
    sessionBtn = document.createElement("button");
    sessionBtn.className = 'dynamicButton';
    nameNum+=1;
    sessionBtnName = (JSON.parse(window.localStorage.getItem(nameUrl)))[1];
    sessionBtn.innerHTML = sessionBtnName;
    sessionFavIcon = (JSON.parse(window.localStorage.getItem(nameUrl)))[0];
    favIconURL = "chrome://favicon/size/23@1x/" + (sessionFavIcon);
    var favIconImage = document.createElement('img');
    favIconImage.src = favIconURL;
    favIconImage.className = 'favIcon';
    var faIconFolder = document.createElement("h5");
    faIconFolder.innerHTML = '<i class="fa fa-folder"></i>';
    faIconFolder.className = 'faIconFolders';
    sessionBtn.appendChild(favIconImage);
    sessionBtn.appendChild(faIconFolder);
    var btnTypeIcon
    sessionBtn.name = nameUrl;
    sessionBtn.id = String(nameNum);
    sessionBtn.onclick = function() {
      session = (JSON.parse(window.localStorage.getItem(this.name)))[0];
      for (var z = 0; z < session.length; z++) {
        chrome.tabs.create({
          url: session[z]
        });
      }
    }
    myDiv.appendChild(sessionBtn);
  }
}

save.onclick = function (element) {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    valueArray = [];
    urlArray = [];
    url = tabs[0].url;
    urlArray.push(url);
    redun = redundancyChecker(urlArray);
    valueArray.push(urlArray);
    favIconURL = "chrome://favicon/size/23@1x/" + url;
    var favIconImage = document.createElement('img');
    favIconImage.src = favIconURL;
    favIconImage.className = 'favIcon';
    var faIconFile = document.createElement("h5");
    faIconFile.innerHTML = '<i class="fa-solid fa-file"></i>';
    faIconFile.className = 'faIconFiles';
    currentUrl = url;
    currentName = btnNamer(currentUrl);
    valueArray.push(currentName);
    key = buttonKeyIncrementer('page');
    if (redun == false) {
      window.localStorage.setItem(key, JSON.stringify(valueArray));
    }
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
    }
    myDiv.appendChild(btn);
  });
}

saveSession.onclick = function (element) {
  chrome.tabs.query({lastFocusedWindow: true}, function(tabs) {
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
      redun = redundancyChecker(urlArray);
      valueArray.push(urlArray);
      localStorageLength = (localStorage.length)+1;
      valueArray.push("Session " + String(localStorageLength));
      var arrayName = ("SESSION924"+urlArray.toString());
      key = buttonKeyIncrementer('page');
      if (redun == false) {
        window.localStorage.setItem(key, JSON.stringify(valueArray));
      }
      btn = document.createElement("BUTTON");
      btn.className = 'dynamicButton';
      btn.innerHTML = ("New Session");
      favIconURL = "chrome://favicon/size/23@1x/" + (urlArray[0]);
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
        window.localStorage.removeItem(objectName);
        window.open('', '_blank').close();
      }
    }
    else if (info.menuItemId === "rename") {
      if (objectName != null && objectName != '') {
        oldName = (JSON.parse(window.localStorage.getItem(objectName)));
        let newName = prompt("Enter a new name:", String(oldName[1]));
        oldName[1] = newName;
        window.localStorage.setItem(String(objectName), JSON.stringify(oldName));
        window.close();
      }
    }
  });
})


clearAll.onclick = function (element) {
  var result = confirm("Are you sure you want to delete all saved pages and sessions?");
  if (result) {
    window.localStorage.clear();
    window.open('', '_blank').close();
  }
};
window.addEventListener('mousedown', (event) => {
  if (event.which === 3) {
    divTest = String(event.target.className); 
    obj = event.target;
    keyNum = window.sessionStorage.getItem('pageKeyNum');
    if (divTest == 'fa-solid fa-file' || divTest == 'favIcon' || divTest == 'fa fa-folder') {
      while(divTest != 'dynamicButton'){
        obj = obj.parentElement;
        divTest = String(obj.className);
      }
      objectName = obj.name
    }
    else if (divTest == 'dynamicButton') {
      objectName = obj.name
    }
    else {
      objectName = null;
    }
  }
});


// localforage.setItem('myuniquekey', 010101010);
// test = localforage.getItem('myuniquekey');
// console.log(test);





// Also, the session names face a serious bug rn with the naming
// scheme. They can overlap if one button is deleted, since they are based on current length.
// Can fix this issue by having a num for session that constantly goes up despite the length,
// like a counter.

// We are going to use numeric keys for pages and sessions now. We are going to store these
// keys in local session(although this might change if we move to local forage). There will
// be one key for pages and one key for sessions. The digits will constantly increment
// until the clear all button is pressed. 

// BUG: local session data only lasts while the tab is still open. so it would not work for
// my use case. the only real fix i see is moving to local forage now
