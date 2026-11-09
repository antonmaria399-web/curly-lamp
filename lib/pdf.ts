import "server-only";

import { getDocumentProxy } from "unpdf";

type Item = { str: string; transform: number[]; width: number };

/** Extract the text of a PDF as visual lines (items grouped by their y position, sorted left to right). */
export async function pdfLines(data: Uint8Array, maxPages = 12): Promise<string[]> {
  const pdf = await getDocumentProxy(data);
  const lines: string[] = [];
  const pages = Math.min(pdf.numPages, maxPages);
  for (let p = 1; p <= pages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const rows = new Map<number, Item[]>();
    for (const raw of content.items as unknown[]) {
      const it = raw as Item;
      if (!it.str || !it.str.trim()) continue;
      const y = Math.round(it.transform[5] / 3) * 3;
      if (!rows.has(y)) rows.set(y, []);
      rows.get(y)!.push(it);
    }
    const ys = [...rows.keys()].sort((a, b) => b - a);
    for (const y of ys) {
      const items = rows.get(y)!.sort((a, b) => a.transform[4] - b.transform[4]);
      let line = "";
      let lastEnd = -Infinity;
      for (const it of items) {
        const x = it.transform[4];
        if (line && x - lastEnd > 2) line += "  ";
        line += it.str;
        lastEnd = x + (it.width || 0);
      }
      lines.push(line.trim());
    }
  }
  return lines;
}
