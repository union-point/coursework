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

document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Toggle active class on the clicked item
            item.classList.toggle('active');
        });
    });

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
});
