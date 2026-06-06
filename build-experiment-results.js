/**
 * build-experiment-results.js
 * 从本地实验项目 outputs 目录同步图片与对比表，生成实验结果页与 manifest。
 *
 * 运行：node build-experiment-results.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CONFIG_PATH = path.join(ROOT, 'experiment-results.config.json');
const OUTPUT_DIR = path.join(ROOT, 'experiment-results');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');
const EXPERIMENTS_PATH = path.join(ROOT, 'experiments.json');
const CONFIG_DEFAULTS_KEY = '_defaults';

function resolveSourceDir(expConfig, defaults = {}) {
  if (expConfig.sourceDir) {
    return path.resolve(expConfig.sourceDir);
  }

  const projectRoot = expConfig.projectRoot || defaults.projectRoot;
  const outputDir = expConfig.outputDir;

  if (!projectRoot || !outputDir) {
    return null;
  }

  return path.resolve(projectRoot, outputDir);
}

function loadExperimentConfigs(rawConfig) {
  const defaults = rawConfig[CONFIG_DEFAULTS_KEY] || {};
  const experiments = {};

  for (const [id, expConfig] of Object.entries(rawConfig)) {
    if (id === CONFIG_DEFAULTS_KEY) continue;
    experiments[id] = { ...defaults, ...expConfig };
  }

  return { defaults, experiments };
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineToHtml(s) {
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
  s = s.replace(/`([^`\n]+?)`/g, '<code>$1</code>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s;
}

function mdToHtml(md) {
  const lines = md.split(/\r?\n/);
  let html = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.match(/^```/)) {
      const lang = line.replace(/^```/, '').trim();
      let code = '';
      i++;
      while (i < lines.length && !lines[i].match(/^```/)) {
        code += escHtml(lines[i]) + '\n';
        i++;
      }
      i++;
      html += `<pre class="code-block"><code${lang ? ` class="lang-${lang}"` : ''}>${code}</code></pre>`;
      continue;
    }

    if (line.startsWith('> ')) {
      let bq = '';
      while (i < lines.length && lines[i].startsWith('> ')) {
        bq += inlineToHtml(escHtml(lines[i].slice(2))) + ' ';
        i++;
      }
      html += `<blockquote>${bq.trim()}</blockquote>`;
      continue;
    }

    if (line.match(/^\|/) && i + 1 < lines.length && lines[i + 1].match(/^\|[-| :]+\|/)) {
      const headers = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
        .map(h => `<th>${inlineToHtml(h.trim())}</th>`).join('');
      i += 2;
      let rows = '';
      while (i < lines.length && lines[i].match(/^\|/)) {
        const cells = lines[i].split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
          .map(c => `<td>${inlineToHtml(c.trim())}</td>`).join('');
        rows += `<tr>${cells}</tr>`;
        i++;
      }
      html += `<div class="table-wrap"><table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
      continue;
    }

    const hMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = inlineToHtml(escHtml(hMatch[2]));
      const id = hMatch[2].replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '-');
      html += `<h${level} id="${id}">${text}</h${level}>`;
      i++;
      continue;
    }

    if (line.match(/^[-*]\s+/)) {
      let items = '';
      while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
        items += `<li>${inlineToHtml(escHtml(lines[i].replace(/^[-*]\s+/, '')))}</li>`;
        i++;
      }
      html += `<ul>${items}</ul>`;
      continue;
    }

    if (line.match(/^\d+\.\s+/)) {
      let items = '';
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        items += `<li>${inlineToHtml(escHtml(lines[i].replace(/^\d+\.\s+/, '')))}</li>`;
        i++;
      }
      html += `<ol>${items}</ol>`;
      continue;
    }

    if (line.match(/^---+$/)) {
      html += '<hr>';
      i++;
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    html += `<p>${inlineToHtml(escHtml(line))}</p>`;
    i++;
  }

  return html;
}

function copyIfExists(src, dest) {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return true;
}

function loadGithubLinks() {
  if (!fs.existsSync(EXPERIMENTS_PATH)) return {};
  const data = JSON.parse(fs.readFileSync(EXPERIMENTS_PATH, 'utf8'));
  const map = {};
  for (const exp of data.experiments || []) {
    if (exp.links?.github) map[exp.id] = exp.links.github;
  }
  return map;
}

function buildFiguresHtml(images, targetDir, copiedFiles) {
  if (!images?.length) return '';

  const figures = images.map(img => {
    const destPath = path.join(targetDir, img.file);
    const exists = copiedFiles.has(img.file);
    if (exists) {
      return `
        <figure class="result-figure">
          <a href="${img.file}" target="_blank" rel="noopener">
            <img src="${img.file}" alt="${escHtml(img.caption || img.file)}" loading="lazy" />
          </a>
          ${img.caption ? `<figcaption>${escHtml(img.caption)}</figcaption>` : ''}
        </figure>`;
    }
    return `
        <figure class="result-figure result-figure--missing">
          <div class="result-missing">
            <p>图片尚未同步：<code>${escHtml(img.file)}</code></p>
            <p class="result-missing-hint">请从云端下载 outputs 后重新运行 <code>node build-experiment-results.js</code></p>
          </div>
          ${img.caption ? `<figcaption>${escHtml(img.caption)}</figcaption>` : ''}
        </figure>`;
  }).join('');

  return `
    <section class="result-section">
      <h2 class="result-section-title">可视化结果</h2>
      <div class="result-gallery">${figures}</div>
    </section>`;
}

function buildResultsHtml({ id, config, tableHtml, figuresHtml, githubUrl, lastBuilt, sourceLabel }) {
  const title = config.title || id;
  const sourceMeta = sourceLabel
    ? `<span class="result-meta-sep">·</span><span>数据来源 <code>${escHtml(sourceLabel)}</code></span>`
    : '';
  const githubFooter = githubUrl
    ? `<a href="${githubUrl}" target="_blank" rel="noopener" class="result-github-link">查看 GitHub 项目 ↗</a>`
    : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)} · 实验结果</title>
  <link rel="stylesheet" href="../../style.css?v=2" />
  <link rel="preconnect" href="https://fonts.googleapis.cn" crossorigin />
  <link href="https://fonts.googleapis.cn/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="noise-overlay" aria-hidden="true"></div>
  <div class="grid-overlay" aria-hidden="true"></div>

  <nav class="navbar scrolled">
    <div class="nav-container">
      <a href="../../index.html" class="nav-logo">Research<span class="dot">.</span></a>
      <ul class="nav-links">
        <li><a href="../../index.html#experiments">实验看板</a></li>
        <li><a href="../../knowledge.html">知识库</a></li>
      </ul>
    </div>
  </nav>

  <main class="result-page">
    <a href="../../index.html#experiments" class="result-back">← 返回实验看板</a>
    <p class="result-label">实验结果</p>
    <h1 class="result-title">${escHtml(title)}</h1>
    <p class="result-meta">构建于 ${lastBuilt}${sourceMeta}</p>

    ${tableHtml ? `
    <section class="result-section">
      <h2 class="result-section-title">数值对比</h2>
      <div class="result-body">${tableHtml}</div>
    </section>` : `
    <section class="result-section">
      <div class="result-missing">
        <p>对比表尚未同步，请检查 <code>comparison_table.md</code> 是否存在后重新构建。</p>
      </div>
    </section>`}

    ${figuresHtml}

    <footer class="result-footer">
      ${githubFooter}
    </footer>
  </main>
</body>
</html>`;
}

function build() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('未找到 experiment-results.config.json');
    process.exit(1);
  }

  const rawConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const { experiments } = loadExperimentConfigs(rawConfig);
  const githubLinks = loadGithubLinks();
  const manifest = {};
  const lastBuilt = new Date().toISOString().slice(0, 10);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const [id, expConfig] of Object.entries(experiments)) {
    const sourceDir = resolveSourceDir(expConfig, rawConfig[CONFIG_DEFAULTS_KEY] || {});
    const outputDir = expConfig.outputDir || (sourceDir ? path.basename(sourceDir) : null);
    const sourceLabel = expConfig.outputLabel || outputDir || sourceDir;
    const targetDir = path.join(OUTPUT_DIR, id);
    fs.mkdirSync(targetDir, { recursive: true });

    const copiedFiles = new Set();
    let hasImages = false;
    let hasTable = false;

    if (!sourceDir) {
      console.warn(`[WARN] ${id}: 未配置 outputDir + projectRoot（或 sourceDir）`);
    } else if (!fs.existsSync(sourceDir)) {
      console.warn(`[WARN] ${id}: 结果目录不存在: ${sourceDir}`);
    } else {
      console.log(`[${id}] 同步自 ${sourceLabel} → ${sourceDir}`);
      for (const img of expConfig.images || []) {
        const src = path.join(sourceDir, img.file);
        const dest = path.join(targetDir, img.file);
        if (copyIfExists(src, dest)) {
          copiedFiles.add(img.file);
          hasImages = true;
          console.log(`  [IMG]  ${path.relative(ROOT, dest)}`);
        } else {
          console.warn(`  [WARN] 缺失图片: ${src}`);
        }
      }

      if (expConfig.table) {
        const tableSrc = path.join(sourceDir, expConfig.table);
        const tableDest = path.join(targetDir, expConfig.table);
        if (copyIfExists(tableSrc, tableDest)) {
          hasTable = true;
          console.log(`  [MD]   ${path.relative(ROOT, tableDest)}`);
        } else {
          console.warn(`  [WARN] 缺失对比表: ${tableSrc}`);
        }
      }
    }

    let tableHtml = '';
    const tablePath = path.join(targetDir, expConfig.table || '');
    if (expConfig.table && fs.existsSync(tablePath)) {
      tableHtml = mdToHtml(fs.readFileSync(tablePath, 'utf8'));
    }

    const figuresHtml = buildFiguresHtml(expConfig.images, targetDir, copiedFiles);
    const html = buildResultsHtml({
      id,
      config: expConfig,
      tableHtml,
      figuresHtml,
      githubUrl: githubLinks[id],
      lastBuilt,
      sourceLabel,
    });

    const htmlPath = path.join(targetDir, 'results.html');
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`  [HTML] ${path.relative(ROOT, htmlPath)}`);

    manifest[id] = {
      page: `experiment-results/${id}/results.html`,
      title: expConfig.title || id,
      outputDir: outputDir || null,
      sourceDir: sourceDir || null,
      lastBuilt,
      hasImages,
      hasTable,
    };
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\n完成：${Object.keys(manifest).length} 个实验结果页 → ${path.relative(ROOT, MANIFEST_PATH)}`);
}

build();
