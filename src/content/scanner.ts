const SELECTORS = [
  'article',
  'div.result-item',
  'div[data-view-name="job-card"]',
  '#mosaic-provider-jobcards > div > ul > li',  // indeed
  '.scaffold-layout__list-item', // linkedin list
  '.job-card-container', // linkedin another card type
  '.base-card', // linkedin generic card
  '[data-testid="job-card"]' // general testid
].join(', ');

export const Scanner = {
  /**
   * Gets the selector string for job cards.
   */
  getSelector(): string {
    return SELECTORS;
  },

  /**
   * Finds all job card elements in the document or within a specific node.
   */
  findJobCards(root: ParentNode = document): HTMLElement[] {
    return Array.from(root.querySelectorAll<HTMLElement>(SELECTORS));
  },

  /**
   * Checks if a single element is a job card or contains job cards.
   */
  isJobCard(element: HTMLElement): boolean {
    return element.matches(SELECTORS);
  }
};
