export interface ExtensionSettings {
  enabled: boolean;
  tagsSelected: string[];
}

const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: false,
  tagsSelected: [],
};

export const StorageService = {
  getSettings(): Promise<ExtensionSettings> {
    return new Promise((resolve) => {
      chrome.storage.local.get(DEFAULT_SETTINGS, (data) => {
        resolve(data as ExtensionSettings);
      });
    });
  },

  setSettings(settings: Partial<ExtensionSettings>): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(settings, () => {
        resolve();
      });
    });
  },

  onChanged(callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        callback(changes);
      }
    });
  }
};
