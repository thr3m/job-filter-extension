import { StorageService, ExtensionSettings } from '../utils/storage';
import { Matcher } from './matcher';
import { Scanner } from './scanner';

let settings: ExtensionSettings = { enabled: false, tagsSelected: [] };
const originalDisplays = new WeakMap<HTMLElement, string>();

/**
 * Hides or shows job cards based on current settings and tags.
 * @param elements Optional list of elements to process. If not provided, scans the whole document.
 */
function processJobCards(elements?: HTMLElement[]) {
  const cards = elements || Scanner.findJobCards();
  
  cards.forEach(card => {
    // Only process if it's actually a job card
    if (!elements || Scanner.isJobCard(card)) {
      const isMatch = Matcher.matches(card, settings.tagsSelected);
      
      if (settings.enabled && isMatch) {
        if (!originalDisplays.has(card)) {
          originalDisplays.set(card, card.style.display);
        }
        card.style.setProperty('display', 'none', 'important');
      } else if (originalDisplays.has(card)) {
        card.style.display = originalDisplays.get(card) || '';
      }
    }
  });
}

/**
 * Debounce function to limit execution frequency for global scans.
 */
function debounce(func: Function, wait: number) {
  let timeout: number;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(null, args), wait);
  };
}

const debouncedGlobalProcess = debounce(() => processJobCards(), 150);

/**
 * Initialize the observer and storage listeners.
 */
async function init() {
  // Start fetching settings immediately
  const settingsPromise = StorageService.getSettings();
  settings = await settingsPromise;
  
  // Initial run - immediate (if DOM already has something)
  processJobCards();

  // Observe DOM changes - starting from documentElement because we run at document_start
  const observer = new MutationObserver((mutations) => {
    const nodesToProcess = new Set<HTMLElement>();
    
    for (const mutation of mutations) {
      // Handle added nodes
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement) {
          if (Scanner.isJobCard(node)) {
            nodesToProcess.add(node);
          } else {
            const nestedCards = Scanner.findJobCards(node);
            nestedCards.forEach(card => nodesToProcess.add(card));
          }
        }
      }

      // Handle text/content updates within job cards
      if (mutation.type === 'characterData' || mutation.type === 'childList') {
        const target = mutation.target as HTMLElement;
        const closestCard = target.closest<HTMLElement>(Scanner.getSelector());
        if (closestCard) {
          nodesToProcess.add(closestCard);
        }
      }
    }

    if (nodesToProcess.size > 0) {
      processJobCards(Array.from(nodesToProcess));
    }

    // Always schedule a global scan to ensure consistency
    debouncedGlobalProcess();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // Listen for storage changes
  StorageService.onChanged((changes) => {
    if (changes.enabled) settings.enabled = changes.enabled.newValue;
    if (changes.tagsSelected) settings.tagsSelected = changes.tagsSelected.newValue;
    processJobCards();
  });
}

init();
