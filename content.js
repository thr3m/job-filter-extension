let observer;
let isEnabled = false;
const originalDisplays = new WeakMap();

function removeJobs() {
  console.log('removeJobs.>');

  const companyName = "bairesdev";
  const searchTerm = companyName.toLowerCase();
  const selectors = [
    'article',
    'div.result-item',
    'div[data-view-name="job-card"]'
  ].join(', ');

  document.querySelectorAll(selectors).forEach(element => {
    console.log('element.>', element);
    const treeWalker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          return node.textContent.toLowerCase().includes(searchTerm) ?
            NodeFilter.FILTER_ACCEPT :
            NodeFilter.FILTER_REJECT;
        }
      }
    );

    if (treeWalker.nextNode()) {
      console.log("isEnabled.", isEnabled)
      if (isEnabled) {
        // Hide elements when enabled
        if (!originalDisplays.has(element)) {
          originalDisplays.set(element, element.style.display);
        }
        element.setAttribute('style', 'display: none !important;');
      } else {
        // Restore original display when disabled
        element.style.display = originalDisplays.get(element) || '';
      }
      console.log(" element.style.", element.style)

    }
  });
}

function initObserver(enable) {
  isEnabled = enable;
  if (enable) {
    if (!observer) {
      observer = new MutationObserver(removeJobs);
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    removeJobs();
  } else {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    removeJobs();
  }
}

// State management
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    initObserver(changes.enabled.newValue);
  }
});

// Initial state check
chrome.storage.local.get('enabled', (data) => {
  const enabled = data.enabled !== undefined ? data.enabled : false;
  initObserver(enabled);
});

console.log('[Extension] Content script loaded');