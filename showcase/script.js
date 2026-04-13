/* Project Data loaded from projectsData.js */

let customProjects = [];

// Load custom projects from localStorage on page load
const loadCustomProjects = () => {
    const stored = localStorage.getItem('customProjects');
    if (stored) {
        customProjects = JSON.parse(stored);
    }
};

document.addEventListener('DOMContentLoaded', () => {

    loadCustomProjects();

    const grid = document.getElementById('projects-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const adminToggleBtn = document.querySelector('.admin-toggle-btn');
    const adminPanel = document.getElementById('admin-panel');
    const adminOverlay = document.getElementById('admin-overlay');
    const adminCloseBtn = document.querySelector('.admin-close-btn');
    const addProjectForm = document.getElementById('add-project-form');
    const customProjectsList = document.getElementById('custom-projects-list');

    // Admin Panel Toggle
    adminToggleBtn.addEventListener('click', () => {
        adminPanel.classList.add('active');
        adminOverlay.classList.add('active');
    });

    adminCloseBtn.addEventListener('click', () => {
        adminPanel.classList.remove('active');
        adminOverlay.classList.remove('active');
    });

    adminOverlay.addEventListener('click', () => {
        adminPanel.classList.remove('active');
        adminOverlay.classList.remove('active');
    });

    // Render Projects - Now includes custom projects
    const renderProjects = (filterType) => {
        // Clear grid
        grid.innerHTML = '';

        // Combine original and custom projects
        const allProjects = [...projectsData, ...customProjects];

        const filtered = filterType === 'all'
            ? allProjects
            : allProjects.filter(p => p.category === filterType);

        filtered.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            // Staggered animation delay
            card.style.animationDelay = `${index * 0.15}s`;

            const techTags = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

            card.innerHTML = `
                <div class="card-image-wrap">
                    <div class="card-overlay"></div>
                    <div class="card-links">
                        <a href="${project.liveUrl}" class="icon-link" aria-label="View Live"><i class="fas fa-external-link-alt"></i></a>
                        <a href="${project.githubUrl}" class="icon-link" aria-label="View Source"><i class="fab fa-github"></i></a>
                    </div>
                </div>
                <div class="card-content">
                    <span class="card-category">${project.categoryName}</span>
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-desc">${project.description}</p>
                    <div class="card-tech">
                        ${techTags}
                    </div>
                </div>
            `;

            grid.appendChild(card);

            // Trigger reflow to apply animation correctly
            void card.offsetWidth;
            card.classList.add('visible');
        });
    };

    // Display custom projects in admin panel
    const displayCustomProjects = () => {
        if (customProjects.length === 0) {
            customProjectsList.innerHTML = '<div class="empty-message">No custom projects yet. Add one using the form above.</div>';
            return;
        }

        customProjectsList.innerHTML = customProjects.map((project, index) => `
            <div class="custom-project-item">
                <div class="project-item-header">
                    <span class="project-item-title">${project.title}</span>
                    <span class="project-item-category">${project.categoryName}</span>
                </div>
                <p class="project-item-desc">${project.description}</p>
                <div class="project-item-actions">
                    <button class="delete-project-btn" data-index="${index}">Delete</button>
                </div>
            </div>
        `).join('');

        // Add delete functionality
        document.querySelectorAll('.delete-project-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                customProjects.splice(index, 1);
                localStorage.setItem('customProjects', JSON.stringify(customProjects));
                displayCustomProjects();
                renderProjects('all');
            });
        });
    };

    // Add Project Form Handler
    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('project-title').value;
        const description = document.getElementById('project-description').value;
        const categoryValue = document.getElementById('project-category').value;
        
        const categoryMap = {
            'web': 'Web Development',
            'app': 'Mobile Apps',
            'design': 'UI/UX Design'
        };

        const newProject = {
            title: title,
            image: `https://picsum.photos/seed/${title.replace(/\s+/g, '-').toLowerCase()}/600/400`,
            liveUrl: '#',
            githubUrl: '#',
            category: categoryValue,
            categoryName: categoryMap[categoryValue],
            description: description,
            tech: ['HTML', 'CSS', 'JavaScript']
        };

        customProjects.push(newProject);
        localStorage.setItem('customProjects', JSON.stringify(customProjects));

        // Reset form
        addProjectForm.reset();

        // Update displays
        displayCustomProjects();
        renderProjects('all');

        // Show success message
        alert('Project added successfully!');
    });

    // Initial render
    renderProjects('all');
    displayCustomProjects();

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            renderProjects(filterValue);
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.85)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            navbar.style.padding = '1rem 5%';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '1.5rem 5%';
        }
    });

});
