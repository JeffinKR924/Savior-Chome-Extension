let save = document.getElementById("save");
let saveSession = document.getElementById("saveSession");
let clearAll = document.getElementById("clearAll");
var myDiv = document.getElementById("dynamicBtnDiv");
// from eventPage import chrome.contextMenus.onClicked.addListener()

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
    pageBtn.innerHTML = (pastName);
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
      newUrl = window.localStorage.getItem(this.name);
      chrome.tabs.create({
        url: newUrl
      });
    }
    pageBtn.addEventListener("mouseover", function( event ) {
      sessionStorage.setItem('pageFlag', ['up', this.name]);
      var pageFlagList = (sessionStorage.getItem('pageFlag').split(','));
      console.log(pageFlagList);
    });
    pageBtn.addEventListener("mouseout",function() {
      sessionStorage.setItem('pageFlag', ['down', null]);
    });
    myDiv.appendChild(pageBtn);
  }
  else {
    sessionBtn = document.createElement("button");
    sessionBtn.className = 'dynamicButton';
    nameNum+=1;
    sessionBtn.innerHTML = 'Session ' + String(nameNum);
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
    // newIcon.class = '\f07b';
    // sessionBtn.appendChild(newIcon);
    sessionBtn.name = nameUrl;
    sessionBtn.id = String(nameNum);
    sessionBtn.onclick = function() {
      session = JSON.parse(window.localStorage.getItem(this.name));
      for (var z = 0; z < session.length; z++) {
        chrome.tabs.create({
          url: session[z]
        });
      }
    }
    sessionBtn.addEventListener("mouseover", function( event ) {
      sessionStorage.setItem('sessionFlag', ['up', this.name]);
    });
    sessionBtn.addEventListener("mouseout",function() {
      sessionStorage.setItem('sessionFlag', ['down', null]);
    });
    myDiv.appendChild(sessionBtn);
  }
}

save.onclick = function (element) {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    url = tabs[0].url;
    favIconURL = "chrome://favicon/size/23@1x/" + url;
    var favIconImage = document.createElement('img');
    favIconImage.src = favIconURL;
    favIconImage.className = 'favIcon';
    var faIconFile = document.createElement("h5");
    faIconFile.innerHTML = '<i class="fa-solid fa-file"></i>';
    faIconFile.className = 'faIconFiles';
    currentUrl = url;
    currentName = btnNamer(currentUrl);
    window.localStorage.setItem(String(url), url);
    btn = document.createElement("BUTTON");
    btn.className = 'dynamicButton';
    btn.innerHTML = (currentName);
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
    urlArray = [];
    for (i = 0; i<tabs.length; i++){
      url = tabs[i].url;
      urlArray.push(url);
    }
    var arrayName = ("SESSION924"+urlArray.toString());
    window.localStorage.setItem(String(arrayName), JSON.stringify(urlArray));
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
}); 
}

clearAll.onclick = function (element) {
  var result = confirm("Are you sure you want to delete all saved pages and sessions?");
  if (result) {
    window.localStorage.clear();
    window.open('', '_blank').close();
  }
}


// function getHoveredImage() {
//   var hoveredElements = $(':hover'),
//       // the last element is the event source
//       hoveredElement  = hoveredElements.last();

//   if (hoveredElement.prop("tagName") === 'button') {
//     return hoveredElement;
//   }
// }
// test