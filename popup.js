document.addEventListener('DOMContentLoaded', () => {
  const tagContainer = document.getElementById('tag-container');
  const tagInput = document.getElementById('tag-input');
  const hiddenInput = document.getElementById('tags-hidden-input');
  let tags = []; // Array to store the tags

  // Function to update the hidden input value
  function updateHiddenInput() {
    hiddenInput.value = tags.join(','); // Store as comma-separated string
  }

  const saveTagsInStorage = (tags = []) => {
    chrome.storage.local.set({ "tagsSelected": tags },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Error saving tags:", chrome.runtime.lastError.message);
        }
      });
    console.log("saving tags:", tags);

  }

  const loadTags = (callback) => {
    // Initialize toggle state
    chrome.storage.local.get('tagsSelected', (data) => {
      // Set the checked state of the toggle button based on the 'enabled' value in Chrome storage
      const loadedTags = data.tagsSelected || []
      console.log("data tags:", loadedTags);
      callback(loadedTags)
    });
  }

  // Function to render tags
  function renderTags() {
    // Clear existing tag elements except the input
    tagContainer.querySelectorAll('.chip').forEach(chip => chip.remove());
    console.log("tags from renderTags", tags);
    // Add chips for each tag
    tags.slice().forEach(tag => { // Render in reverse to add near input
      const chip = document.createElement('span');
      chip.className = 'chip bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 flex items-center gap-1 whitespace-nowrap';
      chip.textContent = tag;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button'; // Prevent form submission
      removeBtn.className = 'text-gray-500 hover:text-gray-700 focus:outline-none';
      removeBtn.innerHTML = '&times;'; // 'x' symbol
      removeBtn.ariaLabel = `Remove ${tag}`;
      removeBtn.onclick = () => removeTag(tag);

      chip.appendChild(removeBtn);
      // Insert the chip before the input field
      tagContainer.insertBefore(chip, tagInput);
    });

    updateHiddenInput();

    saveTagsInStorage(tags);
  }

  // Function to add a tag
  function addTag(tag) {
    const trimmedTag = tag.trim();
    // Only add tag if it's not empty and not already present
    if (trimmedTag && !tags.includes(trimmedTag)) {
      tags.push(trimmedTag);
      renderTags(); // Re-render the tags
    }
    tagInput.value = ''; // Clear the input
  }

  // Function to remove a tag
  function removeTag(tagToRemove) {
    tags = tags.filter(tag => tag !== tagToRemove);
    renderTags(); // Re-render the tags
    tagInput.focus(); // Keep focus in the input area
  }

  // Event Listener for input field
  tagInput.addEventListener('keydown', (event) => {
    console.log('event.key>>',event.key);
    if (event.key === 'Enter') { // Space key
      event.preventDefault(); // Prevent typing a space
      addTag(tagInput.value);
    } else if (event.key === 'Backspace' && tagInput.value === '' && tags.length > 0) {
      // Optional: Remove last tag on backspace if input is empty
      removeTag(tags[tags.length - 1]);
    }
  });

  // Optional: Add tag if input loses focus and has content
  tagInput.addEventListener('blur', () => {
    addTag(tagInput.value);
  });

  // Initial render in case you want to start with predefined tags
  // tags = ['InitialTag1', 'InitialTag2']; // Example initial tags
  loadTags((loadedTags) => {
    tags = loadedTags
    renderTags();
  })
});




// Toggle state management
document.getElementById('btn-toggle').addEventListener('change', (e) => {
  // Set the 'enabled' value in Chrome storage to the checked state of the toggle button
  chrome.storage.local.set({ enabled: e.target.checked });
  console.log("e.target.checked>>", e.target.checked);
});

// Initialize toggle state
chrome.storage.local.get('enabled', (data) => {
  // Set the checked state of the toggle button based on the 'enabled' value in Chrome storage
  document.getElementById('btn-toggle').checked = !!data.enabled;
});