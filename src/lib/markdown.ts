/**
 * Server-side Markdown to HTML converter.
 * Handles: headings, paragraphs, code blocks, inline code,
 *   lists, blockquotes, links, images, hr, emphasis.
 */
export function markdownToHtml(md: string): string {
  const lines = md.split(/\r?\n/);
  let html = "";
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Fenced code block
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      let code = "";
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code += (code ? "\n" : "") + lines[i];
        i++;
      }
      i++; // skip closing ```
      const langAttr = lang ? ` class="language-${escapeAttr(lang)}"` : "";
      html += `<pre><code${langAttr}>${escapeHtml(code)}</code></pre>`;
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = processInline(headingMatch[2]);
      html += `<h${level}>${text}</h${level}>`;
      i++;
      continue;
    }

    // HR
    if (/^[-*_]{3,}\s*$/.test(line.trim())) {
      html += "<hr />";
      i++;
      continue;
    }

    // Blockquote
    if (line.trim().startsWith("> ")) {
      let quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().slice(2));
        i++;
      }
      html += `<blockquote><p>${processInline(quoteLines.join("<br>"))}</p></blockquote>`;
      continue;
    }

    // Unordered list
    if (/^[-*+]\s+/.test(line.trim())) {
      let listItems: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*+]\s+/, ""));
        i++;
      }
      html +=
        "<ul>" +
        listItems.map((item) => `<li>${processInline(item)}</li>`).join("") +
        "</ul>";
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line.trim())) {
      let listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      html +=
        "<ol>" +
        listItems.map((item) => `<li>${processInline(item)}</li>`).join("") +
        "</ol>";
      continue;
    }

    // Paragraph
    let paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !/^#{1,4}\s/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith("> ") &&
      !/^[-*+]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^[-*_]{3,}\s*$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    const paraHtml = paraLines.map((l) => processInline(l)).join("<br>");
    html += `<p>${paraHtml}</p>`;
  }

  return html;
}

function processInline(text: string): string {
  let result = text;

  // Inline code
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Images with optional size: ![alt](url) or ![alt](url =WxH) or ![alt](url =W)
  result = result.replace(
    /!\[([^\]]*)\]\(([^)]+?)(?:\s*=\s*(\d+)(?:x(\d+))?)?\)/g,
    (_m, alt, src, w, h) => {
      const width = w ? ` width="${w}"` : "";
      const height = h ? ` height="${h}"` : "";
      const style = w && !h ? ` style="aspect-ratio: auto"` : "";
      return `<img src="${src}" alt="${alt}"${width}${height}${style} />`;
    }
  );

  // Links
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  // Bold + Italic
  result = result.replace(
    /\*{3}(.+?)\*{3}/g,
    "<strong><em>$1</em></strong>"
  );

  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");

  return result;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(text: string): string {
  return text.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
