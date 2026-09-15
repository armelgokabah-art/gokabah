/**
 * PORTFOLIO GOK ABAH ARMEL RODRIGUE — MOTEUR INTERACTIF (2026)
 * Fonctions : Filtres dynamiques, Moteur de recherche live, Stats calculées,
 * Gestionnaire WhatsApp & Presse-papier, Menu mobile & Observateur de défilement.
 */

// ==========================================================================
// 1. DONNÉES DU PORTFOLIO (SKILLS & PROJETS)
// ==========================================================================
const skillsData = [
  { name: 'Java', level: 5, category: 'dev', tag: 'Développement logiciel & POO' },
  { name: 'SQL & Bases de données / UML', level: 5, category: 'dev', tag: 'Modélisation relationnelle & Schémas' },
  { name: 'Analyse Informatique & Conception', level: 4, category: 'dev', tag: 'Analyse des flux & Cahier des charges' },
  { name: 'Algorithmique & POO', level: 4, category: 'dev', tag: 'Structures de données & Logique' },
  { name: 'Gestion de Projet & Méthodes', level: 4, category: 'infra', tag: 'Diagrammes Gantt, MS Project, WBS' },
  { name: 'Réseaux Informatiques (OSI / TCP-IP)', level: 4, category: 'infra', tag: 'Adressage IP, Sous-réseaux, Routage' },
  { name: 'HTML5 / CSS3 / UI Design', level: 4, category: 'dev', tag: 'Interfaces responsives & Ergonomie UI/UX' },
  { name: 'Langage C', level: 3, category: 'dev', tag: 'Programmation bas niveau & Pointeurs' },
  { name: 'Outils & Simulation Réseau', level: 4, category: 'infra', tag: 'Cisco Packet Tracer · Wireshark · NetAcad' },
  { name: 'IDE & Gestion de Version', level: 4, category: 'infra', tag: 'IntelliJ IDEA · VS Code · Git / GitHub' },
  { name: 'Logique Combinatoire & Séquentielle', level: 3, category: 'infra', tag: 'Portes logiques & Électronique numérique' }
];

const projectsData = [
  {
    title: 'Gestion Semence, Parcelle & Culture',
    code: 'PROJ-AGRI-01 // GestionSemenceParcelleCulture',
    domain: 'Informatique de Gestion & Base de données',
    tech: 'Java SE · SGBD SQL · Architecture MVC · JDBC',
    year: '2025–2026',
    status: 'completed',
    statusLabel: 'Finalisé',
    github: 'https://github.com/armelgokabah-art'
  },
  {
    title: 'Projet Piscine — Analyse & POO',
    code: 'PROJ-POOL-02 // ARMEL PROJET PISCINE',
    domain: 'Programmation Orientée Objet & Modélisation',
    tech: 'Java · POO Fondamentale · Analyse Fonctionnelle',
    year: '2024–2025',
    status: 'completed',
    statusLabel: 'Finalisé',
    github: 'https://github.com/armelgokabah-art'
  },
  {
    title: 'Planification & Gestion de Projet',
    code: 'PROJ-GANTT-03 // GESTION DES PROJETS',
    domain: 'Management de Projet & Optimisation',
    tech: 'Diagrammes de Gantt · GanttProject · MS Project',
    year: '2024–2025',
    status: 'completed',
    statusLabel: 'Finalisé',
    github: 'https://github.com/armelgokabah-art'
  }
];

// ==========================================================================
// 2. UTILITAIRES & SÉCURITÉ
// ==========================================================================
const escapeHtml = (str) => {
  return String(str).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
};

// Affichage d'un Toast / Notification flottante
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('is-active');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('is-active');
  }, 3200);
}

// ==========================================================================
// 3. RENDU DES COMPÉTENCES
// ==========================================================================
const skillsGrid = document.getElementById('skills-grid');
const skillCountBadge = document.getElementById('skill-count');

