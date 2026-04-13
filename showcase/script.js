/* Project Data loaded from projectsData.js */

document.addEventListener('DOMContentLoaded', () => {

    const grid = document.getElementById('projects-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Render Projects
    const renderProjects = (filterType) => {
        // Clear grid
        grid.innerHTML = '';

        const filtered = filterType === 'all'
            ? projectsData
            : projectsData.filter(p => p.category === filterType);

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

    // Initial render
    renderProjects('all');

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
