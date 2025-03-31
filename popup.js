// Toggle state management
document.getElementById('btn-toggle').addEventListener('change', (e) => {
  // Set the 'enabled' value in Chrome storage to the checked state of the toggle button
  chrome.storage.local.set({ enabled: e.target.checked });
  console.log("e.target.checked>>",e.target.checked);
});

// Initialize toggle state
chrome.storage.local.get('enabled', (data) => {
  // Set the checked state of the toggle button based on the 'enabled' value in Chrome storage
  document.getElementById('btn-toggle').checked = !!data.enabled;
});