export const Matcher = {
  /**
   * Checks if an element's text content matches any of the given search terms.
   * Uses a TreeWalker for efficient text node traversal.
   */
  matches(element: HTMLElement, searchTerms: string[]): boolean {
    if (searchTerms.length === 0) return false;

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const nodeText = (node.textContent || '').toLowerCase();
          const matchFound = searchTerms.some(term => 
            nodeText.includes(term.toLowerCase())
          );
          return matchFound ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );

    return walker.nextNode() !== null;
  }
};
