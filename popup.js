// import localforage from "./localForage/src/localforage.js";

let save = document.getElementById("save");
let saveSession = document.getElementById("saveSession");
let clearAll = document.getElementById("clearAll");
var myDiv = document.getElementById("dynamicBtnDiv");


async function buttonKeyIncrementer(btnType) {
  let keyNum;
  let newKeyName;
  if (btnType == 'page') {
    newKeyName = await localforage.getItem('pageKeyNum').then((value) => {
      keyNum = value;
      // console.log(keyNum);
      if (keyNum == null) {
        keyNum = 1;
        localforage.setItem('pageKeyNum', keyNum);
      }
      else {
        keyNum = parseInt(keyNum) + 1;
        localforage.setItem('pageKeyNum', keyNum);
      }
      newKeyName = ('PAGE924:N' + String(keyNum));
      // console.log(newKeyName);
      return Promise.resolve(newKeyName);  // Return a Promise that resolves to the newKeyName value
    });
  }
  else {
    newKeyName = await localforage.getItem('sessionKeyNum').then((value) => {
      keyNum = value;
      if (keyNum == null) {
        keyNum = 1;
        localforage.setItem('sessionKeyNum', keyNum);
      }
      else {
        keyNum = parseInt(keyNum) + 1;
        localforage.setItem('sessionKeyNum', keyNum);
      }
      newKeyName = ('SESSION924:N' + String(keyNum));
      return Promise.resolve(newKeyName);  // Return a Promise that resolves to the newKeyName value
    });
  }
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
async function createButtons() {
  let savedItems = await localforage.length();
  for (var i = 0; i < savedItems; i++){
    let nameUrl = await localforage.key(i);    
    if (nameUrl.startsWith("PAGE924")) {
      pageBtn = document.createElement("button");
      pageBtn.className = 'dynamicButton';
      pastUrl = nameUrl;
      pastName = btnNamer(pastUrl);
      var favIconImage = document.createElement('img');
      localforage.getItem(nameUrl).then((value) => {
        pageBtnName = (JSON.parse((value)))[1];
        // console.log(pageBtnName);
        pageBtn.innerHTML = (pageBtnName);
        arrVal = (String((JSON.parse(value))[0]));
        console.log(arrVal);
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
          // newUrl = String((JSON.parse(localforage.getItem(this.name)))[0]);
          localforage.getItem(this.name).then((page) => {
            page = String((JSON.parse(page))[0]);
            chrome.tabs.create({
              url: page
            });
        })
      }
      myDiv.appendChild(pageBtn);
    })
  }
    else if (nameUrl.startsWith("SESSION924")) {
      sessionBtn = document.createElement("button");
      sessionBtn.className = 'dynamicButton';
      nameNum+=1;
      var favIconImage = document.createElement('img');
      localforage.getItem(nameUrl).then((value) => {
        sessionBtnName = (JSON.parse(value))[1];
        sessionBtn.innerHTML = sessionBtnName;
        sessionFavIcon = ((JSON.parse(value))[0]);
        arrVal = String((JSON.parse(value))[0][0]);
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
          localforage.getItem(this.name).then((session) => {
            session = (JSON.parse(session))[0];
            // session = (JSON.parse(window.localStorage.getItem(this.name)))[0];
            for (var z = 0; z < session.length; z++) {
              chrome.tabs.create({
                url: session[z]
              });
            }
        })
        }
        myDiv.appendChild(sessionBtn);
      })
    }
  }
}
createButtons();




save.onclick = function (element) {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
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
      console.log(redun);
      if (redun == false) {
        async function callingFunction() {
          const key = await buttonKeyIncrementer('page');
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
    }
    myDiv.appendChild(btn);
  });
}


saveSession.onclick = function (element) {
  chrome.tabs.query({lastFocusedWindow: true}, function(tabs) {
    if (tabs.length==1){
      // console.log('hello');
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
      redundancyChecker(urlArray).then(redun => {
        console.log(redun);
        if (redun == false) {
          async function callingFunction() {
            const key = await buttonKeyIncrementer('session');
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
          localforage.setItem(String(objectName), oldName);
          window.close();
      });
      }
    }
  });
});



// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
//     if (info.menuItemId === "delete") {
//       if (objectName != null && objectName != '') {
//         window.localStorage.removeItem(objectName);
//         window.open('', '_blank').close();
//       }
//     }
//     else if (info.menuItemId === "rename") {
//       if (objectName != null && objectName != '') {
//         oldName = (JSON.parse(window.localStorage.getItem(objectName)));
//         let newName = prompt("Enter a new name:", String(oldName[1]));
//         oldName[1] = newName;
//         window.localStorage.setItem(String(objectName), JSON.stringify(oldName));
//         window.close();
//       }
//     }
//   });
// })


clearAll.onclick = function (element) {
  var result = confirm("Are you sure you want to delete all saved pages and sessions?");
  if (result) {
    localforage.clear();
    window.open('', '_blank').close();
  }
};

window.addEventListener('mousedown', (event) => {
  if (event.which === 3) {
    divTest = String(event.target.className); 
    obj = event.target;
    // keyNum = window.localStorage.getItem('pageKeyNum');
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




// The only bug i see is that chrome.tabs.query() will get the tabs of the last focused window,
// so if the last focused window is another chrome window or chrome inspect page, and you press
// one of the save buttons without refocusing on the previous window, then chrome.tabs will
// retrieve the url of the previously focused window and not the window that opened the
// extension


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


