let save = document.getElementById("save");
let saveSession = document.getElementById("saveSession");
let clearAll = document.getElementById("clearAll");
var myDiv = document.getElementById("dynamicBtnDiv");

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
    pageRenameFlag = 1;
    pageBtn.addEventListener('mousedown', (ev) => {
      if (ev.which === 3) {
        objectName = ev.currentTarget.name;
        console.log(objectName);
      }
    });
    // pageBtn.addEventListener("mouseover", function( event ) {
    //   hoverPageName = event.currentTarget.name;
      // console.log(event.currentTarget);
      // event.target.name, event.currentTarget.name, this.name?
      // hoverPageName = event.currentTarget.name;
      // How is this bottom code being called when i am not on a button?
      // The only explanation is that it attaches to a button and doesnt call The
      // top parent, just the bottom parent. so maybe if i add another check in
      // the bottom part then that might work
    // });
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
    sessionRenameFlag = 1;
    sessionBtn.addEventListener('mousedown', (ev) => {
      if (ev.which === 3) {
        objectName = ev.currentTarget;
        console.log(objectName);
      }
    });
    // chrome.contextMenus.onClicked.addListener((info, tab) => {
    //   chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    //     if (info.menuItemId === "deleteSession") {
    //       window.localStorage.removeItem(this.name);
    //       window.open('', '_blank').close();
    //     }
    //     else if (info.menuItemId === "rename" && sessionRenameFlag == 1) {
    //       oldName = (JSON.parse(window.localStorage.getItem(hoverSessionName)));
    //       let newSessionName = prompt("Enter a new name:", String(oldName[1]));
    //       oldName[1] = newSessionName;
    //       window.localStorage.setItem(String(hoverSessionName), JSON.stringify(oldName));
    //       sessionRenameFlag+=1;
    //       window.close();
    //     }
    //   });
    // })
    myDiv.appendChild(sessionBtn);
  }
}

// The hover portion of this code saves this buttons name into session storage
// If I have the button name, then maybe i can use that to identify which button
// it is, and then change the innerhtml of that button?

save.onclick = function (element) {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    valueArray = [];
    urlArray = [];
    url = tabs[0].url;
    urlArray.push(url);
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
    window.localStorage.setItem(String(url), JSON.stringify(valueArray));
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
    valueArray = [];
    urlArray = [];
    for (i = 0; i<tabs.length; i++){
      url = tabs[i].url;
      urlArray.push(url);
    }
    valueArray.push(urlArray);
    localStorageLength = (localStorage.length)+1;
    valueArray.push("Session " + String(localStorageLength));
    var arrayName = ("SESSION924"+urlArray.toString());
    window.localStorage.setItem(String(arrayName), JSON.stringify(valueArray));
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

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    if (info.menuItemId === "deletePage") {
      window.localStorage.removeItem(objectName);
      window.open('', '_blank').close();
    }
    else if (info.menuItemId === "deleteSession") {
      window.localStorage.removeItem(objectName);
      window.open('', '_blank').close();
    }
    else if (info.menuItemId === "rename" && pageRenameFlag == 1) {
      oldName = (JSON.parse(window.localStorage.getItem(hoverPageName)));
      let newPageName = prompt("Enter a new name:", String(oldName[1]));
      oldName[1] = newPageName;
      window.localStorage.setItem(String(hoverPageName), JSON.stringify(oldName));
      pageRenameFlag+=1;
      window.close();
    }
    else if (info.menuItemId === "rename" && sessionRenameFlag == 1) {
      oldName = (JSON.parse(window.localStorage.getItem(hoverSessionName)));
      let newSessionName = prompt("Enter a new name:", String(oldName[1]));
      oldName[1] = newSessionName;
      window.localStorage.setItem(String(hoverSessionName), JSON.stringify(oldName));
      sessionRenameFlag+=1;
      window.close();
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
// window.addEventListener('mousedown', (event) => {
//   if (event.which === 3) {
//     divTest = event.target;
//     console.log(divTest);
//   }
// });

// Renaming Works. Everything is renamed correctly.

// Deleting one specific button deletes a bunch of them. Thats a problem. but
// the remaning buttons seem to be correct and dont have any issues to them. They are ordered
// correctly.

// this.name seems to be working with rename functionality really well. I have not seen
// any issues with that portion yet. this.name, currentTarget, and current have issues
// with the delete page functionality. Have to find a reliable fix for that. Also, gotta
// find a fix for that weird delay that causes you to hover over another button after
// deleting page. Possible solution for this could be that it saves the last hovered button
// name constantly and then uses other if statements to prevent deletion when you stop hovering
// and press the delete button? Also, the session names face a serious bug rn with the naming
// scheme. They can overlap if one button is deleted, since they are based on current length.
// Can fix this issue by having a num for session that constantly goes up despite the length,
// like a counter.

// The deletion works now. But now the issue is that if you right click on the button and
// then right click on anywhere that is not a dynamic button and press delete, it deletes
// the last right clicked button. I am thinking that if I add another window event listener
// that generally checks to make sure that you arent right clicking the window or the save
// utility buttons, then that could work maybe.