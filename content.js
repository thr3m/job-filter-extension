// Define a variable to hold the MutationObserver instance
let observer;
// Define a variable to track whether the extension is enabled or not
let isEnabled = false;
// Use a WeakMap to store the original display styles of elements
const originalDisplays = new WeakMap();

let loadedTags = [];
let oldTags = [];

const createTreeWalker = (element, searchValue = []) => {
  return document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      // Define a filter to accept only text nodes that contain the search term
      acceptNode(node) {
        // Assuming 'searchTerms' is an array of strings like ['term1', 'term2', 'term3']
        const nodeText = node.textContent.toLowerCase();
        const matchFound = searchValue.some(term => nodeText.includes(term.toLowerCase()));

        return matchFound ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    }
  );
}


/**
 * Function to remove job postings based on a specific company name.
 */
function removeJobs() {
  console.log('removeJobs');

  // Define the company name to search for (case-insensitive)
  const searchTerms = loadedTags
  console.log("searchTerms>", searchTerms);
  // Define CSS selectors to target job posting elements
  const selectors = [
    'article',
    'div.result-item',
    'div[data-view-name="job-card"]',
    '#mosaic-provider-jobcards > ul > li',
    '.scaffold-layout__list-item'//linkedin
  ].join(', ');

  // Select all elements that match the defined selectors
  document.querySelectorAll(selectors).forEach(element => {
    // console.log('element.>', element);
    // Create a TreeWalker to traverse the element's text nodes
    const treeWalker = createTreeWalker(element, searchTerms);
    const treeWalkerOldTags = createTreeWalker(element, oldTags);

    // Check if the TreeWalker finds a matching text node
    if (treeWalker.nextNode()) {
      console.log("isEnabled.", isEnabled)
      if (isEnabled) {
        // Hide elements when enabled
        if (!originalDisplays.has(element)) {
          originalDisplays.set(element, element.style.display);
          console.log("element.// to hide",element);
        }
        element.setAttribute('style', 'display: none !important;');
      } else {
        // Restore original display when disabled
        element.style.display = originalDisplays.get(element) || '';
      }
      // console.log(" element.style.", element.style)

    }

    if (treeWalkerOldTags.nextNode()) {
      console.log("loadedTags treeWalkerOldTags.", loadedTags)
      if (isEnabled) {
        // Restore original display when disabled
        element.style.display = originalDisplays.get(element) || '';
      }
    }


  });
}

/**
 * Function to initialize the MutationObserver.
 * @param {boolean} enable - Whether to enable or disable the observer.
 */
function initObserver(enable, newTags) {
  isEnabled = enable
  loadedTags = newTags
  console.log("isEnabled from init obv", isEnabled);
  console.log("newTags from init obv", newTags);
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
  console.log('changes.tagsSelected>>', changes)

  if (changes.enabled || changes.tagsSelected) {

    // When the 'enabled' value changes, initialize the observer with the new value
    newTags = changes.tagsSelected !== undefined ? changes.tagsSelected.newValue : loadedTags;
    console.log("newTags>>>", newTags)
    console.log(" loadedTags>>>", loadedTags)

    oldTags = loadedTags.filter(tag => !newTags.includes(tag));
    enable = changes.enabled?.newValue === undefined ? isEnabled : changes.enabled?.newValue

    initObserver(enable, newTags);
  }
});

// Get the initial state from Chrome storage
chrome.storage.local.get({ enabled: false, tagsSelected: [] }, (data) => {
  const enabled = data.enabled !== undefined ? data.enabled : false;
  const tagsSelected = data.tagsSelected !== undefined ? data.tagsSelected : [];

  initObserver(enabled, tagsSelected);
  loadedTags = data.tagsSelected;
});


console.log('[Extension] Content script loaded');