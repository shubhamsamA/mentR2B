import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { marked } from "marked";

export async function POST(req) {
  try {
    const { markdown } = await req.json();
    if (!markdown) return NextResponse.json({ error: "No markdown provided" }, { status: 400 });

    // Convert Markdown → HTML
    const htmlContent = marked.parse(markdown);

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.4; color: #000; padding: 20px; }
            h1 { font-size: 16pt; font-weight: bold; }
              h2 {
          font-size: 14pt;
          font-weight: bold;
          margin-bottom: 10pt;
          border-bottom: 1px solid #000; /* underline */
          padding-bottom: 3px;
        }
            h3 { font-size: 13pt; font-weight: bold; }
            h4 { font-size: 12pt; font-weight: bold; }
            h5 { font-size: 11pt; font-weight: bold; }
            h6 { font-size: 10pt; font-weight: bold; }
            code { background: #f4f4f4; padding: 2px 4px; border-radius: 4px; }
            pre { background: #f4f4f4; padding: 10px; border-radius: 6px; overflow-x: auto; }
          </style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `;

    const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" },
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
