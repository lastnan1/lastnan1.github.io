/**
 * build-papers.js
 * 读取 papers/ 目录下所有 .md 论文笔记，生成：
 *   - 每篇论文对应的 .html（同目录）
 *   - 根目录 papers.json（知识库索引）
 *
 * 运行：node build-papers.js
 * 依赖：Node.js 内置模块，无需安装
 */

const fs = require('fs');
const path = require('path');

const PAPERS_DIR = path.join(__dirname, 'papers');
const OUTPUT_JSON = path.join(__dirname, 'papers.json');
const SOURCE_NOTES_DIR = 'D:\\study\\root\\note\\每日论文';
const SOURCE_ARXIV_DIR = path.join(SOURCE_NOTES_DIR, '_arxiv-papers');

// ── PDF / readLink 解析 ────────────────────────────────────────────────
function normalizeYamlValue(value) {
  if (value == null) return null;
  const v = value.trim().replace(/^["']+|["']+$/g, '');
  if (v === '' || v === '"') return null;
  return v;
}

function extractArxivId(meta, body) {
  const fromMeta = normalizeYamlValue(meta.arxiv);
  if (fromMeta && /^\d{4}\.\d{4,5}$/.test(fromMeta)) return fromMeta;
  const embed = body.match(/!\[\[(\d{4}\.\d{4,5})\.pdf\]\]/);
  if (embed) return embed[1];
  return null;
}

function copyPdfIfAvailable(arxivId, dateStr, targetDir) {
  const pdfName = `${arxivId}.pdf`;
  const targetPath = path.join(targetDir, pdfName);
  if (fs.existsSync(targetPath)) return true;

  const sources = [
    path.join(SOURCE_NOTES_DIR, dateStr, pdfName),
    path.join(SOURCE_ARXIV_DIR, arxivId, pdfName),
    path.join(PAPERS_DIR, dateStr, pdfName),
  ];

  for (const src of sources) {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, targetPath);
      console.log(`  [PDF]  ${path.relative(__dirname, targetPath)} ← ${path.relative(SOURCE_NOTES_DIR, src)}`);
      return true;
    }
  }
  return false;
}

function resolveReadLink(paper) {
  const { meta, body, dateStr, mdPath } = paper;
  const arxivId = extractArxivId(meta, body);
  const paperDir = path.dirname(mdPath);
  const relId = path.relative(PAPERS_DIR, mdPath).replace(/\\/g, '/').replace(/\.md$/, '');

  if (arxivId) {
    const hasLocal = copyPdfIfAvailable(arxivId, dateStr, paperDir);
    if (hasLocal) {
      return {
        type: 'pdf',
        url: `${arxivId}.pdf`,
        siteUrl: `papers/${relId.replace(/\/[^/]+$/, '')}/${arxivId}.pdf`,
        label: 'PDF ↗',
      };
    }
    return {
      type: 'arxiv-pdf',
      url: `https://arxiv.org/pdf/${arxivId}.pdf`,
      siteUrl: `https://arxiv.org/pdf/${arxivId}.pdf`,
      label: 'PDF ↗',
    };
  }

  if (meta.doi) {
    return {
      type: 'doi',
      url: `https://doi.org/${meta.doi}`,
      siteUrl: `https://doi.org/${meta.doi}`,
      label: 'DOI ↗',
    };
  }

  return null;
}

function readLinkEmbedHtml(readLink) {
  if (!readLink) return '';
  const cls = readLink.type === 'doi' ? 'paper-pdf-embed paper-pdf-embed--doi' : 'paper-pdf-embed';
  const icon = readLink.type === 'doi' ? '🔗' : '📄';
  const text = readLink.type === 'doi' ? '打开 DOI 链接' : '打开 PDF';
  return `<a href="${readLink.url}" class="${cls}" target="_blank" rel="noopener">${icon} ${text}</a>`;
}

