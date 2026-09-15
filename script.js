const skills = [
  { name: 'Java', level: 5, tag: 'Développement logiciel' },
  { name: 'SQL & Bases de données / UML', level: 5, tag: 'Données & modélisation' },
  { name: 'Analyse Informatique & Modélisation', level: 4, tag: 'Analyse fonctionnelle' },
  { name: 'Algorithmique & POO', level: 4, tag: 'Fondamentaux du code' },
  { name: 'Gestion de Projet & Gantt', level: 4, tag: 'Organisation' },
  { name: 'Réseaux Informatiques / OSI / TCP-IP', level: 4, tag: 'Infrastructure' },
  { name: 'HTML / CSS', level: 4, tag: 'Interface web' },
  { name: 'C', level: 3, tag: 'Programmation' },
  { name: 'Outils Réseau', level: 4, tag: 'Cisco Packet Tracer · Wireshark · NetAcad' },
  { name: 'IDE & Git', level: 4, tag: 'VS Code · IntelliJ · GitHub · GitLab' },
  { name: 'Logique Combinatoire & Séquentielle', level: 3, tag: 'Électronique numérique' }
];

const projects = [
  { title: 'Gestion Semence, Parcelle & Culture', code: 'GestionSemenceParcelleCulture', domain: 'Informatique de Gestion / Base de données', tech: 'Java & Base de données SQL', year: '2025–2026', status: 'completed', statusLabel: 'Terminé', github: 'https://github.com/armelgokabah-art' },
  { title: 'Projet Piscine', code: 'ARMEL PROJET PISCINE', domain: 'Programmation Orientée Objet & Analyse', tech: 'Langage Orienté Objet / Analyse de données', year: '2024–2025', status: 'completed', statusLabel: 'Terminé', github: 'https://github.com/armelgokabah-art' },
  { title: 'Planification & Gestion de Projet', code: 'projet gantt / GESTION DES PROJETS', domain: 'Gestion de projet', tech: 'Diagramme de Gantt, MS Project, GanttProject', year: '2024–2025', status: 'completed', statusLabel: 'Terminé', github: 'https://github.com/armelgokabah-art' }
];

const skillsGrid = document.querySelector('#skills-grid');
const projectsList = document.querySelector('#projects-list');
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

function renderSkills(filter = 'all') {
  const visibleSkills = skills.filter((skill) => filter === 'all' || (filter === 'high' && skill.level >= 4) || (filter === 'top' && skill.level === 5));
  skillsGrid.innerHTML = visibleSkills.map((skill) => `<article class="skill-card"><div class="skill-top"><span class="skill-name">${escapeHtml(skill.name)}</span><span class="skill-level">${skill.level}/5</span></div><div class="skill-bar" aria-label="Niveau ${skill.level} sur 5"><span style="--level:${skill.level}"></span></div><small class="skill-tag">${escapeHtml(skill.tag)}</small></article>`).join('');
  document.querySelector('#skill-count').textContent = visibleSkills.length;
}

function renderProjects(filter = 'all', query = '') {
  const normalizedQuery = query.trim().toLowerCase();
  const visibleProjects = projects.filter((project) => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = !normalizedQuery || `${project.title} ${project.code} ${project.domain} ${project.tech}`.toLowerCase().includes(normalizedQuery);
    return matchesFilter && matchesSearch;
  });
  projectsList.innerHTML = visibleProjects.length ? visibleProjects.map((project, index) => `<article class="project-card"><span class="project-index">0${index + 1}</span><div><h3 class="project-title">${escapeHtml(project.title)}</h3><span class="project-code">${escapeHtml(project.code)}</span></div><div><div class="project-domain">${escapeHtml(project.domain)}</div><div class="project-tech">${escapeHtml(project.tech)}</div></div><div class="project-status"><span class="status ${project.status === 'progress' ? 'progress' : ''}">${escapeHtml(project.statusLabel)}</span><div class="project-year">${escapeHtml(project.year)}</div><a class="project-github" href="${project.github}" target="_blank" rel="noreferrer">GitHub ↗</a></div></article>`).join('') : '<p class="empty-state">Aucun projet ne correspond à cette recherche.</p>';
}

function renderStats() {
  const average = (skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length).toFixed(1);
  const completed = projects.filter((project) => project.status === 'completed').length;
  const progress = projects.filter((project) => project.status === 'progress').length;
  const completionRate = Math.round((completed / projects.length) * 100);
  document.querySelector('#stats-main').innerHTML = `<div class="stat-card"><span class="stat-label">Technologies / compétences</span><div class="stat-value">${skills.length}</div><span class="stat-detail">référencées dans le profil</span></div><div class="stat-card"><span class="stat-label">Niveau moyen déclaré</span><div class="stat-value">${average}<small>/5</small></div><span class="stat-detail">sur l'ensemble des compétences</span></div><div class="stat-card"><span class="stat-label">Projets référencés</span><div class="stat-value">${projects.length}</div><span class="stat-detail">${completed} terminés · ${progress} en cours</span></div><div class="stat-card"><span class="stat-label">Taux de projets terminés</span><div class="stat-value">${completionRate}<small>%</small></div><span class="stat-detail">projets finalisés</span></div>`;
  const topSkills = [...skills].sort((a, b) => b.level - a.level).slice(0, 3);
  document.querySelector('#top-skills-list').innerHTML = topSkills.map((skill, index) => `<div class="top-skill"><span class="rank">0${index + 1}</span><div><strong>${escapeHtml(skill.name)}</strong><small>${escapeHtml(skill.tag)}</small></div><span class="top-score">${skill.level}/5</span></div>`).join('');
}

document.querySelector('#skill-filters').addEventListener('click', (event) => { const button = event.target.closest('[data-skill-filter]'); if (!button) return; document.querySelectorAll('#skill-filters .filter-button').forEach((item) => item.classList.remove('is-active')); button.classList.add('is-active'); renderSkills(button.dataset.skillFilter); });
let activeProjectFilter = 'all';
document.querySelector('#project-filters').addEventListener('click', (event) => { const button = event.target.closest('[data-project-filter]'); if (!button) return; activeProjectFilter = button.dataset.projectFilter; document.querySelectorAll('#project-filters .filter-button').forEach((item) => item.classList.remove('is-active')); button.classList.add('is-active'); renderProjects(activeProjectFilter, document.querySelector('#project-search').value); });
document.querySelector('#project-search').addEventListener('input', (event) => renderProjects(activeProjectFilter, event.target.value));

document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', () => document.querySelector('#main-nav').classList.remove('is-open')));
document.querySelector('.menu-toggle').addEventListener('click', (event) => { const menu = document.querySelector('#main-nav'); const isOpen = menu.classList.toggle('is-open'); event.currentTarget.setAttribute('aria-expanded', String(isOpen)); });
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`)); } }), { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => observer.observe(section));
renderSkills(); renderProjects(); renderStats();
