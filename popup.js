// Imports html buttons
let savePage = document.getElementById("savePage");
let saveSession = document.getElementById("saveSession");
let clearAll = document.getElementById("clearAll");
var myDiv = document.getElementById("dynamicBtnDiv");


// Adds saved pages from tempData in chromeStorage to main storage 
async function contextMenuSaves() {
  const value = await new Promise(resolve => {
    chrome.storage.local.get(['tempData'], function(value) {
      resolve(value);
    });
  });
  
  // Adds the data to main storage
  if (value.tempData) {
    for (let i = ((value.tempData.length)-1); i >= 0; i--) {
      btnValue = [];
      urlData = [];
      urlData.push(value.tempData[i]);
      btnValue.push(urlData);
      btnName = btnNameGenerator(value.tempData[i]);
      btnValue.push(btnName);

      const redun = await redundancyChecker(urlData);
      if (redun == false) {
        const key = await btnKeyGenerator();
        await localforage.setItem(key, JSON.stringify(btnValue));
      }
    }

    // Resets chrome storage after adding to main
    chrome.storage.local.remove('tempData');
  }

  createButtons();
}

contextMenuSaves();

// Increments buttons key in storage and creates newkey for each button
async function btnKeyGenerator() {
  let keyNum;
  let newKey;
  newKey = await localforage.getItem('btnKeyNum').then((value) => {
    keyNum = value;
    if (keyNum == null) {
      keyNum = 1;
      localforage.setItem('btnKeyNum', keyNum);
    }
    else {
      keyNum = parseInt(keyNum) + 1;
      localforage.setItem('btnKeyNum', keyNum);
    }

    newKey = ('BTN924:N' + String(keyNum));
    return Promise.resolve(newKey);
  });

  return newKey;
}

// Checks if new button already exists
async function redundancyChecker(urlData) {
  let storageLength = await localforage.length();
  if (storageLength !== 0) {
    for (let i = 0; i < storageLength; i++) {
      let key = await localforage.key(i);
      let storageVal = JSON.parse((await localforage.getItem(key)))[0];
      if (JSON.stringify(storageVal) === JSON.stringify(urlData)) {
        return true;
      }
    }
  }

  return false;
}

// Trims the length of the button name
function nameTrimmer(btnName) {
  if (btnName.length>43){
    btnName = btnName.slice(0, 41)+"...";
  }

  return btnName;
}

// Generates new button name from url
function btnNameGenerator(btnName) {
  btnName = new URL(btnName);
  btnName = btnName.hostname;
  btnName = btnName.toString();
  // Removes all subdomains and domains
  domain = ["www.", "www4.", "www3.", ".com", ".net", ".org", ".co", ".us", ".gov", ".edu"];
  for (var i =0; i < domain.length; i++){
    btnName = btnName.replaceAll(domain[i], "");
  }
  btnDomainName = btnName.charAt(0).toUpperCase()+btnName.slice(1);

  // Capitalizes the first letter after a dot(if exists)
  checkDot = btnDomainName.includes(".");
  if (checkDot==true) {
    checkDotIndex = btnDomainName.indexOf(".");
    btnDomainName = btnDomainName.slice(0, checkDotIndex+1)+btnDomainName.charAt(checkDotIndex+1).toUpperCase()+btnDomainName.slice(checkDotIndex+2);
  }

  btnDomainName = btnDomainName.trim();
  newName = nameTrimmer(btnDomainName);

  return newName;
}

