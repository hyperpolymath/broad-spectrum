// report.ts - Report formatting binding

export function formatAsJSON(report: any): string {
  return JSON.stringify(report, null, 2);
}

export async function formatAsHTML(report: any): Promise<string> {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Audit Report - ${escapeHtml(report.url)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 { color: #2c3e50; margin-bottom: 10px; }
    h2 { color: #34495e; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    h3 { color: #555; margin-top: 20px; margin-bottom: 10px; }
    .meta { color: #7f8c8d; margin-bottom: 30px; }
    .score {
      font-size: 48px;
      font-weight: bold;
      text-align: center;
      padding: 30px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .score-excellent { background: #d4edda; color: #155724; }
    .score-good { background: #d1ecf1; color: #0c5460; }
    .score-fair { background: #fff3cd; color: #856404; }
    .score-poor { background: #f8d7da; color: #721c24; }
    .metric { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; }
    .metric-label { font-weight: 500; }
    .metric-value { color: #555; }
    .issue {
      padding: 12px;
      margin: 8px 0;
      border-left: 4px solid;
      background: #f8f9fa;
      border-radius: 4px;
    }
    .issue-error { border-color: #dc3545; }
    .issue-warning { border-color: #ffc107; }
    .issue-info { border-color: #17a2b8; }
    .section { margin-top: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f9fa; font-weight: 600; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .badge-success { background: #28a745; color: white; }
    .badge-danger { background: #dc3545; color: white; }
    .badge-warning { background: #ffc107; color: #212529; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Website Audit Report</h1>
    <div class="meta">
      <div><strong>URL:</strong> ${escapeHtml(report.url)}</div>
      <div><strong>Generated:</strong> ${new Date(parseFloat(report.timestamp)).toLocaleString()}</div>
      <div><strong>Execution Time:</strong> ${(report.executionTime / 1000).toFixed(2)}s</div>
    </div>

    <div class="score ${getScoreClass(report.overallScore)}">
      Overall Score: ${report.overallScore.toFixed(1)}/100
    </div>

    ${report.linkCheck ? formatLinkCheckHTML(report.linkCheck) : ""}
    ${report.accessibility ? formatAccessibilityHTML(report.accessibility) : ""}
    ${report.performance ? formatPerformanceHTML(report.performance) : ""}
    ${report.seo ? formatSEOHTML(report.seo) : ""}
  </div>
</body>
</html>
  `;

  return html.trim();
}

export function formatAsMarkdown(report: any): string {
  const lines: string[] = [];

  lines.push("# Website Audit Report\n");
  lines.push(`**URL:** ${report.url}`);
  lines.push(`**Generated:** ${new Date(parseFloat(report.timestamp)).toLocaleString()}`);
  lines.push(`**Execution Time:** ${(report.executionTime / 1000).toFixed(2)}s`);
  lines.push(`**Overall Score:** ${report.overallScore.toFixed(1)}/100\n`);

  if (report.linkCheck) {
    lines.push("## Link Check\n");
    lines.push(`- **Total Links:** ${report.linkCheck.totalLinks}`);
    lines.push(`- **Broken Links:** ${report.linkCheck.brokenLinks}`);
    lines.push(`- **External Links:** ${report.linkCheck.externalLinks}`);
    lines.push(`- **Redirects:** ${report.linkCheck.redirects}`);
    lines.push(`- **Average Response Time:** ${report.linkCheck.averageResponseTime.toFixed(0)}ms\n`);
  }

  if (report.accessibility) {
    lines.push("## Accessibility\n");
    lines.push(`- **Score:** ${report.accessibility.score.toFixed(1)}/100`);
    lines.push(`- **Violations:** ${report.accessibility.violations.length}`);
    lines.push(`- **Warnings:** ${report.accessibility.warnings.length}`);
    lines.push(`- **Passes:** ${report.accessibility.passes}\n`);
  }

  if (report.performance) {
    lines.push("## Performance\n");
    const score = calculatePerformanceScore(report.performance.metrics);
    lines.push(`- **Score:** ${score.toFixed(1)}/100`);
    lines.push(`- **Page Size:** ${formatBytes(report.performance.metrics.totalPageSize)}`);
    lines.push(`- **Resources:** ${report.performance.metrics.resourceCount}`);
    lines.push(`- **Load Time:** ${report.performance.metrics.loadComplete.toFixed(0)}ms\n`);
  }

  if (report.seo) {
    lines.push("## SEO\n");
    lines.push(`- **Score:** ${report.seo.score.toFixed(1)}/100`);
    lines.push(`- **Title:** ${report.seo.data.title || "(missing)"}`);
    lines.push(`- **Word Count:** ${report.seo.data.wordCount}`);
    lines.push(`- **Issues:** ${report.seo.issues.length}\n`);
  }

  return lines.join("\n");
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function getScoreClass(score: number): string {
  if (score >= 90) return "score-excellent";
  if (score >= 70) return "score-good";
  if (score >= 50) return "score-fair";
  return "score-poor";
}

function formatLinkCheckHTML(linkCheck: any): string {
  return `
    <div class="section">
      <h2>Link Check</h2>
      <div class="metric">
        <span class="metric-label">Total Links</span>
        <span class="metric-value">${linkCheck.totalLinks}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Broken Links</span>
        <span class="metric-value">${linkCheck.brokenLinks}</span>
      </div>
      <div class="metric">
        <span class="metric-label">External Links</span>
        <span class="metric-value">${linkCheck.externalLinks}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Redirects</span>
        <span class="metric-value">${linkCheck.redirects}</span>
      </div>
    </div>
  `;
}

function formatAccessibilityHTML(a11y: any): string {
  return `
    <div class="section">
      <h2>Accessibility</h2>
      <div class="metric">
        <span class="metric-label">Score</span>
        <span class="metric-value">${a11y.score.toFixed(1)}/100</span>
      </div>
      <div class="metric">
        <span class="metric-label">Violations</span>
        <span class="metric-value">${a11y.violations.length}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Passes</span>
        <span class="metric-value">${a11y.passes}</span>
      </div>
    </div>
  `;
}

function formatPerformanceHTML(perf: any): string {
  const score = calculatePerformanceScore(perf.metrics);
  return `
    <div class="section">
      <h2>Performance</h2>
      <div class="metric">
        <span class="metric-label">Score</span>
        <span class="metric-value">${score.toFixed(1)}/100</span>
      </div>
      <div class="metric">
        <span class="metric-label">Page Size</span>
        <span class="metric-value">${formatBytes(perf.metrics.totalPageSize)}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Resources</span>
        <span class="metric-value">${perf.metrics.resourceCount}</span>
      </div>
    </div>
  `;
}

function formatSEOHTML(seo: any): string {
  return `
    <div class="section">
      <h2>SEO</h2>
      <div class="metric">
        <span class="metric-label">Score</span>
        <span class="metric-value">${seo.score.toFixed(1)}/100</span>
      </div>
      <div class="metric">
        <span class="metric-label">Title</span>
        <span class="metric-value">${escapeHtml(seo.data.title || "(missing)")}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Word Count</span>
        <span class="metric-value">${seo.data.wordCount}</span>
      </div>
    </div>
  `;
}

function formatBytes(bytes: number): string {
  const kb = bytes / 1024;
  const mb = kb / 1024;
  if (mb >= 1) return `${mb.toFixed(2)}MB`;
  if (kb >= 1) return `${kb.toFixed(2)}KB`;
  return `${bytes}B`;
}

function calculatePerformanceScore(metrics: any): number {
  let score = 100;
  if (metrics.loadComplete > 3000) score -= 20;
  else if (metrics.loadComplete > 2000) score -= 10;
  if (metrics.totalPageSize > 3000000) score -= 10;
  return Math.max(0, score);
}