// ── 1. YAML frontmatter 解析 ──────────────────────────────────────────
function parseFrontmatter(src) {
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { meta: {}, body: src };
  const rawYaml = match[1];
  const body = src.slice(match[0].length).trimStart();
  const meta = {};

  // 解析 tags（支持 [a,b,c] 和多行 - item 两种格式）
  const tagsInline = rawYaml.match(/^tags:\s*\[(.+)\]/m);
  const tagsBlock = rawYaml.match(/^tags:\s*\n((?:\s+-\s*.+\n?)+)/m);
  if (tagsInline) {
    meta.tags = tagsInline[1].split(',').map(t => t.trim().replace(/^['"]|['"]$/g, ''));
  } else if (tagsBlock) {
    meta.tags = tagsBlock[1].split('\n')
      .map(l => l.replace(/^\s*-\s*/, '').trim()).filter(Boolean);
  } else {
    meta.tags = [];
  }

  // 解析其余简单 key: value 字段
  const simpleFields = ['date', 'paper_title', 'venue', 'venue_grade', 'doi', 'arxiv'];
  for (const field of simpleFields) {
    const m = rawYaml.match(new RegExp(`^${field}:\\s*(.+?)\\s*$`, 'm'));
    if (!m) continue;
    const normalized = normalizeYamlValue(m[1]);
    if (normalized) meta[field] = normalized;
  }
  return { meta, body };
}

// ── 2. Markdown → HTML ────────────────────────────────────────────────
function mdToHtml(md, paperDir, readLink) {
  const lines = md.split(/\r?\n/);
  let html = '';
  let i = 0;

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function inlineToHtml(s) {
    // 解析 [[2026-06-04/xxx]] 和 [[xxx]] wikilinks
    s = s.replace(/\[\[([^\]]+)\]\]/g, (_, link) => {
      const parts = link.split('/');
      let href, label;
      if (parts.length >= 2) {
        // 跨日期链接 e.g. [[2026-06-04/01-BRDR-...]]
        const dateDir = parts[0];
        const name = parts[1];
        // 从 paperDir 计算相对路径
        const absTarget = path.join(PAPERS_DIR, dateDir, name + '.html');
        href = path.relative(paperDir, absTarget).replace(/\\/g, '/');
        label = name;
      } else {
        // 同日期链接 e.g. [[01-BRDR-...]]
        href = link + '.html';
        label = link;
      }
      return `<a href="${href}" class="wikilink">${escHtml(label)}</a>`;
    });
    // **bold**
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // *italic*
    s = s.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
    // `code`
    s = s.replace(/`([^`\n]+?)`/g, '<code>$1</code>');
    // [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    // 裸 URL 自动超链接（排除已在 href 属性内的）
    s = s.replace(/(?<!href=["'])(?<![">])(https?:\/\/[^\s<>"'\]|，。；]+)/g,
      '<a href="$1" target="_blank" rel="noopener">$1</a>');
    return s;
  }

  while (i < lines.length) {
    const line = lines[i];

    // 跳过 mermaid 代码块（mermaid.js 会接管）
    if (line.match(/^```mermaid/)) {
      let mermaidSrc = '';
      i++;
      while (i < lines.length && !lines[i].match(/^```/)) {
        mermaidSrc += escHtml(lines[i]) + '\n';
        i++;
      }
      i++; // skip closing ```
      html += `<div class="mermaid-wrap"><pre class="mermaid">${mermaidSrc}</pre></div>`;
      continue;
    }

    // 其他代码块
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

    // Obsidian PDF 嵌入：![[2407.01613.pdf]]
    const pdfEmbed = line.match(/^!\[\[(\d+\.\d+)\.pdf\]\]\s*$/);
    if (pdfEmbed) {
      html += `<div class="pdf-embed-wrap">${readLinkEmbedHtml(readLink)}</div>`;
      i++;
      continue;
    }

    // blockquote
    if (line.startsWith('> ')) {
      let bq = '';
      while (i < lines.length && lines[i].startsWith('> ')) {
        bq += inlineToHtml(escHtml(lines[i].slice(2))) + ' ';
        i++;
      }
      const bqText = bq.trim();
      if (bqText.includes('暂无本地 PDF') && readLink && readLink.type === 'doi') {
        html += `<div class="pdf-fallback"><p>${bqText}</p>${readLinkEmbedHtml(readLink)}</div>`;
      } else {
        html += `<blockquote>${bqText}</blockquote>`;
      }
      continue;
    }

    // 表格
    if (line.match(/^\|/) && i + 1 < lines.length && lines[i + 1].match(/^\|[-| :]+\|/)) {
      const headers = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
        .map(h => `<th>${inlineToHtml(h.trim())}</th>`).join('');
      i += 2; // skip separator
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

    // 标题
    const hMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = inlineToHtml(escHtml(hMatch[2]));
      const id = hMatch[2].replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '-');
      html += `<h${level} id="${id}">${text}</h${level}>`;
      i++;
      continue;
    }

    // 无序列表
    if (line.match(/^[-*]\s+/)) {
      let items = '';
      while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
        items += `<li>${inlineToHtml(escHtml(lines[i].replace(/^[-*]\s+/, '')))}</li>`;
        i++;
      }
      html += `<ul>${items}</ul>`;
      continue;
    }

    // 有序列表
    if (line.match(/^\d+\.\s+/)) {
      let items = '';
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        items += `<li>${inlineToHtml(escHtml(lines[i].replace(/^\d+\.\s+/, '')))}</li>`;
        i++;
      }
      html += `<ol>${items}</ol>`;
      continue;
    }

    // 水平线
    if (line.match(/^---+$/)) {
      html += '<hr>';
      i++;
      continue;
    }

    // 空行
    if (line.trim() === '') {
      i++;
      continue;
    }

    // 普通段落
    html += `<p>${inlineToHtml(escHtml(line))}</p>`;
    i++;
  }

  return html;
}

