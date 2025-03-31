// Toggle state management
document.getElementById('btn-toggle').addEventListener('change', (e) => {
  chrome.storage.local.set({ enabled: e.target.checked });
  console.log("e.target.checked>>",e.target.checked);
});

// Initialize toggle state
chrome.storage.local.get('enabled', (data) => {
  document.getElementById('btn-toggle').checked = !!data.enabled;
});