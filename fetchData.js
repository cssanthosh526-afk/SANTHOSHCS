/*
===========================================
VTU DIARY DATA EXTRACTOR (BROWSER SCRIPT)
===========================================

DESCRIPTION:
This script extracts internship diary entries from the VTU portal,
processes them, and downloads a clean JSON file.

-------------------------------------------
HOW TO USE
-------------------------------------------

1. Open the VTU Diary page:
   https://vtu.internyet.in/dashboard/student/diary-entries

2. Make sure you are logged in

3. Open Developer Tools:
   - Press F12
   - Go to the "Console" tab

4. Copy the entire script (this file)

5. Paste it into the console and press Enter

6. Wait for the script to finish:
   - You will see logs like "Fetching page X..."

7. A file named "refined_diary.json" will be downloaded automatically

-------------------------------------------
OUTPUT FORMAT
-------------------------------------------

Each entry contains:
- date
- hours
- work_summary (from description)
- learnings (first 2 lines)

-------------------------------------------
NOTES
-------------------------------------------

- Requires active login session
- Runs entirely in browser (no installation needed)
- Safe to use for personal data extraction

===========================================
*/

(async () => {
  // Base API endpoint for fetching internship diary entries
  const API_URL =
    "https://vtuapi.internyet.in/api/v1/student/internship-diaries";

  // Tracks current page for paginated API requests
  let page = 1;

  // Stores all processed entries across pages
  let finalData = [];

  /**
   * Helper function to extract only the first two meaningful lines
   * from a given text block.
   *
   * Steps:
   * - Split text by newline
   * - Trim whitespace
   * - Remove empty lines
   * - Take first 2 lines
   * - Join back using newline
   */
  const getTwoLines = (text) => {
    if (!text) return "";
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 2)
      .join("\n");
  };

  /**
   * Main loop to fetch paginated data.
   * Continues until:
   * - API response is invalid
   * - No more entries are returned
   * - Last page is reached
   */
  while (true) {
    console.log(`Fetching page ${page}...`);

    // Fetch diary entries for the current page
    const res = await fetch(`${API_URL}?page=${page}`, {
      credentials: "include", // ensures session cookies are sent
      headers: { Accept: "application/json" },
    });

    // Stop if request fails
    if (!res.ok) break;

    // Parse JSON response
    const data = await res.json();

    // Handle different response shapes safely
    const entries = data.data?.data || data.data || [];

    // Stop if no entries are returned
    if (!entries.length) break;

    /**
     * Extract only required fields and normalize content.
     * - work_summary comes from description
     * - learnings processed similarly
     */
    finalData.push(
      ...entries.map((e) => ({
        date: e.date,
        hours: e.hours,
        work_summary: getTwoLines(e.description || ""),
        learnings: getTwoLines(e.learnings || ""),
      })),
    );

    // Stop if last page is reached (based on API metadata)
    if (data.meta?.last_page && page >= data.meta.last_page) break;

    // Move to next page
    page++;
  }

  /**
   * Sort all entries in ascending order by date
   * Ensures chronological ordering for final output
   */
  finalData.sort((a, b) => new Date(a.date) - new Date(b.date));

  /**
   * Create a downloadable JSON file in the browser
   */
  const blob = new Blob([JSON.stringify(finalData, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element to trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = "refined_diary.json";
  a.click();

  // Log completion status
  console.log("Extraction complete:", finalData.length);
})();
