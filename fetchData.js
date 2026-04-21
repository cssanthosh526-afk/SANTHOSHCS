/*
===========================================
VTU DIARY DATA EXTRACTOR (BROWSER SCRIPT)
===========================================

DESCRIPTION:
This script extracts internship diary entries from the VTU portal,
processes them, and downloads a clean JSON file including Skills field.

-------------------------------------------
HOW TO USE
-------------------------------------------

1. Open the VTU Diary page:
   https://vtu.internyet.in/dashboard/student/diary-entries

2. Make sure you are logged in

3. Open Developer Tools:
   - Press F12
   - Go to the "Console" tab

4. Copy the entire script

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
- work_summary
- learnings
- skills

-------------------------------------------
NOTES
-------------------------------------------

- Requires active login session
- Runs entirely in browser
- No installation needed
- Safe for personal use

===========================================
*/

(async () => {
  const API_URL =
    "https://vtuapi.internyet.in/api/v1/student/internship-diaries";

  let page = 1;
  let finalData = [];

  /*
   * Extract first two meaningful lines
   * Used for work_summary and learnings
   */
  const getTwoLines = (text) => {
    if (!text) return "";

    return text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 2)
      .join("\n");
  };

  /*
   * Extract only first meaningful line
   * Used for skills column
   */
  const getOneLine = (text) => {
    if (!text) return "";

    return text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 1)
      .join("");
  };

  /*
   * Main fetch loop for all pages
   */
  while (true) {
    console.log(`Fetching page ${page}...`);

    const res = await fetch(`${API_URL}?page=${page}`, {
      credentials: "include",
      headers: {
        Accept: "application/json"
      }
    });

    if (!res.ok) {
      console.log(`Failed to fetch page ${page}`);
      break;
    }

    const data = await res.json();

    /*
     * Safe API response handling
     * Supports multiple response formats
     */
    const entries =
      data?.data?.data ||
      data?.data ||
      data?.internship_diaries ||
      [];

    if (!entries.length) {
      console.log("No more entries found.");
      break;
    }

    /*
     * Extract required fields
     */
    finalData.push(
      ...entries.map((e) => ({
        date: e.date || "",
        hours: e.hours || "",
        work_summary: getTwoLines(
          e.description ||
          e.work_summary ||
          ""
        ),
        learnings: getTwoLines(
          e.learnings || ""
        ),
        skills: getOneLine(
          e.skills ||
          e.skill ||
          ""
        )
      }))
    );

    /*
     * Stop if last page reached
     */
    if (data?.meta?.last_page && page >= data.meta.last_page) {
      console.log("Last page reached.");
      break;
    }

    page++;
  }

  /*
   * Sort by date (oldest → newest)
   */
  finalData.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  /*
   * Prevent blank download
   */
  if (finalData.length === 0) {
    alert("No diary entries found. Please check login session.");
    console.log("No data extracted.");
    return;
  }

  /*
   * Create downloadable JSON file
   */
  const blob = new Blob(
    [JSON.stringify(finalData, null, 2)],
    {
      type: "application/json"
    }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "refined_diary.json";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);

  console.log("Extraction complete!");
  console.log("Total entries:", finalData.length);
})();
