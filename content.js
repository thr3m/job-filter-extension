// Define a variable to hold the MutationObserver instance
let observer;
// Define a variable to track whether the extension is enabled or not
let isEnabled = false;
// Use a WeakMap to store the original display styles of elements
const originalDisplays = new WeakMap();

/**
 * Function to remove job postings based on a specific company name.
 */
function removeJobs() {
  console.log('removeJobs.>');

  // Define the company name to search for (case-insensitive)
  const companyName = "bairesdev";
  // Convert the company name to lowercase for case-insensitive matching
  const searchTerm = companyName.toLowerCase();
  // Define CSS selectors to target job posting elements
  const selectors = [
    'article',
    'div.result-item',
    'div[data-view-name="job-card"]'
  ].join(', ');

  // Select all elements that match the defined selectors
  document.querySelectorAll(selectors).forEach(element => {
    console.log('element.>', element);
    // Create a TreeWalker to traverse the element's text nodes
    const treeWalker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        // Define a filter to accept only text nodes that contain the search term
        acceptNode(node) {
          return node.textContent.toLowerCase().includes(searchTerm) ?
            NodeFilter.FILTER_ACCEPT :
            NodeFilter.FILTER_REJECT;
        }
      }
    );

    // Check if the TreeWalker finds a matching text node
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

/**
 * Function to initialize the MutationObserver.
 * @param {boolean} enable - Whether to enable or disable the observer.
 */
function initObserver(enable) {
  isEnabled = enable;
  if (enable) {
    // If enabling, create and start the observer if it doesn't exist
    if (!observer) {
      observer = new MutationObserver(removeJobs);
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    removeJobs();
  } else {
    // If disabling, disconnect and clear the observer if it exists
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    removeJobs();
  }
}

// Listen for changes in the Chrome storage
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    // When the 'enabled' value changes, initialize the observer with the new value
    initObserver(changes.enabled.newValue);
  }
});

// Get the initial state from Chrome storage
chrome.storage.local.get('enabled', (data) => {
  const enabled = data.enabled !== undefined ? data.enabled : false;
  initObserver(enabled);
});

console.log('[Extension] Content script loaded');