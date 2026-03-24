# Job Filter

Hide unwanted job post automatically based on your keywords on popular job platforms.

## 🚀 Features

- **Multi-Platform Support**: Works seamlessly on:
  - LinkedIn
  - Indeed
  - Computrabajo
  - El Empleo
- **Keyword Filtering**: Filter out job postings based on custom keywords (e.g., specific company names, roles, or technologies).
- **Real-time Detection**: Uses `MutationObserver` to hide new job listings as they load or appear during infinite scrolling.
- **User Interface**: A React-based popup allows you to manage your filter list and toggle the extension on/off.
- **Persistent Settings**: Your filters and settings are saved using Chrome's storage API.

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [daisyUI](https://daisyui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/) with [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📦 Installation & Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hide-jobs-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

### Loading in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked**.
4. Select the `dist` folder created by the build process.

## 📖 How it Works

1. **Scanner**: Identifies job card elements using a set of curated CSS selectors for each supported platform.
2. **Matcher**: Efficiently scans the text content of job cards using a `TreeWalker` to find matches against your selected tags.
3. **Content Script**: Injects into supported sites and monitors for DOM changes to ensure job cards are filtered as they appear.

## 📄 License

[MIT](LICENSE)
