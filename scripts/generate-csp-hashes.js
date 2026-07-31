const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Recursively find all .html files under a directory.
 */
function findHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(fullPath, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Extract inline script contents from HTML.
 * Matches <script>...</script> blocks that do NOT have a src attribute.
 */
function extractInlineScripts(html) {
  const scripts = [];
  const regex = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const content = match[1].trim();
    if (content) {
      scripts.push(content);
    }
  }
  return scripts;
}

/**
 * Compute SHA-256 hash of a string, return base64.
 */
function computeHash(content) {
  return crypto.createHash('sha256').update(content).digest('base64');
}

function main() {
  // Possible Next.js output directories (static export vs server build)
  const possibleDirs = ['out', '.next/server/app', '.next/server/pages'];
  let htmlFiles = [];

  for (const dir of possibleDirs) {
    if (fs.existsSync(dir)) {
      htmlFiles = htmlFiles.concat(findHtmlFiles(dir));
    }
  }

  if (htmlFiles.length === 0) {
    console.log('No HTML files found in build output. Skipping CSP hash generation.');
    process.exit(0);
  }

  const allScripts = new Set();
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf-8');
    const scripts = extractInlineScripts(html);
    for (const script of scripts) {
      allScripts.add(script);
    }
  }

  const hashes = Array.from(allScripts).map(content => `sha256-${computeHash(content)}`);

  // Read and patch vercel.json
  const vercelPath = 'vercel.json';
  if (!fs.existsSync(vercelPath)) {
    console.error('vercel.json not found');
    process.exit(1);
  }

  const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));

  const headersConfig = vercel.headers || [];
  for (const headerRule of headersConfig) {
    for (const h of headerRule.headers || []) {
      if (h.key === 'Content-Security-Policy') {
        let csp = h.value;
        csp = csp.replace(/script-src\s+([^;]+)/, (match, directive) => {
          const parts = directive.trim().split(/\s+/);
          // Remove unsafe-inline and any stale sha256 hashes
          const cleaned = parts.filter(p => p !== "'unsafe-inline'" && !p.startsWith("'sha256-"));
          const newParts = ["'self'", ...hashes.map(h => `'${h}'`)];
          return `script-src ${newParts.join(' ')}`;
        });
        h.value = csp;
      }
    }
  }

  fs.writeFileSync(vercelPath, JSON.stringify(vercel, null, 2) + '\n');
  console.log(`Updated ${vercelPath} with ${hashes.length} SHA-256 hash(es).`);
  for (const h of hashes) {
    console.log(`  - ${h}`);
  }
}

main();
