// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format a date string to Armenian month abbreviation and year
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  if (!dateString) return 'Ներկա';
  const date = new Date(dateString);
  const months = ['հուն', 'փետր', 'մարտ', 'ապր', 'մայ', 'հուն', 'հուլ', 'օգ', 'սեպտ', 'հոկտ', 'նոյ', 'դեկ'];
  return `${months[date.getMonth()]}. ${date.getFullYear()} թ.`;
}

/**
 * Format a date range
 * @param {string} start - Start date
 * @param {string} end - End date
 * @returns {string} Formatted date range
 */
function formatDateRange(start, end) {
  const startDate = formatDate(start);
  const endDate = end ? formatDate(end) : 'Ներկա';
  return `${startDate} – ${endDate}`;
}

/**
 * Format a timestamp to relative time (e.g., "2 hours ago")
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted relative time in Armenian
 */
function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Հենց հիմա';

  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Հենց հիմա';
  if (diffMins < 60) return `${diffMins} րոպե առաջ`;
  if (diffHours < 24) return `${diffHours} ժամ առաջ`;
  if (diffDays < 7) return `${diffDays} օր առաջ`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} շաբաթ առաջ`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} ամիս առաջ`;
  return `${Math.floor(diffDays / 365)} տարի առաջ`;
}


/**
 * Show a notification toast message
 * @param {string} message - Message to display
 */
function showNotification(message) {
  // Remove existing notification
  const existing = document.querySelector('.notification-toast');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'notification-toast';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #2c3e50;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);

  // Add animations
  addNotificationAnimations();
}

/**
 * Add notification animation styles to document
 */
function addNotificationAnimations() {
  if (document.querySelector('style[data-notification-animations]')) return;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  style.setAttribute('data-notification-animations', 'true');
  document.head.appendChild(style);
}

/**
 * Show a custom confirmation dialog
 * @param {string} message - Confirmation message
 * @returns {Promise<boolean>} User's choice
 */
function customConfirm(message) {
  return new Promise(resolve => {
    const backdrop = document.getElementById('custom-confirm-backdrop');
    const messageBox = document.getElementById('custom-confirm-message');
    const yesBtn = document.getElementById('confirm-yes');
    const noBtn = document.getElementById('confirm-no');

    messageBox.textContent = message;
    backdrop.classList.remove('hidden');

    const close = (value) => {
      backdrop.classList.add('hidden');
      yesBtn.removeEventListener('click', yesHandler);
      noBtn.removeEventListener('click', noHandler);
      resolve(value);
    };

    const yesHandler = () => close(true);
    const noHandler = () => close(false);

    yesBtn.addEventListener('click', yesHandler);
    noBtn.addEventListener('click', noHandler);
  });
}
//uncomment
// export { formatDate, formatDateRange, formatTimeAgo, showNotification, customConfirm };

