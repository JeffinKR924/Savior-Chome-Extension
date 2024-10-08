# Savior-Chome-Extension

Savior - Effortlessly 'save your' favorite pages or entire sessions and instantly open them with a single click, speeding up your browsing


Savior is a Chrome extension that allows users to save individual pages or multiple pages (sessions) as buttons on the interface. With Savior, you can conveniently open the saved page or session instantly by pressing the corresponding button on the interface.

## Table of Contents
* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)
* [About the Creator](#-about-the-creator)
* [Links](#-links)

## Features
* Save individual pages as buttons on the interface.
* Save multiple pages (sessions) as buttons on the interface.
* Instantly open saved pages or sessions by clicking the corresponding buttons.
* Rename or delete saved pages and sessions using the context menu.
* Clear all saved pages and sessions with a single click.

## Installation
1. Visit the Savior Chrome Extension page on the Chrome Web Store.
2. Click the "Add to Chrome" button.
3. Confirm the installation by clicking "Add extension" in the pop-up window.
4. After installation, the Savior icon will appear in your Chrome toolbar.
5. To pin the extension for easy access, click the puzzle piece icon in the Chrome toolbar, find the Savior extension, and click the pin icon next to it. The Savior icon will now remain visible in your toolbar.

## Usage
* Open the Savior extension by clicking the icon in your Chrome toolbar.
* To save a single page, click the "Save Page" button. This will create a button for the current page in the Savior interface.
* To save multiple pages as a session, click the "Save Session" button. This will create a button for the entire session in the Savior interface.
* Alternatively, you can save a page by right-clicking on any webpage, navigating to the Savior menu, and selecting "Save Page". The saved page will be available in the Savior interface when you open the extension.
* To open a saved page or session, simply click the corresponding button on the interface.
* To delete an individual saved page, open the Savior interface, right-click the button you want to delete, navigate to the Savior menu, and choose "Delete". The extension will close, and when you reopen it, the button should no longer be present.
* To rename a saved page or session, right-click the corresponding button in the Savior interface, choose "Rename" from the Savior menu, enter a new name, and press Enter.

## API and Libraries
### Chrome.storage API
**Can access API from: Chrome Developers**
```
chrome.storage.local.set({key: value});
chrome.storage.local.get([key], function(result));
chrome.storage.local.remove([key], function());
chrome.storage.local.clear();
```
#### Chrome Storage API

| Method       | Parameters  | Description                                                                                                       |
| :----------- | :----------- | :---------------------------------------------------------------------------------------------------------------- |
| `chrome.storage.local.get()` | `key`, `callback: function` | Gets one or more items from storage.|
| `chrome.storage.local.set()` | `key: value`, `callback: function` | Sets one or more items to storage.|
| `chrome.storage.local.remove()` | `key`, `callback: function` | Removes one or more items from storage.|
| `chrome.storage.local.clear()` | `callback: function` | Removes all items from storage.|

### LocalForage Library
**Can access Library from: LocalForage**
```
localforage.setItem(key, value);
localforage.getItem(key, function(err, value));
localforage.removeItem(key, function(err));
localforage.clear();
```
#### LocalForage Library

| Method         | Parameters                                      | Description                                           |
| -------------- | ----------------------------------------------- | ----------------------------------------------------- |
| `localforage.setItem()` | `key: string`, `callback: function` | Set the value for the given key |
| `localforage.getItem()` | `key: string`, `callback: function` | Get the value for the given key |
| `localforage.removeItem()` | `key: string`, `callback: function` | Remove the item for the given key |
| `localforage.clear()` | `callback: function` | Clear the entire storage |

## Notes
* Button name is limited to 41 characters. Anything more will be cut off.
* Not all domains will be removed in the button name

## 🚀 About the Creator
My name is Jeffin Rajan and I am a Computer Science major at Drexel University. **This program was created and submitted for the Drexel University Freshman Design Project 2021**


## 🔗 Links
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](http://www.github.com/JeffinKR924)
[![Stack Overflow](https://img.shields.io/badge/-Stackoverflow-FE7A16?style=for-the-badge&logo=stack-overflow&logoColor=white)](https://www.stackoverflow.com/users/19504427/jeffin-rajan)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jeffin-k-rajan/)
[![Discord](https://img.shields.io/badge/discord-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discordapp.com/users/750429356739788933/)