// Generates buttons when popup is opened
btnReorderList = [];
async function createButtons() {
  // Reorders buttons from storage 
  let storageLength = await localforage.length();
  for (var i = 0; i < storageLength; i++){
    let btnKey = await localforage.key(i);
    if (btnKey.startsWith("BTN924")) {
      btnNum = parseInt(btnKey.replace("BTN924:N", ""));
      btnReorderList.push(btnNum);
    }
  }

  btnReorderList.sort(function(btnNum1, btnNum2) {
    return btnNum1 - btnNum2;
  });
  
  // Determines if button is page or session, and then creates button with appropriate info
  for (orderNum in btnReorderList) {
    btnKey = 'BTN924:N' + String(btnReorderList[orderNum]);
    let btnVal = await localforage.getItem(btnKey);
    btnVal = JSON.parse(btnVal);
    btnLength = (btnVal[0].length)
    if (btnLength == 1) {
      pageBtn = document.createElement("button");
      pageBtn.className = 'dynamicButton';
      pageBtn.innerHTML = (((btnVal)))[1];

      // Favicon/URl icon
      var faviconImage = document.createElement('img');
      btnUrl = ((((btnVal))[0])[0]);
      faviconImage.src = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(btnUrl)}&size=23`;
      faviconImage.className = 'favicon';

      // FaIcon/File icon
      var faIconPage = document.createElement("h5");
      faIconPage.innerHTML = '<i class="fa-solid fa-file"></i>';
      faIconPage.className = 'faIconPage';

      pageBtn.appendChild(faviconImage);
      pageBtn.appendChild(faIconPage);
      pageBtn.name = btnKey;

      // Adds functionality for opening page
      pageBtn.onclick = function() {
        chrome.tabs.create({
          url: btnUrl
        });
      }

      myDiv.appendChild(pageBtn);
    }
    else {
      sessionBtn = document.createElement("button");
      sessionBtn.className = 'dynamicButton';
      sessionBtn.innerHTML = ((btnVal))[1];

      // Favicon/URl icon
      var faviconImage = document.createElement('img');
      btnUrls = ((((btnVal))[0])[0]);
      faviconImage.src = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(btnUrls)}&size=23`;
      faviconImage.className = 'favicon';

      // FaIcon/Folder icon
      var faIconFolder = document.createElement("h5");
      faIconFolder.innerHTML = '<i class="fa fa-folder"></i>';
      faIconFolder.className = 'faIconFolder';
      sessionBtn.name = btnKey;

      sessionBtn.appendChild(faviconImage);
      sessionBtn.appendChild(faIconFolder);

      // Adds functionality for opening session
      sessionBtn.onclick = function() {
        session = ((btnVal))[0];
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

// When Save Page button is pressed, active page from current window is saved as a button
savePage.onclick = function () {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    // Creates url list inside of a button value list
    btnValue = [];
    urlData = [];
    url = tabs[0].url;
    urlData.push(url);
    btnValue.push(urlData);

    // Generates icons and name
    var faviconImage = document.createElement('img');
    faviconImage.src = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=23`;
    faviconImage.className = 'favicon';

    var faIconPage = document.createElement("h5");
    faIconPage.innerHTML = '<i class="fa-solid fa-file"></i>';
    faIconPage.className = 'faIconPage';

    btnName = btnNameGenerator(url);
    btnValue.push(btnName);

    pageBtn = document.createElement("BUTTON");

    // Checks id button already exists, if not, then saves button to storage
    redundancyChecker(urlData).then(redun => {
      if (redun == false) {
        async function callingFunction() {
          const key = await btnKeyGenerator();
          pageBtn.name = key;
          localforage.setItem(key, JSON.stringify(btnValue));
        }
        
        callingFunction();
      }
    }); 

    pageBtn.className = 'dynamicButton';
    pageBtn.innerHTML = (btnName);

    pageBtn.appendChild(faviconImage);
    pageBtn.appendChild(faIconPage);

    // Adds functionality for opening page
    pageBtn.onclick = function() {
      chrome.tabs.create({
        url: url
      });
    }

    myDiv.appendChild(pageBtn);
  });
}

// When Save Session Button is pressed, all pages from current window are saved as a button
saveSession.onclick = function () {
  chrome.tabs.query({currentWindow: true}, tabs => {
    // If only a single page, then triggers save page functionality
    if (tabs.length==1){
      savePage.onclick();
    }
    else {
      // Creates url list inside of a button value list
      btnValue = [];
      urlData = [];
      for (i = 0; i<tabs.length; i++){
        url = tabs[i].url;
        urlData.push(url);
      }
      btnValue.push(urlData);

      // Generates icons and name
      firstUrl = (urlData[0]);
      var faviconImage = document.createElement('img');
      faviconImage.src = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(firstUrl)}&size=23`;
      faviconImage.className = 'favicon';

      var faIconFolder = document.createElement("h5");
      faIconFolder.innerHTML = '<i class="fa fa-folder"></i>';
      faIconFolder.className = 'faIconFolder';

      sessionBtn = document.createElement("BUTTON");

      // Checks id button already exists, if not, then saves session to storage
      redundancyChecker(urlData).then(redun => {
        if (redun == false) {
          async function callingFunction() {
            const key = await btnKeyGenerator();
            sessionBtn.name = key;
            btnNum = key.replace('BTN924:N', '');
            btnValue.push("Session " + btnNum);
            localforage.setItem(key, JSON.stringify(btnValue));
          }
          
          callingFunction();
        }
      });

      sessionBtn.className = 'dynamicButton';
      sessionBtn.innerHTML = ("New Session");

      sessionBtn.appendChild(faviconImage);
      sessionBtn.appendChild(faIconFolder);

      // Adds functionality for opening session
      sessionBtn.onclick = function() {
        for (var a = 0; a < urlData.length; a++) {
          chrome.tabs.create({
            url: urlData[a]
          });
        }
      }

      myDiv.appendChild(sessionBtn);
    }
  }); 
}

// Creates functionality for context menu
chrome.contextMenus.onClicked.addListener((info) => {
  // Deletes button from storage
  if (info.menuItemId === "delete") {
    if (objectName != null && objectName != '') {
      localforage.removeItem(objectName);
      window.open('', '_blank').close();
    }
  }
  // Renames button in storage
  else if (info.menuItemId === "rename") {
    if (objectName != null && objectName != '') {
      btnValue = null;
      localforage.getItem(objectName).then((value) => {
        btnValue = JSON.parse(value);
        let newName = prompt("Enter a new name:", String(btnValue[1]));
        newName = nameTrimmer(newName);
        btnValue[1] = newName;
        localforage.setItem(String(objectName), JSON.stringify(btnValue));
        
        window.close();
    });
    }
  }
});

// When Clear All button is clicked, clears storage and closes window
clearAll.onclick = function (element) {
  var clearConfirmation = confirm("Are you sure you want to delete all saved pages and sessions?");
  if (clearConfirmation) {
    localforage.clear();
    window.open('', '_blank').close();
  }
};

// Determines object being right clicked
window.addEventListener('mousedown', (event) => {
  if (event.which === 3) {
    objClassName = String(event.target.className); 
    object = event.target;
    // If object is an icon, the parent object appended to is obtained
    if (objClassName == 'fa-solid fa-file' || objClassName == 'favicon' || objClassName == 'fa fa-folder') {
      while(objClassName != 'dynamicButton'){
        object = object.parentElement;
        objClassName = String(object.className);
      }
      objectName = object.name;
    }
    else if (objClassName == 'dynamicButton') {
      objectName = object.name;
    }
    else {
      objectName = null;
    }
  }
});

// Change icon file names, create folder for it and link everywhere
// Give all code to chatgpt and have it generate ReadMe
// Add clear all for chrome storage too


