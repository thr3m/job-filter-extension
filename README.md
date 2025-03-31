# hide-jobs-extension

This Chrome extension helps you filter out specific job offers from LinkedIn, Computrabajo, and elempleo based on keywords found in the job postings.

## Features

-   **Job Offer Filtering:** Automatically hides job offers containing specified keywords (e.g., company names) from your job search results.
-   **Supported Platforms:** Works on LinkedIn, Computrabajo, and elempleo.
-   **Easy Configuration:** Uses Chrome storage to persist the enabled state.

## How it Works

The extension injects a content script (`content.js`) into the specified websites. This script:

1.  **Identifies Job Offers:** Locates job offer elements using CSS selectors.
2.  **Filters by Keyword:** Checks if the job offer contains the specified keyword (currently set to "bairesdev" in `content.js`).
3.  **Hides Job Offers:** Hides the job offer element by setting its `display` style to `none !important;`.
4.  **Observes DOM Changes:** Uses a `MutationObserver` to detect new job offers added to the page and applies the filtering logic to them as well.

## Configuration

Currently, the keyword to filter is hardcoded in `content.js`.

## Future Enhancements

-   Implement a user interface (e.g., a popup) to allow users to configure the keywords to filter.
-   Add options to specify the platforms on which to enable the extension.
