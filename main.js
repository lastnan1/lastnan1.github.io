const STATUS_LABELS = {
  'planned': '规划中',
  'in-progress': '进行中',
  'completed': '已完成',
  'paused': '暂停'
};

const MILESTONE_ICONS = {
  done: '✓',
  'in-progress': '◉',
  pending: '○'
};

async function init() {
  try {
    const res = await fetch('experiments.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    populateProfile(data.profile);
    renderSummary(data.profile, data.experiments);
    renderExperiments(data.experiments);
    setupObservers();
  } catch (err) {
    document.getElementById('experimentGrid').innerHTML =
      `<p class="load-error">无法加载实验数据。请通过 HTTP 服务器访问（如 <code>npx serve .</code>），不要直接双击打开 HTML 文件。</p>`;
    console.error(err);
  }
}

function populateProfile(profile) {
  document.getElementById('heroName').textContent = profile.name;
  document.getElementById('heroSubtitle').textContent = profile.subtitle;
  document.getElementById('footerName').textContent = profile.name;
  document.title = `${profile.name} · 研究实验进度`;

  const aboutLinks = document.getElementById('aboutLinks');
  aboutLinks.innerHTML = `
    <a href="mailto:${profile.email}" class="about-link">📧 ${profile.email}</a>
    <a href="${profile.github}" target="_blank" rel="noopener" class="about-link">📂 GitHub</a>
  `;

  const footerLinks = document.getElementById('footerLinks');
  footerLinks.innerHTML = `
    <a href="${profile.github}" target="_blank" rel="noopener">GitHub</a>
    <a href="mailto:${profile.email}">邮箱</a>
  `;
}

function renderSummary(profile, experiments) {
  const total = experiments.length;
  const active = experiments.filter(e => e.status === 'in-progress').length;
  const completed = experiments.filter(e => e.status === 'completed').length;

  document.getElementById('summaryStrip').innerHTML = `
    <div class="summary-item">
      <span class="summary-value">${total}</span>
      <span class="summary-label">实验总数</span>
    </div>
    <div class="summary-divider"></div>
    <div class="summary-item">
      <span class="summary-value">${active}</span>
      <span class="summary-label">进行中</span>
    </div>
    <div class="summary-divider"></div>
    <div class="summary-item">
      <span class="summary-value">${completed}</span>
      <span class="summary-label">已完成</span>
    </div>
    <div class="summary-divider"></div>
    <div class="summary-item summary-item--date">
      <span class="summary-value summary-value--sm">${profile.siteLastUpdated}</span>
      <span class="summary-label">网站更新</span>
    </div>
  `;
}

function renderExperiments(experiments) {
  const sorted = [...experiments].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  const grid = document.getElementById('experimentGrid');
  grid.innerHTML = sorted.map((exp, i) => createExperimentCard(exp, i)).join('');
}

function createExperimentCard(exp, index) {
  const featured = exp.featured ? ' experiment-card--featured' : '';
  const planned = exp.status === 'planned' ? ' experiment-card--planned' : '';
  const highlights = exp.highlights?.length
    ? `<ul class="experiment-highlights">${exp.highlights.map(h => `<li>${h}</li>`).join('')}</ul>`
    : '';
  const tags = exp.tags?.length
    ? `<div class="experiment-tags">${exp.tags.map(t => `<span>${t}</span>`).join('')}</div>`
    : '';
  const links = exp.links?.github
    ? `<a href="${exp.links.github}" target="_blank" rel="noopener" class="experiment-link" title="GitHub">GitHub ↗</a>`
    : '';

  return `
    <article class="experiment-card${featured}${planned}" data-delay="${index * 80}" data-id="${exp.id}">
      <div class="experiment-card-header">
        <span class="status-badge status-badge--${exp.status}">${STATUS_LABELS[exp.status] || exp.status}</span>
        <span class="experiment-date">更新于 ${exp.lastUpdated}</span>
      </div>
      <h3 class="experiment-title">${exp.title}</h3>
      <p class="experiment-summary">${exp.summary}</p>
      ${highlights}
      <div class="progress-wrap">
        <div class="progress-meta">
          <span class="progress-label">整体进度</span>
          <span class="progress-pct">${exp.progress}%</span>
        </div>
        <div class="progress-bar" role="progressbar" aria-valuenow="${exp.progress}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-fill" style="width: ${exp.progress}%"></div>
        </div>
      </div>
      <div class="milestone-track">
        ${exp.milestones.map((m, i) => `
          <div class="milestone-step milestone-step--${m.status}" style="--step-delay: ${i * 0.1}s">
            <span class="milestone-icon">${MILESTONE_ICONS[m.status]}</span>
            <span class="milestone-label">${m.label}</span>
          </div>
        `).join('')}
      </div>
      <div class="experiment-footer">
        ${tags}
        ${links}
      </div>
    </article>
  `;
}

function setupObservers() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.experiment-card').forEach(el => observer.observe(el));
}

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  let current = '';
  document.querySelectorAll('section[id]').forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

init();
