// Theme toggle function
function toggleTheme() {
  const root = document.documentElement;
  const currentTheme = root.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', newTheme);
  
  // Update logo source based on theme
  const logo = document.querySelector('.logo-svg');
  if (!logo.classList.contains('active')) {
    logo.src = `src/assets/logo-${newTheme === 'light' ? 'black' : 'white'}.svg`;
  }
}

// Toggle mobile menu
function toggleMobileMenu() {
  const menuRight = document.querySelector('.menu-right');
  menuRight.classList.toggle('active');
}

// Import projects data
import { projects } from './data/projects.js';

// Get unique tags from projects
function getUniqueTags() {
  const tags = new Set();
  projects.forEach(project => {
    project.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

// Filter projects by tag and search term
function filterProjects(tag = null, searchTerm = '') {
  return projects.filter(project => {
    const matchesTag = !tag || project.tags.includes(tag);
    const matchesSearch = !searchTerm || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.fullDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTag && matchesSearch;
  });
}

// Update projects based on filters
function updateProjects(tag, searchTerm) {
  const filteredProjects = filterProjects(tag, searchTerm);
  const grid = document.getElementById('projects-grid');
  
  if (!grid) return;

  grid.innerHTML = filteredProjects.map(project => `
    <div class="grid-item" data-project-id="${project.id}">
      <img src="${project.images[0]}" alt="${project.title}" class="grid-item-image">
      <div class="grid-item-content">
        <h3>${project.title}</h3>
        <p>${project.shortDescription}</p>
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  // Add click event listeners to grid items
  document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', () => {
      const projectId = parseInt(item.dataset.projectId);
      window.location.href = `project.html?id=${projectId}`;
    });
  });
}

// Initialize filters
function initializeFilters() {
  const tagsFilter = document.getElementById('tags-filter');
  const searchInput = document.getElementById('search-input');
  
  if (!tagsFilter || !searchInput) return;

  let activeTag = null;

  // Add tags
  const tags = getUniqueTags();
  tagsFilter.innerHTML = tags.map(tag => 
    `<button class="tag-button" data-tag="${tag}">${tag}</button>`
  ).join('');

  // Add event listeners
  tagsFilter.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag-button')) {
      const tag = e.target.dataset.tag;
      
      // Toggle active state
      document.querySelectorAll('.tag-button').forEach(btn => 
        btn.classList.remove('active')
      );
      
      if (activeTag === tag) {
        activeTag = null;
      } else {
        e.target.classList.add('active');
        activeTag = tag;
      }
      
      updateProjects(activeTag, searchInput.value);
    }
  });

  searchInput.addEventListener('input', (e) => {
    updateProjects(activeTag, e.target.value);
  });
}

// Load projects into work page
function loadProjects() {
  updateProjects(null, '');
}

// Load individual project
function loadProject() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = parseInt(urlParams.get('id'));
  
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  const titleElement = document.getElementById('project-title');
  const yearElement = document.getElementById('project-year');
  const descriptionElement = document.getElementById('project-description');
  const techContainer = document.getElementById('project-technologies');
  const imageContainer = document.querySelector('.project-image');

  if (titleElement) titleElement.textContent = project.title;
  if (yearElement) yearElement.textContent = `Year: ${project.year}`;
  if (descriptionElement) descriptionElement.textContent = project.fullDescription;
  
  if (techContainer) {
    techContainer.innerHTML = project.technologies
      .map(tech => `<span class="technology-tag">${tech}</span>`)
      .join('');
  }

  if (imageContainer) {
    imageContainer.innerHTML = `<img src="${project.images[0]}" alt="${project.title}">`;
  }
}

// Add hover effects to grid items
function addGridItemHoverEffects() {
  document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
      item.style.color = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.backgroundColor = 'transparent';
      item.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
    });
  });
}

// Initialize hamburger visibility based on screen size
function initializeHamburgerVisibility() {
  const hamburger = document.getElementById('hamburger');
  if (window.innerWidth > 768) {
    hamburger.style.display = 'none';
  } else {
    hamburger.style.display = 'flex';
  }
}

// Add theme toggle event listener
document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

// Add hamburger menu event listener
document.getElementById('hamburger')?.addEventListener('click', toggleMobileMenu);

// Initialize on load and resize
window.addEventListener('load', () => {
  initializeHamburgerVisibility();
  
  // Initialize work page if we're on it
  if (window.location.pathname.includes('work.html')) {
    loadProjects();
    initializeFilters();
  }
  
  // Initialize project page if we're on it
  if (window.location.pathname.includes('project.html')) {
    loadProject();
  }
});

window.addEventListener('resize', initializeHamburgerVisibility);