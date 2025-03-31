// File: background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/updated');
  // Set default state on install/update
  chrome.storage.sync.set({ 'extensionEnabled': true });
});

// REMOVE or COMMENT OUT this entire listener:
/*
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // ... removed ...
});
*/

// Optional: Keep this if you need background to listen for other messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background.js:", message);
  // If background doesn't need to do anything with popup messages,
  // this listener might be unnecessary.
  sendResponse({ success: true });
  return true; // Indicates you might send a response asynchronously
});