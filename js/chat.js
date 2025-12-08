function copyText(button) {
  const messageText = button.parentElement.childNodes[0].textContent.trim();
  navigator.clipboard.writeText(messageText).then(() => {
    button.textContent = '✓';
    setTimeout(() => {
      button.textContent = '📋';
    }, 1000);
  });
}
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
});
