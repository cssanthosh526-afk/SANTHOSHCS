# VTU Internship Diary Generator

A browser-based tool to extract VTU internship diary entries and generate a clean, print-ready PDF in VTU format.

Repository: [https://github.com/R-Pradhyumna/VTU-Diary-Generator.git](https://github.com/R-Pradhyumna/VTU-Diary-Generator.git)

---

## Overview

Maintaining a VTU internship diary manually involves repeatedly opening each entry, copying content, and formatting it for submission. This project automates the entire workflow end-to-end.

For quick step-by-step instructions, see: [HOW_TO_USE.txt](./HOW_TO_USE.txt)

The system:

1. Extracts diary entries directly from the VTU portal
2. Cleans and structures the data
3. Generates a print-ready diary in VTU format

The entire workflow runs inside the browser with no installation or external dependencies required.

---

## Demo Video

Click below to watch the full walkthrough:

[![Watch the demo](https://img.youtube.com/vi/Qqy61P2YOmM/maxresdefault.jpg)](https://youtu.be/Qqy61P2YOmM)

---

## Features

### Data Extraction

- Fetches all diary entries from the VTU portal
- Handles pagination automatically
- Extracts:
  - Date
  - Hours
  - Work Summary
  - Learnings
  - skills

### Data Processing

- Removes unnecessary whitespace and formatting
- Retains only the first two meaningful lines per field during extraction
- Further refines content to 1–2 sentences during rendering
- Sorts entries chronologically

### PDF Generation

- Generates VTU-compliant diary format
- Fixed entries per page (4 entries)
- Prevents row splitting across pages
- Includes signature sections:
  - External Coordinator
  - Internship Coordinator

### Lightweight and Dependency-Free

- Runs entirely in the browser
- No Node.js, Puppeteer, or external libraries required

---

## Project Structure

```
.
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── fetchData.js
├── index.html
├── LICENSE.md
├── README.md
├── SECURITY.md
└── viewer.html
```

---

## How It Works

### Step 1: Data Extraction

The script in `fetchData.js` calls the VTU API:

[https://vtuapi.internyet.in/api/v1/student/internship-diaries](https://vtuapi.internyet.in/api/v1/student/internship-diaries)

Workflow:

1. Fetch paginated data
2. Extract required fields
3. Normalize content (retain first two meaningful lines)
4. Sort entries by date
5. Download `refined_diary.json`

---

### Step 2: Upload and Rendering

- `index.html` provides a simple upload interface
- Data is stored in browser `localStorage`
- `viewer.html`:
  - Processes text into sentences
  - Applies adaptive sentence selection (1–2 sentences)
  - Renders structured pages with controlled layout

---

### Step 3: PDF Generation

- Uses the browser print engine
- A4 layout with controlled margins
- Stable pagination using:
  - Fixed entries per page
  - Minimum row height
  - Page-break control

---

## Usage

### Requirements

- A modern browser (Google Chrome recommended)
- Active VTU login session

---

### 1. Extract Data

- Open:
  [https://vtu.internyet.in/dashboard/student/diary-entries](https://vtu.internyet.in/dashboard/student/diary-entries)
- Open Developer Tools (F12 → Console)
- Copy contents of `fetchData.js`
- Paste and execute
- Download `refined_diary.json`

---

### 2. Generate Diary

- Open `index.html`
- Upload `refined_diary.json`
- Click "Generate Diary"

---

### 3. Save as PDF

- Open print dialog
- Disable "Headers and Footers"
- Save as PDF (A4 format)

---

## Output Format

Each entry:

```json
{
  "date": "YYYY-MM-DD",
  "hours": 6,
  "work_summary": "First two meaningful lines",
  "learnings": "First two meaningful lines",
  "skills": "First one meaningful lines",
}
```

---

## Design Decisions

### Content Normalization Over Visual Truncation

Handling inconsistent content length is a core challenge in document generation. Instead of relying on CSS-based truncation, this project normalizes content during data extraction.

- Each field is reduced to the first two meaningful lines (`fetchData.js`)
- Rendering logic further refines content to 1–2 complete sentences (`viewer.html`)
- Ensures no mid-sentence cuts or broken text

This approach preserves readability and semantic integrity.

---

### Fixed Pagination Strategy

Dynamic layouts (variable rows per page) were found to be unreliable due to varying content lengths.

The final approach uses:

- Fixed entries per page (4 entries)
- Deterministic chunking (`viewer.html`)

This guarantees consistent page structure and prevents overflow into signature sections.

---

### Adaptive Text Handling

To balance readability and layout stability:

- Attempts to display up to 2 sentences
- Falls back to 1 sentence when content is too long

This prevents layout breakage while maintaining meaningful content.

---

### Layout Stabilization

Entries vary in length, which can lead to uneven spacing.

To address this:

- Minimum row height is enforced
- Page-break behavior is controlled

This ensures visual consistency across pages.

---

### Dependency-Free Architecture

Heavy solutions (e.g., Puppeteer) were avoided.

The system relies on:

- Native browser rendering (`window.print()`)

Benefits:

- No installation
- Cross-platform compatibility
- Simpler maintenance

---

### Separation of Concerns

The project is divided into clear components:

- `fetchData.js` → Data extraction and normalization
- `index.html` → User interface
- `viewer.html` → Rendering and pagination

This improves maintainability and extensibility.

---

### Trade-off: Perfection vs Predictability

Perfect visual uniformity is not always achievable due to browser rendering behavior.

The system prioritizes:

- Stability over visual perfection
- Readability over maximum density

Minor whitespace variations are acceptable and expected.

---

## Limitations

- Requires active VTU login session
- Dependent on VTU API structure
- Browser print rendering may vary slightly

---

## Security

- Do not share session cookies
- Use only on trusted systems
- No data is transmitted externally

---

## License

See: [LICENSE.md](./LICENSE.md)

---

## Contributing

See: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Code of Conduct

See: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

---

## Security Policy

See: [SECURITY.md](./SECURITY.md)

---

## Future Improvements

- Page numbering
- Student details header
- Configurable entries per page
- Hosted web version