// ── 3. 生成单篇论文 HTML ──────────────────────────────────────────────
function venueGradeClass(grade) {
  if (!grade) return 'grade-default';
  const g = grade.toLowerCase();
  if (g.includes('ccf-a') || g.includes('顶会')) return 'grade-ccfa';
  if (g.includes('sci一区') || g.includes('sci 一区')) return 'grade-sci1';
  if (g.includes('sci')) return 'grade-sci';
  if (g.includes('预印本') || g.includes('arxiv')) return 'grade-preprint';
  return 'grade-default';
}

function gradeLabel(grade) {
  if (!grade) return '';
  const g = grade.toLowerCase();
  if (g.includes('ccf-a') || g.includes('顶会')) return 'CCF-A';
  if (g.includes('sci一区') || g.includes('sci 一区')) return 'SCI 一区';
  if (g.includes('sci')) return 'SCI';
  if (g.includes('预印本')) return '预印本';
  return grade;
}

function generatePaperHtml(paper, siblingPapers) {
  const { meta, bodyHtml, id, mdTitle } = paper;
  const hasMermaid = paper.hasMermaid;

  // 深度计算：papers/YYYY-MM-DD/xxx.html → ../../
  const cssPath = '../../style.css';
  const knowledgePath = '../../knowledge.html';

  const readLink = paper.readLink;
  const mainReadBtn = readLink
    ? `<a href="${readLink.url}" target="_blank" rel="noopener" class="paper-read-link paper-read-link--${readLink.type}">${readLink.label}</a>`
    : '';

  const doiLink = meta.doi
    ? `<a href="https://doi.org/${meta.doi}" target="_blank" rel="noopener" class="paper-ext-link">DOI ↗</a>`
    : '';
  const arxivLink = meta.arxiv
    ? `<a href="https://arxiv.org/abs/${meta.arxiv}" target="_blank" rel="noopener" class="paper-ext-link">arXiv ↗</a>`
    : '';

  // 同日期其他论文导航
  const siblings = siblingPapers
    .filter(p => p.id !== id)
    .map(p => {
      const name = p.id.split('/')[1];
      return `<a href="${name}.html" class="sibling-link">${p.shortTitle || name}</a>`;
    }).join('');

  const siblingsHtml = siblings
    ? `<div class="siblings-nav"><span class="siblings-label">同日其他论文：</span>${siblings}</div>`
    : '';

  const tagHtml = (meta.tags || [])
    .filter(t => !['AI', 'PINN', '论文汇报', '论文日报'].includes(t))
    .map(t => `<span class="paper-tag">${t}</span>`).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.paper_title || mdTitle} · 论文笔记</title>
  <link rel="stylesheet" href="${cssPath}" />
  <link rel="preconnect" href="https://fonts.googleapis.cn" crossorigin />
  <link href="https://fonts.googleapis.cn/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
  ${hasMermaid ? '<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>' : ''}
  <style>
    .paper-back { display:inline-flex; align-items:center; gap:6px; color:var(--text-muted); font-size:.85rem; margin-bottom:32px; transition:color var(--transition); }
    .paper-back:hover { color:var(--accent); }
    .paper-meta-bar { display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin:20px 0 28px; }
    .paper-read-link { font-size:.85rem; font-weight:600; padding:8px 18px; border-radius:6px; transition:var(--transition); }
    .paper-read-link--pdf, .paper-read-link--arxiv-pdf { background:var(--accent); color:var(--bg); border:1px solid var(--accent); }
    .paper-read-link--pdf:hover, .paper-read-link--arxiv-pdf:hover { filter:brightness(1.08); box-shadow:0 4px 16px rgba(212,168,83,.3); }
    .paper-read-link--doi { background:transparent; color:var(--accent); border:1px solid rgba(212,168,83,.4); }
    .paper-read-link--doi:hover { background:var(--accent); color:var(--bg); }
    .paper-ext-link { font-size:.8rem; padding:4px 12px; border:1px solid var(--border); border-radius:4px; color:var(--accent); transition:var(--transition); }
    .paper-ext-link:hover { background:var(--accent); color:var(--bg); }
    .pdf-embed-wrap { margin:12px 0 20px; }
    .paper-pdf-embed { display:inline-flex; align-items:center; gap:6px; font-size:.88rem; font-weight:500; padding:10px 20px; background:var(--accent-dim); border:1px solid rgba(212,168,83,.35); border-radius:8px; color:var(--accent); transition:var(--transition); }
    .paper-pdf-embed:hover { background:var(--accent); color:var(--bg); }
    .paper-pdf-embed--doi { background:rgba(139,149,168,.1); border-color:var(--border-planned); color:var(--text-muted); }
    .paper-pdf-embed--doi:hover { background:var(--accent-dim); color:var(--accent); }
    .pdf-fallback { background:var(--bg-3); border-left:3px solid var(--border-planned); padding:12px 16px; margin:16px 0; border-radius:0 8px 8px 0; }
    .pdf-fallback p { color:var(--text-faint); font-size:.88rem; margin-bottom:10px; }
    .paper-tags { display:flex; flex-wrap:wrap; gap:8px; margin:16px 0 32px; }
    .paper-tag { font-size:.72rem; padding:3px 10px; border-radius:4px; background:var(--bg-3); color:var(--text-muted); border:1px solid rgba(255,255,255,.06); }
    .paper-body h2 { font-family:var(--font-display); font-size:1.15rem; font-weight:600; margin:40px 0 14px; padding-bottom:8px; border-bottom:1px solid var(--border); color:var(--text); }
    .paper-body h3 { font-size:1rem; font-weight:600; margin:24px 0 10px; color:var(--accent); }
    .paper-body h4 { font-size:.92rem; font-weight:600; margin:18px 0 8px; color:var(--text-muted); }
    .paper-body p { color:var(--text-muted); line-height:1.8; margin-bottom:12px; font-size:.93rem; }
    .paper-body ul, .paper-body ol { color:var(--text-muted); font-size:.93rem; line-height:1.8; padding-left:22px; margin-bottom:14px; }
    .paper-body li { margin-bottom:6px; }
    .paper-body blockquote { border-left:3px solid var(--accent); padding:8px 16px; margin:16px 0; color:var(--text-muted); font-size:.9rem; background:var(--bg-3); border-radius:0 6px 6px 0; }
    .paper-body hr { border:none; border-top:1px solid var(--border); margin:32px 0; }
    .paper-body code { font-size:.85em; background:var(--bg-3); padding:2px 6px; border-radius:3px; color:var(--accent); }
    .paper-body pre.code-block { background:var(--bg-3); border:1px solid var(--border); border-radius:8px; padding:16px; font-size:.82rem; overflow-x:auto; margin-bottom:16px; }
    .paper-body .wikilink { color:var(--accent); text-decoration:underline; text-underline-offset:3px; }
    .paper-body .wikilink:hover { color:#e8c47a; }
    .table-wrap { overflow-x:auto; margin-bottom:20px; }
    .table-wrap table { width:100%; border-collapse:collapse; font-size:.88rem; }
    .table-wrap th { background:var(--bg-3); color:var(--accent); padding:10px 14px; text-align:left; border-bottom:1px solid var(--border); }
    .table-wrap td { color:var(--text-muted); padding:9px 14px; border-bottom:1px solid rgba(255,255,255,.04); }
    .table-wrap tr:hover td { background:rgba(212,168,83,.04); }
    .mermaid-wrap { margin:20px 0; background:var(--bg-3); border-radius:10px; padding:16px; border:1px solid var(--border); overflow-x:auto; }
    .mermaid-wrap pre { background:none; border:none; padding:0; }
    .siblings-nav { margin-top:40px; padding-top:24px; border-top:1px solid var(--border); display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
    .siblings-label { font-size:.78rem; color:var(--text-faint); margin-right:4px; }
    .sibling-link { font-size:.8rem; padding:4px 12px; border:1px solid var(--border); border-radius:4px; color:var(--text-muted); transition:var(--transition); }
    .sibling-link:hover { border-color:var(--accent); color:var(--accent); }
    .grade-ccfa { background:var(--accent-dim); color:var(--accent); border-color:rgba(212,168,83,.3); }
    .grade-sci1 { background:var(--success-dim); color:var(--success); border-color:rgba(61,158,143,.3); }
    .grade-sci, .grade-preprint, .grade-default { background:rgba(139,149,168,.1); color:var(--text-muted); border-color:var(--border-planned); }
    .paper-page { max-width:820px; margin:0 auto; padding:100px 24px 80px; position:relative; z-index:1; }
    .paper-en-title { font-size:.88rem; color:var(--text-faint); margin-bottom:6px; line-height:1.5; }
    .paper-zh-title { font-family:var(--font-display); font-size:clamp(1.4rem,3vw,2rem); font-weight:700; letter-spacing:-.02em; line-height:1.25; margin-bottom:0; }
  </style>
</head>
<body>
  <div class="noise-overlay" aria-hidden="true"></div>
  <div class="grid-overlay" aria-hidden="true"></div>

  <nav class="navbar scrolled">
    <div class="nav-container">
      <a href="../../index.html" class="nav-logo">Research<span class="dot">.</span></a>
      <ul class="nav-links">
        <li><a href="../../index.html">主页</a></li>
        <li><a href="${knowledgePath}">知识库</a></li>
      </ul>
    </div>
  </nav>

  <main class="paper-page">
    <a href="${knowledgePath}" class="paper-back">← 返回知识库</a>

    <p class="paper-en-title">${meta.paper_title ? meta.paper_title : ''}</p>
    <h1 class="paper-zh-title">${mdTitle}</h1>

    <div class="paper-meta-bar">
      ${mainReadBtn}
      ${meta.venue_grade ? `<span class="status-badge ${venueGradeClass(meta.venue_grade)}">${gradeLabel(meta.venue_grade)}</span>` : ''}
      ${meta.venue ? `<span style="font-size:.88rem;color:var(--text-muted)">${meta.venue}</span>` : ''}
      ${meta.date ? `<span style="font-size:.78rem;color:var(--text-faint)">${meta.date}</span>` : ''}
      ${doiLink}
      ${arxivLink}
    </div>

    ${tagHtml ? `<div class="paper-tags">${tagHtml}</div>` : ''}

    <div class="paper-body">
      ${bodyHtml}
    </div>

    ${siblingsHtml}
  </main>

  ${hasMermaid ? '<script>mermaid.initialize({startOnLoad:true,theme:"dark",themeVariables:{primaryColor:"#d4a853",primaryTextColor:"#e8e4dc",primaryBorderColor:"#d4a853",lineColor:"#8b95a8",sectionBkgColor:"#1a2235",altSectionBkgColor:"#141c2e",gridColor:"rgba(212,168,83,0.1)",titleColor:"#d4a853",edgeLabelBackground:"#1a2235",tertiaryColor:"#1a2235"}});</script>' : ''}
  <script>
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  </script>
</body>
</html>`;
}

// ── 4. 递归扫描 MD 文件 ────────────────────────────────────────────────
function scanMdFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...scanMdFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.startsWith('_')) {
      results.push(full);
    }
  }
  return results;
}

// ── 5. 主构建流程 ──────────────────────────────────────────────────────
function build() {
  if (!fs.existsSync(PAPERS_DIR)) {
    console.error(`[错误] 目录不存在：${PAPERS_DIR}`);
    console.error('请先把论文 MD 文件复制到 papers/ 目录');
    process.exit(1);
  }

  const mdFiles = scanMdFiles(PAPERS_DIR).sort();
  console.log(`找到 ${mdFiles.length} 篇论文 MD 文件`);

  const allPapers = [];

  // 第一遍：解析所有 meta，建立 id → shortTitle 映射
  for (const mdPath of mdFiles) {
    const src = fs.readFileSync(mdPath, 'utf-8');
    const { meta, body } = parseFrontmatter(src);
    const rel = path.relative(PAPERS_DIR, mdPath);
    const id = rel.replace(/\\/g, '/').replace(/\.md$/, '');
    const parts = id.split('/');
    const dateStr = parts[0];
    const fileName = parts[1] || '';
    // H1 标题作为中文简称
    const h1 = body.match(/^#\s+(.+)/m);
    const mdTitle = h1 ? h1[1] : fileName;
    const shortTitle = fileName.replace(/^\d+-/, '').split('-').slice(0, 2).join('-');
    const hasMermaid = body.includes('```mermaid');

    allPapers.push({
      id, dateStr, fileName, mdPath,
      meta, body, mdTitle, shortTitle, hasMermaid,
      htmlPath: `papers/${id}.html`
    });
  }

  // 按日期倒序排
  allPapers.sort((a, b) => b.dateStr.localeCompare(a.dateStr) || a.id.localeCompare(b.id));

  // 建立 date → siblings 映射
  const byDate = {};
  for (const p of allPapers) {
    (byDate[p.dateStr] = byDate[p.dateStr] || []).push(p);
  }

  let generated = 0;

  // 第二遍：解析 readLink + 生成每篇 HTML
  for (const paper of allPapers) {
    paper.readLink = resolveReadLink(paper);
    const paperDir = path.dirname(paper.mdPath);
    const bodyHtml = mdToHtml(paper.body, paperDir, paper.readLink);
    paper.bodyHtml = bodyHtml;

    const siblings = byDate[paper.dateStr] || [];
    const html = generatePaperHtml(paper, siblings);
    const htmlOut = paper.mdPath.replace(/\.md$/, '.html');
    fs.writeFileSync(htmlOut, html, 'utf-8');
    generated++;
    console.log(`  [生成] ${path.relative(__dirname, htmlOut)}`);
  }

  // 生成 papers.json
  const jsonData = {
    generated: new Date().toISOString().slice(0, 10),
    total: allPapers.length,
    papers: allPapers.map(p => ({
      id: p.id,
      date: p.dateStr,
      title: p.meta.paper_title || p.mdTitle,
      zhTitle: p.mdTitle,
      venue: p.meta.venue || '',
      venue_grade: p.meta.venue_grade || '',
      doi: p.meta.doi || '',
      arxiv: p.meta.arxiv || '',
      tags: (p.meta.tags || []).filter(t => !['AI', 'PINN', '论文汇报', '论文日报'].includes(t)),
      htmlPath: p.htmlPath,
      readLink: p.readLink ? {
        type: p.readLink.type,
        url: p.readLink.siteUrl,
        label: p.readLink.label,
      } : null,
    }))
  };

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(jsonData, null, 2), 'utf-8');
  console.log(`\n✓ 生成论文 HTML：${generated} 篇`);
  console.log(`✓ 生成 papers.json：${allPapers.length} 条记录`);
  console.log('\n完成！运行 npx serve . 预览，然后 git add . && git push 推送到 GitHub Pages。');
}

build();
