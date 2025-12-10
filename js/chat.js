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

  // Chat Functionality
  const messageInput = document.querySelector('.message-input input');
  const sendButton = document.querySelector('.send-icon');
  const messagesContainer = document.querySelector('.messages');
  const chatItems = document.querySelectorAll('.chat-item');
  const contactName = document.querySelector('.contact-name');
  const contactAvatar = document.querySelector('.contact-info .avatar');
  const searchInput = document.querySelector('.search-box input');
  const emojiBtn = document.querySelector('.emoji-btn');
  const attachmentBtn = document.querySelector('.attachment-btn');

  // Scroll to bottom initially
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Function to add a message
  function addMessage(text, type = 'sent', attachment = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');

    const textDiv = document.createElement('div');
    textDiv.classList.add('message-text');

    if (text) {
      // Create text node to avoid XSS and ensure proper spacing
      textDiv.appendChild(document.createTextNode(text + ' '));

      // Add copy button only if there is text
      const copyBtn = document.createElement('button');
      copyBtn.classList.add('copy-btn');
      copyBtn.textContent = '📋';
      copyBtn.onclick = function () {
        copyText(this);
      };
      textDiv.appendChild(copyBtn);
      contentDiv.appendChild(textDiv);
    }

    if (attachment && attachment.type === 'image') {
      const img = document.createElement('img');
      img.src = attachment.url;
      img.style.maxWidth = '200px';
      img.style.borderRadius = '8px';
      img.style.marginTop = '5px';
      img.style.display = 'block';
      contentDiv.appendChild(img);
    }

    const timeDiv = document.createElement('div');
    timeDiv.classList.add('message-time');
    const now = new Date();
    timeDiv.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    contentDiv.appendChild(timeDiv);
    messageDiv.appendChild(contentDiv);

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Send message event handler
  function sendMessage() {
    const text = messageInput.value.trim();
    if (text) {
      addMessage(text, 'sent');
      messageInput.value = '';
    }
  }

  if (sendButton && messageInput) {
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  // Emoji Picker
  const emojis = ['😀', '😂', '😍', '🥺', '😎', '😭', '😡', '👍', '👎', '🎉', '❤️', '🔥', '✅', '❌'];
  const emojiPicker = document.createElement('div');
  Object.assign(emojiPicker.style, {
    display: 'none',
    position: 'absolute',
    bottom: '60px',
    left: '20px',
    background: 'var(--bg-card,var(--card-background))',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '10px',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '5px',
    zIndex: '100',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  });

  emojis.forEach(emoji => {
    const span = document.createElement('span');
    span.textContent = emoji;
    Object.assign(span.style, {
      cursor: 'pointer',
      fontSize: '1.2rem',
      padding: '5px',
      textAlign: 'center'
    });
    span.onmouseover = () => span.style.backgroundColor = 'var(--window-background)';
    span.onmouseout = () => span.style.backgroundColor = 'transparent';
    span.onclick = () => {
      messageInput.value += emoji;
      messageInput.focus();
    };
    emojiPicker.appendChild(span);
  });

  const inputContainer = document.querySelector('.message-input');
  if (inputContainer) {
    inputContainer.style.position = 'relative'; // Ensure positioning context
    inputContainer.appendChild(emojiPicker);
  }

  if (emojiBtn) {
    emojiBtn.style.cursor = 'pointer';
    emojiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'grid' : 'none';
    });
  }

  // Close picker when clicking outside
  document.addEventListener('click', (e) => {
    if (emojiPicker.style.display !== 'none' && !emojiPicker.contains(e.target) && e.target !== emojiBtn) {
      emojiPicker.style.display = 'none';
    }
  });

  // Attachment Logic
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  if (attachmentBtn) {
    attachmentBtn.style.cursor = 'pointer';
    attachmentBtn.addEventListener('click', () => {
      fileInput.click();
    });
  }

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addMessage('', 'sent', { type: 'image', url: event.target.result });
      };
      reader.readAsDataURL(file);
    }
    fileInput.value = ''; // Reset
  });

  /*  !!!
  remove after testing
  */
  const fullName = localStorage.getItem('name');
  console.log(fullName);
  if (fullName) {
    contactName.textContent = fullName;
    messagesContainer.innerHTML = '';
    localStorage.removeItem('name');
  }
  else {
    // initial chat selection
    let item = chatItems[0];
    item.classList.add('active');
    const name = item.querySelector('.chat-name').textContent;
    const avatar = item.querySelector('.avatar').textContent;
    if (contactName) contactName.textContent = name;
    if (contactAvatar) contactAvatar.textContent = avatar;

  }
  /* !!! */

  // Chat selection
  if (chatItems) {

    chatItems.forEach(item => {
      item.addEventListener('click', () => {
        // Remove active class from all
        chatItems.forEach(i => i.classList.remove('active'));
        // Add active to clicked
        item.classList.add('active');

        // Update header info
        const name = item.querySelector('.chat-name').textContent;
        const avatar = item.querySelector('.avatar').textContent;

        if (contactName) contactName.textContent = name;
        if (contactAvatar) contactAvatar.textContent = avatar;

        // In a real app, we would fetch messages for this chat here
        // For now, we just clear the messages to simulate a new chat or keep them
        // messagesContainer.innerHTML = ''; 
      });
    });
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      chatItems.forEach(item => {
        const name = item.querySelector('.chat-name').textContent.toLowerCase();
        if (name.includes(term)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Menu Button Logic
  const menuBtn = document.querySelector('.menu-btn');
  const chatActions = document.querySelector('.chat-actions');
  let notificationsEnabled = true; // состояние уведомлений

  if (menuBtn && chatActions) {
    const dropdown = document.createElement('div');
    dropdown.className = 'chat-dropdown';

    Object.assign(dropdown.style, {
      display: 'none',
      position: 'absolute',
      top: '110%',
      right: '0',
      background: 'var(--card-background)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      zIndex: '100',
      minWidth: '180px',
      overflow: 'hidden',
      animation: 'fadeIn 0.12s ease'
    });

    const menuItems = [
      {
        text: 'Ջնջել նամակագրությունը',
        icon: '🗑️',
        action: () => {
          if (confirm('Վստա՞հ եք, որ ուզում եք ջնջել նամակագրությունը։')) {
            messagesContainer.innerHTML = '';
          }
        }
      },
      {
        text: 'Արգելափակել',
        icon: '🚫',
        action: () => alert('Օգտատերը արգելափակված է')
      },
      {
        text: 'Դիտել էջը',
        icon: '👤',
        action: () => (window.location.href = 'user.html')
      },
      {
        text: () => notificationsEnabled ? 'Անջատել ծանուցումները' : 'Միացնել ծանուցումները',
        icon: () => notificationsEnabled ? '🔕' : '🔔',
        dynamic: true,
        action: () => {
          notificationsEnabled = !notificationsEnabled;
          renderMenu(); // обновить текст меню
        }
      }
    ];

    function createMenuItem(item) {
      const div = document.createElement('div');
      div.className = 'chat-dropdown-item';

      div.innerHTML = `
      <span class="item-icon">${typeof item.icon === "function" ? item.icon() : item.icon}</span>
      <span class="item-text">${typeof item.text === "function" ? item.text() : item.text}</span>
    `;

      div.onclick = () => {
        item.action();
        if (!item.dynamic) dropdown.style.display = 'none';
      };

      return div;
    }

    function renderMenu() {
      dropdown.innerHTML = '';
      menuItems.forEach(item => dropdown.appendChild(createMenuItem(item)));
    }

    renderMenu(); // первая отрисовка

    chatActions.style.position = 'relative';
    chatActions.appendChild(dropdown);

    menuBtn.style.cursor = 'pointer';
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', (e) => {
      if (!chatActions.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }

});
