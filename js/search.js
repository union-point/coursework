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
  //handel view profile (btn-view )
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-view')) {
      const userId = e.target.dataset.userId;
      localStorage.setItem('user_id', userId);
      window.location.href = `user.html`;
    }
  });

});
