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
    return Promise.resolve(newKeyName);  // Return a Promise that resolves to the newKeyName value
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
      localforage.getItem(nameUrl).then((value) => {
        pageBtnName = (JSON.parse((value)))[1];
        // console.log(pageBtnName);
        pageBtn.innerHTML = (pageBtnName);
        arrVal = (String((JSON.parse(value))[0]));
        // console.log(arrVal);
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
    else {
      sessionBtn = document.createElement("button");
      sessionBtn.className = 'dynamicButton';
      nameNum+=1;
      var favIconImage = document.createElement('img');
      localforage.getItem(nameUrl).then((value) => {
        sessionBtnName = (JSON.parse(value))[1];
        // console.log(sessionBtnName);
        
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
  if (event.which === 3) {
    divTest = String(event.target.className); 
    obj = event.target;
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



// So how the localforage order works right now isnt based on when the item is added to the
// database, instead it is based on the alphabetical/numerical order of the key. Also, the order
// does not follow a 10 digit numerical order, instead, i believe it follow a binary numerical
// order. So, 11 would come before 2 due to 1 coming before 2. I was thinking at first to convert
// the pagekeynum to a binary digit and have a binary digit appended to each page key name. This
// might not work after sessions are implemented because sessionkeynum has a different alphabetical
// and numerical order. All of the page would always appear before the sessions since "p" comes
// before "s". So the complicated fix would be to make both sessions and pages follow the same
// naming scheme and only have one incrementing value that increments for both sessions and pages
// as one. The better fix i think would be to have a loop that runs through each key name and
// uses comparison operators to evaluate which value came first. However, the issue still arises
// that sessions follow their own numeric naming scheme. So maybe we would still have to only have
// a single incrementing key that increments for both sessions and pages as one. This key would
// have to be outside of the loop though, and would have to determine which button to first create
// so i would have to change the createbutton function significantly. but i think it would still be
// more efficient and easier to change than changing the naming scheme completely.



// The only bug i see is that chrome.tabs.query() will get the tabs of the last focused window,
// so if the last focused window is another chrome window or chrome inspect page, and you press
// one of the save buttons without refocusing on the previous window, then chrome.tabs will
// retrieve the url of the previously focused window and not the window that opened the
// extension