function renderSkills(filterType = 'all') {
  if (!skillsGrid) return;

  const filtered = skillsData.filter((skill) => {
    if (filterType === 'all') return true;
    if (filterType === 'top') return skill.level === 5;
    if (filterType === 'high') return skill.level >= 4;
    if (filterType === 'dev') return skill.category === 'dev';
    if (filterType === 'infra') return skill.category === 'infra';
    return true;
  });

  if (skillCountBadge) {
    skillCountBadge.textContent = filtered.length;
  }

  skillsGrid.innerHTML = filtered.map((skill) => {
    const percent = skill.level * 20;
    return `
      <article class="skill-card">
        <div class="skill-top">
          <h3 class="skill-name">${escapeHtml(skill.name)}</h3>
          <span class="skill-level">${skill.level}/5</span>
        </div>
        <div class="skill-bar" role="progressbar" aria-valuenow="${skill.level}" aria-valuemin="1" aria-valuemax="5" aria-label="Niveau de ${escapeHtml(skill.name)}">
          <div class="skill-bar-fill" style="width: ${percent}%;"></div>
        </div>
        <div class="skill-meta">
          <span class="skill-tag">${escapeHtml(skill.tag)}</span>
          <span class="skill-badge">${skill.category === 'dev' ? '&lt;/&gt; Code' : '&#9881; Système'}</span>
        </div>
      </article>
    `;
  }).join('');
}

// ==========================================================================
// 4. RENDU DES PROJETS & RECHERCHE
// ==========================================================================
const projectsList = document.getElementById('projects-list');
const projectSearchInput = document.getElementById('project-search');
const clearSearchBtn = document.getElementById('clear-search');
let activeProjectFilter = 'all';

function updateProjectCounts() {
  const allCount = projectsData.length;
  const completedCount = projectsData.filter(p => p.status === 'completed').length;
  const progressCount = projectsData.filter(p => p.status === 'progress').length;

  const countAll = document.getElementById('project-count-all');
  const countComp = document.getElementById('project-count-completed');
  const countProg = document.getElementById('project-count-progress');

  if (countAll) countAll.textContent = allCount;
  if (countComp) countComp.textContent = completedCount;
  if (countProg) countProg.textContent = progressCount;
}

