// Video Tutorials Page JavaScript
function applyTheme(theme) {
    const root = document.documentElement;
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-auto');

    if (theme === 'dark') {
        root.classList.add('theme-dark');
    } else if (theme === 'light') {
        root.classList.add('theme-light');
    } else {
        // Auto: follow system preference
        root.classList.add('theme-auto');
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('theme-dark');
        }
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Listen for system theme changes if auto
    if (savedTheme === 'auto') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (localStorage.getItem('theme') === 'auto') {
                applyTheme('auto');
            }
        });
    }
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tutorialCategories = document.querySelectorAll('.tutorial-category');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter categories
            if (category === 'all') {
                tutorialCategories.forEach(cat => {
                    cat.classList.remove('hidden');
                });
            } else {
                tutorialCategories.forEach(cat => {
                    const catCategory = cat.getAttribute('data-category');
                    if (catCategory === category) {
                        cat.classList.remove('hidden');
                    } else {
                        cat.classList.add('hidden');
                    }
                });
            }
        });
    });

    // Tutorial card click functionality (placeholder for video player)
    const tutorialCards = document.querySelectorAll('.tutorial-card');

    tutorialCards.forEach(card => {
        card.addEventListener('click', function () {
            const title = this.querySelector('h3').textContent;

            // In a real implementation, this would open a video player modal
        });
    });

    // Add smooth scroll animation when filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            setTimeout(() => {
                const firstVisibleCategory = document.querySelector('.tutorial-category:not(.hidden)');
                if (firstVisibleCategory) {
                    firstVisibleCategory.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }, 100);
        });
    });
});
