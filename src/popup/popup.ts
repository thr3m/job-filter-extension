import '../styles/main.css';
import { StorageService, ExtensionSettings } from '../utils/storage';

document.addEventListener('DOMContentLoaded', async () => {
  const tagContainer = document.getElementById('tag-container') as HTMLDivElement;
  const tagInput = document.getElementById('tag-input') as HTMLInputElement;
  const btnToggle = document.getElementById('btn-toggle') as HTMLInputElement;

  let settings: ExtensionSettings = await StorageService.getSettings();

  // Initial State
  btnToggle.checked = settings.enabled;
  renderTags();

  // --- Functions ---

  function renderTags() {
    // Remove existing chips
    tagContainer.querySelectorAll('.chip').forEach(chip => chip.remove());

    // Add chips for each tag
    settings.tagsSelected.forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.innerHTML = `
        ${tag}
        <button type="button" class="chip-remove" data-tag="${tag}">&times;</button>
      `;
      tagContainer.insertBefore(chip, tagInput);
    });
  }

  async function saveSettings() {
    await StorageService.setSettings(settings);
  }

  function addTag(value: string) {
    const tag = value.trim();
    if (tag && !settings.tagsSelected.includes(tag)) {
      settings.tagsSelected.push(tag);
      renderTags();
      saveSettings();
    }
    tagInput.value = '';
  }

  function removeTag(tagToRemove: string) {
    settings.tagsSelected = settings.tagsSelected.filter(t => t !== tagToRemove);
    renderTags();
    saveSettings();
  }

  // --- Event Listeners ---

  tagInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput.value);
    } else if (e.key === 'Backspace' && tagInput.value === '' && settings.tagsSelected.length > 0) {
      removeTag(settings.tagsSelected[settings.tagsSelected.length - 1]);
    }
  });

  // Event Delegation for removing chips
  tagContainer.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('chip-remove')) {
      const tag = target.getAttribute('data-tag');
      if (tag) removeTag(tag);
    } else if (target === tagContainer) {
      tagInput.focus();
    }
  });

  btnToggle.addEventListener('change', (e) => {
    settings.enabled = (e.target as HTMLInputElement).checked;
    saveSettings();
  });
});