function renderProjects(filter = activeProjectFilter, searchQuery = '') {
  if (!projectsList) return;

  const query = searchQuery.trim().toLowerCase();
  
  const filtered = projectsData.filter((project) => {
    const matchesFilter = (filter === 'all') || (project.status === filter);
    const matchesSearch = !query || 
      `${project.title} ${project.code} ${project.domain} ${project.tech}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  if (clearSearchBtn) {
    clearSearchBtn.style.display = query.length > 0 ? 'block' : 'none';
  }

  if (filtered.length === 0) {
    projectsList.innerHTML = `
      <div class="empty-state">
        <p>Aucun projet ne correspond à votre recherche "<strong>${escapeHtml(searchQuery)}</strong>".</p>
      </div>
    `;
    return;
  }

  projectsList.innerHTML = filtered.map((project, index) => {
    const idxFormatted = String(index + 1).padStart(2, '0');
    return `
      <article class="project-card">
        <span class="project-index">[${idxFormatted}]</span>
        
        <div class="project-info">
          <h3 class="project-title">${escapeHtml(project.title)}</h3>
          <span class="project-code">${escapeHtml(project.code)}</span>
        </div>

        <div class="project-specs">
          <span class="project-domain">${escapeHtml(project.domain)}</span>
          <span class="project-tech">${escapeHtml(project.tech)}</span>
        </div>

        <div class="project-meta-actions">
          <span class="project-status-tag ${project.status === 'progress' ? 'progress' : ''}">
            ${escapeHtml(project.statusLabel)}
          </span>
          <span class="project-year">${escapeHtml(project.year)}</span>
          <a class="project-link-btn" href="${project.github}" target="_blank" rel="noopener noreferrer" title="Consulter le code sur GitHub">
            <span>Code</span> &nearr;
          </a>
        </div>
      </article>
    `;
  }).join('');
}

// ==========================================================================
// 5. RENDU DES STATISTIQUES & TOP COMPÉTENCES
// ==========================================================================
function renderStats() {
  const statsMain = document.getElementById('stats-main');
  const topSkillsList = document.getElementById('top-skills-list');

  if (statsMain) {
    const totalSkills = skillsData.length;
    const avgScore = (skillsData.reduce((acc, s) => acc + s.level, 0) / totalSkills).toFixed(1);
    const completedProjects = projectsData.filter(p => p.status === 'completed').length;
    const completionRate = projectsData.length ? Math.round((completedProjects / projectsData.length) * 100) : 100;

    statsMain.innerHTML = `
      <div class="stat-card">
        <span class="stat-label">Technologies Référencées</span>
        <div class="stat-value">${totalSkills}</div>
        <span class="stat-detail">Stack logicielle &amp; modélisation</span>
      </div>

      <div class="stat-card">
        <span class="stat-label">Moyenne Technique</span>
        <div class="stat-value">${avgScore}<small>/5</small></div>
        <span class="stat-detail">Évaluation globale des acquis</span>
      </div>

      <div class="stat-card">
        <span class="stat-label">Projets Conduits</span>
        <div class="stat-value">${projectsData.length}</div>
        <span class="stat-detail">${completedProjects} livrés avec succès</span>
      </div>

      <div class="stat-card">
        <span class="stat-label">Taux d'Achèvement</span>
        <div class="stat-value">${completionRate}<small>%</small></div>
        <span class="stat-detail">Projets validés &amp; documentés</span>
      </div>
    `;
  }

  if (topSkillsList) {
    // Trier par note décroissante et prendre les 3 meilleurs
    const topSkills = [...skillsData].sort((a, b) => b.level - a.level).slice(0, 3);

    topSkillsList.innerHTML = topSkills.map((skill, i) => `
      <div class="top-skill-item">
        <span class="top-rank">0${i + 1}</span>
        <div class="top-info">
          <strong>${escapeHtml(skill.name)}</strong>
          <small>${escapeHtml(skill.tag)}</small>
        </div>
        <span class="top-score-badge">${skill.level}/5</span>
      </div>
    `).join('');
  }
}

// ==========================================================================
// 6. ÉVÉNEMENTS & INITIALISATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Rendu initial
  renderSkills();
  updateProjectCounts();
  renderProjects();
  renderStats();

  // 2. Gestion des filtres de compétences
  const skillFilters = document.getElementById('skill-filters');
  if (skillFilters) {
    skillFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-skill-filter]');
      if (!btn) return;

      skillFilters.querySelectorAll('.filter-button').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderSkills(btn.dataset.skillFilter);
    });
  }

  // 3. Gestion des filtres de projets
  const projectFilters = document.getElementById('project-filters');
  if (projectFilters) {
    projectFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-project-filter]');
      if (!btn) return;

      projectFilters.querySelectorAll('.filter-button').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeProjectFilter = btn.dataset.projectFilter;
      renderProjects(activeProjectFilter, projectSearchInput ? projectSearchInput.value : '');
    });
  }

  // 4. Recherche en direct sur les projets
  if (projectSearchInput) {
    projectSearchInput.addEventListener('input', (e) => {
      renderProjects(activeProjectFilter, e.target.value);
    });
  }

  if (clearSearchBtn && projectSearchInput) {
    clearSearchBtn.addEventListener('click', () => {
      projectSearchInput.value = '';
      renderProjects(activeProjectFilter, '');
      projectSearchInput.focus();
    });
  }

  // 5. Copie du numéro de téléphone (WhatsApp & Appel)
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Numéro ${textToCopy} copié dans le presse-papier !`);
      } catch (err) {
        showToast(`Numéro : ${textToCopy}`);
      }
    });
  });

  // 6. Menu Mobile Burger
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fermer le menu lors du clic sur un lien
    mainNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 7. Observateur de défilement (Scrollspy pour la barre de navigation)
  const navLinks = Array.from(document.querySelectorAll('.main-nav .nav-link'));
  const sections = Array.from(document.querySelectorAll('main section[id]'));

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            link.classList.toggle('is-active', href === `#${currentId}`);
          });
        }
      });
    }, {
      rootMargin: '-25% 0px -60% 0px',
      threshold: 0.1
    });

    sections.forEach((section) => observer.observe(section));
  }
});
