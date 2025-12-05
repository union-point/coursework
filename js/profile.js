// ============================================
// INLINE EDITING UTILITIES
// ============================================
class InlineEditor {
  constructor() {
    this.originalContent = {};
    this.isEditing = false;
    this.editableElements = [];
    this.handler = null;
  }

  // Make text content editable
  makeEditable(element, identifier) {
    this.originalContent[identifier] = element.innerHTML;
    this.editableElements.push({ element, identifier });

    element.contentEditable = true;
    element.style.outline = '1px solid #0073b1';
    element.style.borderRadius = '12px';
    element.style.padding = '8px';

    // Handle Enter key to save
    const keydownHandler = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.save();
      }
      if (e.key === 'Escape') {
        this.cancel();
      }
    };
    element.addEventListener('keydown', keydownHandler);
    element._keydownHandler = keydownHandler;
  }

  save() {
    this.editableElements.forEach(({ element, identifier }) => {
      const newContent = element.innerHTML;
      element.contentEditable = false;
      element.style.outline = 'none';
      element.style.padding = '0';

      // Remove event listener
      if (element._keydownHandler) {
        element.removeEventListener('keydown', element._keydownHandler);
        delete element._keydownHandler;
      }

      console.log(`${identifier} saved:`, newContent);
      // Here you would save to backend
      // apiService.updateProfile({ [identifier]: newContent });
    });

    this.resetState();
    this.restoreButtons();
  }

  cancel() {
    this.editableElements.forEach(({ element, identifier }) => {
      element.innerHTML = this.originalContent[identifier];
      element.contentEditable = false;
      element.style.outline = 'none';
      element.style.padding = '0';

      // Remove event listener
      if (element._keydownHandler) {
        element.removeEventListener('keydown', element._keydownHandler);
        delete element._keydownHandler;
      }
    });

    this.resetState();
    this.restoreButtons();
  }

  resetState() {
    this.originalContent = {};
    this.isEditing = false;
    this.editableElements = [];
  }

  restoreButtons() {
    const primaryBtn = document.querySelector('.primary-btn');
    const secondaryBtn = document.querySelector('.secondary-btn');

    if (primaryBtn) {
      primaryBtn.textContent = 'Ավելացնել բաժին';
      // Remove the save handler
      if (primaryBtn._saveHandler) {
        primaryBtn.removeEventListener('click', primaryBtn._saveHandler);
        delete primaryBtn._saveHandler;
      }
      // Re-add the add handler
      if (this.handler && !primaryBtn._addHandler) {
        primaryBtn._addHandler = this.handler;
        primaryBtn.addEventListener('click', primaryBtn._addHandler);
      }
    }

    if (secondaryBtn) {
      secondaryBtn.textContent = 'Փոփոխել';
      // Remove the cancel handler
      if (secondaryBtn._cancelHandler) {
        secondaryBtn.removeEventListener('click', secondaryBtn._cancelHandler);
        delete secondaryBtn._cancelHandler;
      }
      // Re-add the edit handler
      if (!secondaryBtn._editHandler) {
        secondaryBtn._editHandler = () => startEditing();
        secondaryBtn.addEventListener('click', secondaryBtn._editHandler);
      }

    }
  }
}

// ============================================
// MODAL UTILITIES
// ============================================

class Modal {
  constructor() {
    this.modal = null;
  }

  create(title, content, onSave, options = {}) {
    // Remove existing modal if any
    this.close();

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    `;

    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'modal-container';
    modal.style.cssText = `
      background: var(--card-background);
      border-radius: 12px;
      padding: 24px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 1px 4px var(--font-color-primary);
      animation: slideUp 0.3s ease;
      color: var(--font-color-primary);
    `;

    // Modal header
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
    `;

    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    titleEl.style.cssText = `
      margin: 0;
      font-size: 24px;
      color: var(--font-color-primary);
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 32px;
      cursor: pointer;
      color: var(--font-color-secondary);
      line-height: 1;
      padding: 0;
      width: 32px;
      height: 32px;
    `;
    closeBtn.onclick = () => this.close();

    header.appendChild(titleEl);
    header.appendChild(closeBtn);

    // Modal content
    const contentEl = document.createElement('div');
    contentEl.className = 'modal-content';
    contentEl.style.marginBottom = '20px';
    contentEl.appendChild(content);

    // Modal footer
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    footer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
      align-items: center;
    `;

    // Add custom footer content if provided (e.g., formatting toolbar)
    if (options.customFooterLeft) {
      footer.style.justifyContent = 'space-between';
      footer.appendChild(options.customFooterLeft);
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 12px;';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'primary-btn';
    saveBtn.textContent = 'Պահպանել';
    saveBtn.style.cssText = `
      padding: 10px 24px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
    `;
    saveBtn.onclick = () => {
      if (onSave) {
        const formData = this.getFormData(contentEl);
        onSave(formData);
      }
      this.close();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'secondary-btn';
    cancelBtn.textContent = 'Չեղարկել';
    cancelBtn.style.cssText = `
      padding: 10px 24px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
    `;
    cancelBtn.onclick = () => this.close();

    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(saveBtn);
    footer.appendChild(buttonContainer);

    modal.appendChild(header);
    modal.appendChild(contentEl);
    modal.appendChild(footer);
    overlay.appendChild(modal);

    // Close on overlay click
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        this.close();
      }
    };

    document.body.appendChild(overlay);
    this.modal = overlay;

    // Add animations
    this.addAnimations();

    // Setup formatting toolbar if provided
    if (options.setupFormatting) {
      options.setupFormatting(modal);
    }
  }

  getFormData(contentEl) {
    const formData = {};
    const inputs = contentEl.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      formData[input.name || input.id] = input.value;
    });
    // Handle contenteditable elements
    const editables = contentEl.querySelectorAll('[contenteditable="true"]');
    editables.forEach(editable => {
      formData[editable.dataset.name || editable.id] = editable.innerHTML;
    });
    return formData;
  }

  close() {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
  }

  addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from {
          transform: translateY(50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `;
    if (!document.querySelector('style[data-modal-animations]')) {
      style.setAttribute('data-modal-animations', 'true');
      document.head.appendChild(style);
    }
  }
}

// ============================================
// PROFILE EDITING FUNCTIONS
// ============================================

const editor = new InlineEditor();
const modal = new Modal();

// Edit Profile Description
function startEditing() {
  if (editor.isEditing) return;

  editor.isEditing = true;

  // Make elements editable
  const nameElement = document.querySelector('.name-title-section h1');
  const titleElement = document.querySelector('.job-title');
  const descElement = document.querySelector('.desc p');

  if (nameElement) {
    editor.makeEditable(nameElement, 'name');
  }

  if (titleElement) {
    editor.makeEditable(titleElement, 'title');
  }

  if (descElement) {
    editor.makeEditable(descElement, 'description');
  }

  // Transform buttons
  const primaryBtn = document.querySelector('.primary-btn');
  const secondaryBtn = document.querySelector('.secondary-btn');

  if (primaryBtn) {
    primaryBtn.textContent = 'Պահպանել';
    // Remove edit handler if exists
    if (primaryBtn._addHandler) {
      editor.handler = primaryBtn._addHandler;
      primaryBtn.removeEventListener('click', primaryBtn._addHandler);
      delete primaryBtn._addHandler;
    }
    // Add save handler
    primaryBtn._saveHandler = () => editor.save();
    primaryBtn.addEventListener('click', primaryBtn._saveHandler);
  }

  if (secondaryBtn) {
    secondaryBtn.textContent = 'Չեղարկել';
    // Remove edit handler
    if (secondaryBtn._editHandler) {
      secondaryBtn.removeEventListener('click', secondaryBtn._editHandler);
      delete secondaryBtn._editHandler;
    }
    // Add cancel handler
    secondaryBtn._cancelHandler = () => editor.cancel();
    secondaryBtn.addEventListener('click', secondaryBtn._cancelHandler);
  }

  // Focus on the first editable element
  if (nameElement) {
    nameElement.focus();
  }
}

// Add Education Entry
function showAddEducationModal() {
  const form = document.createElement('div');
  form.innerHTML = `
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--font-color-primary);">Ուսումնական հաստատություն</label>
      <input type="text" id="edu-institution" name="institution" 
        style="width: 100%; padding: 10px; border-radius: 8px; font-size: 14px; background: var(--card-background); color: var(--font-color-primary);"
        placeholder="Օրինակ՝ Հայաստանի ազգային պոլիտեխնիկական համալսարան">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--font-color-primary);">Աստիճան և մասնագիտություն</label>
      <input type="text" id="edu-degree" name="degree" 
        style="width: 100%; padding: 10px; border-radius: 8px; font-size: 14px; background: var(--card-background); color: var(--font-color-primary);"
        placeholder="Օրինակ՝ Բակալավրի աստիճան, Ծրագրային ինժեներություն">
    </div>
    <div style="display: flex; gap: 12px;">
      <div style="flex: 1;">
        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--font-color-primary);">Սկիզբ</label>
        <input type="month" id="edu-start" name="startDate" 
          style="width: 100%; padding: 10px; border-radius: 8px; font-size: 14px; background: var(--card-background); color: var(--font-color-primary);">
      </div>
      <div style="flex: 1;">
        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--font-color-primary);">Ավարտ</label>
        <input type="month" id="edu-end" name="endDate" 
          style="width: 100%; padding: 10px; border-radius: 8px; font-size: 14px; background: var(--card-background); color: var(--font-color-primary);">
      </div>
    </div>
  `;

  modal.create('Ավելացնել կրթություն', form, (data) => {
    console.log('Education added:', data);
    addEducationEntry(data);
    showNotification('Կրթությունը ավելացվել է');
  });
}

function addEducationEntry(data) {
  const educationSection = document.querySelector('.education-section');
  const newEntry = document.createElement('div');
  newEntry.className = 'item-entry';
  newEntry.innerHTML = `
    <div class="item-logo">
      <div class="cert-logo-bg" style="width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
        <i class="fas fa-graduation-cap" style="color: white; font-size: 20px;"></i>
      </div>
    </div>
    <div class="item-details">
      <p class="item-title">${data.institution || 'Նոր ուսումնական հաստատություն'}</p>
      <p class="item-subtitle">${data.degree || 'Աստիճան և մասնագիտություն'}</p>
      <p class="item-date">${formatDateRange(data.startDate, data.endDate)}</p>
    </div>
  `;

  educationSection.appendChild(newEntry);
  makeEntryEditable(newEntry);
}

// Add License/Certificate Entry
function showAddLicenseModal() {
  const form = document.createElement('div');
  form.innerHTML = `
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--font-color-primary);">Հավաստագրի անվանում</label>
      <input type="text" id="cert-name" name="name" 
        style="width: 100%; padding: 10px; border-radius: 8px; font-size: 14px; background: var(--card-background); color: var(--font-color-primary);"
        placeholder="Օրինակ՝ Python Ծրագրավորում">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--font-color-primary);">Կազմակերպություն</label>
      <input type="text" id="cert-org" name="organization" 
        style="width: 100%; padding: 10px; border-radius: 8px; font-size: 14px; background: var(--card-background); color: var(--font-color-primary);"
        placeholder="Օրինակ՝ Armenian Code Academy">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--font-color-primary);">Տրման ամսաթիվ</label>
      <input type="month" id="cert-date" name="issueDate" 
        style="width: 100%; padding: 10px; border-radius: 8px; font-size: 14px; background: var(--card-background); color: var(--font-color-primary);">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--font-color-primary);">Հավաստագրի հղում (ոչ պարտադիր)</label>
      <input type="url" id="cert-url" name="credentialUrl" 
        style="width: 100%; padding: 10px; border-radius: 8px; font-size: 14px; background: var(--card-background); color: var(--font-color-primary);"
        placeholder="https://...">
    </div>
  `;

  modal.create('Ավելացնել հավաստագիր', form, (data) => {
    console.log('Certificate added:', data);
    addLicenseEntry(data);
    showNotification('Հավաստագիրը ավելացվել է');
  });
}

function addLicenseEntry(data) {
  const licenseSection = document.querySelector('.licenses-section');
  const newEntry = document.createElement('div');
  newEntry.className = 'item-entry';

  const credentialButton = data.credentialUrl ?
    `<button class="show-cred-btn" onclick="window.open('${data.credentialUrl}', '_blank')">
      Ցուցադրել հավաստագիրը <i class="fas fa-external-link-alt"></i>
    </button>` : '';

  newEntry.innerHTML = `
    <div class="item-logo cert-logo-bg">
      <i class="fas fa-certificate cert-icon"></i>
    </div>
    <div class="item-details">
      <p class="item-title">${data.name || 'Նոր հավաստագիր'}</p>
      <p class="item-subtitle">${data.organization || 'Կազմակերպություն'}</p>
      <p class="item-date">Տրման ամսաթիվը՝ ${formatDate(data.issueDate)}</p>
      ${credentialButton}
    </div>
  `;

  licenseSection.appendChild(newEntry);
  makeEntryEditable(newEntry);
}

// Add Announcement
function showAddAnnouncementModal() {
  const form = document.createElement('div');
  form.innerHTML = `
    <div style=" margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--font-color-primary);">Կատեգորիա</label>
      <select class="visibility-selector" id="category-selector">
        <option value="job">Աշխատանք</option>
        <option value="internship">Պրակտիկա</option>
        <option value="training">Դասընթաց</option>
      </select>
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--font-color-primary);">Վերնագիր</label>
      <input type="text" id="announcement-title" name="title" 
        style="box-sizing:border-box; width: 100%; padding: 10px; border-radius: 8px; font-size: 14px; background: var(--card-background); color: var(--font-color-primary); border: 1px solid var(--border-color);"
        placeholder="Օրինակ՝ Աշխատանքային հնարավորություն">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--font-color-primary);">Բովանդակություն</label>
      <div id="announcement-content" data-name="content" contenteditable="true"
        style="box-sizing:border-box; width: 100%; min-height: 150px; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 14px; background: var(--card-background); color: var(--font-color-primary);"
        data-placeholder="Մուտքագրեք հայտարարության բովանդակությունը..."></div>
    </div>
  `;

  // Create formatting toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'post-formatting-toolbar';
  toolbar.style.cssText = 'display: flex; gap: 10px;';
  toolbar.innerHTML = `
    <button type="button" class="format-btn bold-btn" title="Թավ" data-command="bold">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
      </svg>
    </button>
    <button type="button" class="format-btn italic-btn" title="Շեղ" data-command="italic">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
      </svg>
    </button>
  `;

  // Setup formatting functionality
  const setupFormatting = (modalElement) => {
    const editor = modalElement.querySelector('#announcement-content');
    const buttons = modalElement.querySelectorAll('.format-btn');

    // Add placeholder styling
    const style = document.createElement('style');
    style.textContent = `
      #announcement-content:empty:before {
        content: attr(data-placeholder);
        color: var(--font-color-secondary);
        pointer-events: none;
      }
      .format-btn {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--border-color);
        background: var(--card-background);
        border-radius: 8px;
        color: var(--font-color-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .format-btn:hover {
        border-color: var(--primary-blue);
        color: var(--primary-blue);
      }
      .format-btn.active {
        border-color: var(--primary-blue);
        color: var(--primary-blue);
        background: var(--window-background);
      }
    `;
    document.head.appendChild(style);

    function applyCommand(cmd) {
      editor.focus();
      document.execCommand(cmd, false, null);
      updateActiveButtons();
    }

    function updateActiveButtons() {
      buttons.forEach(btn => {
        const cmd = btn.dataset.command;
        btn.classList.toggle('active', document.queryCommandState(cmd));
      });
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        applyCommand(btn.dataset.command);
      });
    });

    if (editor) {
      editor.addEventListener('keyup', updateActiveButtons);
      editor.addEventListener('mouseup', updateActiveButtons);
    }
  };

  modal.create('Ավելացնել հայտարարություն', form, (data) => {
    console.log('Announcement added:', data);
    addAnnouncementEntry(data);
    showNotification('Հայտարարությունը ավելացվել է');
  }, {
    customFooterLeft: toolbar,
    setupFormatting: setupFormatting
  });
}

function addAnnouncementEntry(data) {
  const announcementSection = document.querySelector('.announcements-section');
  const newEntry = document.createElement('div');
  newEntry.className = 'item-entry';
  newEntry.innerHTML = `
    <div class="announcement-card" data-post-id="${data.id || 0}">
      <div class="announcement-content">
        <p><strong>${data.title || 'Նոր հայտարարություն'}</strong>
        ${data.content || 'Բովանդակություն'}
        </p>
      </div>
      <div class="comments-section">
        <button class="btn-comments">Մեկնաբանություններ (0)</button>
        <div class="edit-icons">
          <button class="btn btn-edit primary-btn">Փոփոխել</button>
          <button class="btn btn-delete secondary-btn">Հեռացնել</button>
        </div>
      </div>
    </div>
  `;

  announcementSection.appendChild(newEntry);
  attachAnnouncementHandlers(newEntry);
}


// Edit Announcement
function editAnnouncement(announcementCard) {
  const contentEl = announcementCard.querySelector('.announcement-content p');
  const currentTitle = contentEl.querySelector('strong')?.textContent || '';
  const currentContent = contentEl.innerHTML.replace(/<strong>.*?<\/strong>/, '').trim();

  const form = document.createElement('div');
  form.innerHTML = `
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--font-color-primary);">Վերնագիր</label>
      <input type="text" id="announcement-title" name="title" value="${currentTitle}"
        style="width: 100%; padding: 10px; border-radius: 8px; font-size: 14px; background: var(--card-background); color: var(--font-color-primary); border: 1px solid var(--border-color);">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--font-color-primary);">Բովանդակություն</label>
      <div id="announcement-content" data-name="content" contenteditable="true"
        style="box-sizing:border-box; width: 100%; min-height: 150px; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 14px; background: var(--card-background); color: var(--font-color-primary);">${currentContent}</div>
    </div>
  `;

  // Create formatting toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'post-formatting-toolbar';
  toolbar.style.cssText = 'display: flex; gap: 10px;';
  toolbar.innerHTML = `
    <button type="button" class="format-btn bold-btn" title="Թավ" data-command="bold">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
      </svg>
    </button>
    <button type="button" class="format-btn italic-btn" title="Շեղ" data-command="italic">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
      </svg>
    </button>
  `;

  // Setup formatting functionality
  const setupFormatting = (modalElement) => {
    const editor = modalElement.querySelector('#announcement-content');
    const buttons = modalElement.querySelectorAll('.format-btn');

    function applyCommand(cmd) {
      editor.focus();
      document.execCommand(cmd, false, null);
      updateActiveButtons();
    }

    function updateActiveButtons() {
      buttons.forEach(btn => {
        const cmd = btn.dataset.command;
        btn.classList.toggle('active', document.queryCommandState(cmd));
      });
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        applyCommand(btn.dataset.command);
      });
    });

    if (editor) {
      editor.addEventListener('keyup', updateActiveButtons);
      editor.addEventListener('mouseup', updateActiveButtons);
    }
  };

  modal.create('Փոփոխել հայտարարությունը', form, (data) => {
    console.log(data);
    contentEl.innerHTML = `<strong>${data.title}</strong> ${data.content}`;
  }, {
    customFooterLeft: toolbar,
    setupFormatting: setupFormatting
  });
}
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

// Delete Announcement
function deleteAnnouncement(announcementEntry) {
  customConfirm("Վստա՞հ եք, որ ցանկանում եք հեռացնել այս հայտարարությունը։'")
    .then(answer => {
      if (answer) {
        announcementEntry.remove();

        console.log("removed");
      } else {
        console.log("cancled");
      }
    })
}

// Make entry editable on double-click 
function makeEntryEditable(entry) {
  const titleEl = entry.querySelector('.item-title');
  const subtitleEl = entry.querySelector('.item-subtitle');

  if (titleEl) {
    titleEl.addEventListener('dblclick', () => {
      editor.makeEditable(titleEl, (newContent) => {
        showNotification('Փոփոխությունները պահպանվել են');
      });
    });
  }

  if (subtitleEl) {
    subtitleEl.addEventListener('dblclick', () => {
      editor.makeEditable(subtitleEl, (newContent) => {
        showNotification('Փոփոխությունները պահպանվել են');
      });
    });
  }
}

// Toggle Comments
function toggleComments(announcementCard, btnComments) {
  let commentsContainer = announcementCard.querySelector('.comments-container');

  if (!commentsContainer) {
    commentsContainer = document.createElement('div');
    commentsContainer.className = 'comments-container';
    commentsContainer.style.cssText = `
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
      animation: fadeIn 0.3s ease;
    `;

    // Dummy comments
    const commentsList = document.createElement('div');
    commentsList.className = 'comments-list';
    commentsList.innerHTML = `
      <div class="comment" style="margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <div style="width: 32px; height: 32px; background: var(--border-color); border-radius: 50%;"></div>
          <span style="font-weight: 600; font-size: 14px; color: var(--font-color-primary)">Արմեն Պետրոսյան</span>
          <span style="font-size: 12px; color: var(--font-color-secondary);">2 ժամ առաջ</span>
        </div>
        <p style="font-size: 14px; margin: 0; padding-left: 32px; color: var(--font-color-primary)">Շնորհակալություն տեղեկության համար:</p>
      </div>
      <div class="comment" style="margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <div style="width: 32px; height: 32px; background: var(--border-color); border-radius: 50%;"></div>
          <span style="font-weight: 600; font-size: 14px; color: var(--font-color-primary)">Անի Գրիգորյան</span>
          <span style="font-size: 12px; color: var(--font-color-secondary);">1 ժամ առաջ</span>
        </div>
        <p style="font-size: 14px; margin: 0; padding-left: 32px; color: var(--font-color-primary)">CV-ն ուղարկել եմ:</p>
      </div>
    `;

    // Add comment form
    const commentForm = document.createElement('div');
    commentForm.style.cssText = `
      display: flex;
      gap: 8px;
      margin-top: 16px;
    `;
    commentForm.innerHTML = `
      <input type="text" placeholder="Գրել մեկնաբանություն..." 
        style="flex: 1; padding: 8px 12px; border-radius: 12px; font-size: 14px; background: var(--card-background); color: var(--font-color-primary);">
      <button class = "primary-btn" style="  color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer;">
        <i class="fas fa-paper-plane"></i>
      </button>
    `;

    // Handle new comment
    const input = commentForm.querySelector('input');
    const sendBtn = commentForm.querySelector('button');

    const addComment = async () => {
      const postId = announcementCard.dataset.postId;
      const text = input.value.trim();
      const response = await createComment(postId, { text });
      const commentText = response.data.text
      if (commentText) {
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.style.marginBottom = '12px';
        newComment.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <div style="width: 32px; height: 32px; background: var(--border-color); border-radius: 50%;"></div>
            <span style="font-weight: 600; font-size: 14px; color: var(--font-color-primary);">Դուք</span>
            <span style="font-size: 12px; color: var(--font-color-secondary);">Հենց հիմա</span>
          </div>
          <p style="font-size: 14px; margin: 0; padding-left: 32px; color: var(--font-color-primary);">${commentText}</p>
        `;
        commentsList.appendChild(newComment);
        input.value = '';

        // Update count
        const currentCount = parseInt(btnComments.textContent.match(/\d+/)[0]);
        btnComments.textContent = `Մեկնաբանություններ (${currentCount + 1})`;
      }
    };
    sendBtn.addEventListener('click', () => addComment());
    input.onkeypress = (e) => {
      if (e.key === 'Enter') addComment();
    };

    commentsContainer.appendChild(commentsList);
    commentsContainer.appendChild(commentForm);
    announcementCard.appendChild(commentsContainer);
  } else {
    if (commentsContainer.style.display === 'none') {
      commentsContainer.style.display = 'block';
    } else {
      commentsContainer.style.display = 'none';
    }
  }
}

// Attach handlers to announcement buttons
function attachAnnouncementHandlers(entry) {
  const editBtn = entry.querySelector('.btn-edit');
  const deleteBtn = entry.querySelector('.btn-delete');
  const commentsBtn = entry.querySelector('.btn-comments');
  const announcementCard = entry.querySelector('.announcement-card');

  if (editBtn) {
    editBtn.addEventListener('click', () => editAnnouncement(announcementCard));
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => deleteAnnouncement(entry));
  }

  if (commentsBtn) {
    commentsBtn.addEventListener('click', () => toggleComments(announcementCard, commentsBtn));
  }
}

// Banner Photo Upload
function handleBannerUpload() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const bannerPhoto = document.querySelector('.banner-photo');
        bannerPhoto.style.backgroundImage = `url(${event.target.result})`;
        showNotification('Բանների նկարը թարմացվել է');
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

// Profile Photo Upload
function handleProfilePhotoUpload() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const profilePhoto = document.querySelector('.profile-photo img');
        if (profilePhoto) {
          profilePhoto.src = event.target.result;
          showNotification('Պրոֆիլի նկարը թարմացվել է');
        }
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(dateString) {
  if (!dateString) return 'Ներկա';
  const date = new Date(dateString);
  const months = ['հուն', 'փետր', 'մարտ', 'ապր', 'մայ', 'հուն', 'հուլ', 'օգ', 'սեպտ', 'հոկտ', 'նոյ', 'դեկ'];
  return `${months[date.getMonth()]}. ${date.getFullYear()} թ.`;
}

function formatDateRange(start, end) {
  const startDate = formatDate(start);
  const endDate = end ? formatDate(end) : 'Ներկա';
  return `${startDate} – ${endDate}`;
}

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
  if (!document.querySelector('style[data-notification-animations]')) {
    style.setAttribute('data-notification-animations', 'true');
    document.head.appendChild(style);
  }
}

// ============================================
// THEME HANDLING
// ============================================

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

// ============================================
// EVENT LISTENERS
// ============================================

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
  // Banner edit icon
  const bannerEditIcon = document.querySelector('.banner-edit-icon');
  if (bannerEditIcon) {
    bannerEditIcon.addEventListener('click', handleBannerUpload);
  }

  // Profile photo click
  const profilePhoto = document.querySelector('.profile-photo');
  if (profilePhoto) {
    profilePhoto.style.cursor = 'pointer';
    profilePhoto.addEventListener('click', handleProfilePhotoUpload);
  }

  // "Ավելացնել բաժին" button
  const addSectionBtn = document.querySelector('.primary-btn');
  if (addSectionBtn && addSectionBtn.textContent.includes('Ավելացնել')) {
    addSectionBtn._addHandler = () => showNotification('Ավելացնել բաժին ֆունկցիոնալությունը դեռ մշակման փուլում է։');
    addSectionBtn.addEventListener('click', addSectionBtn._addHandler);
  }

  // "Փոփոխել" button in intro card
  // Initialize edit button
  const editProfileBtn = document.querySelector('.secondary-btn');
  if (editProfileBtn && editProfileBtn.textContent.includes('Փոփոխել')) {
    editProfileBtn._editHandler = startEditing;
    editProfileBtn.addEventListener('click', editProfileBtn._editHandler);
  }

  // Education section handlers
  const educationSection = document.querySelector('.education-section');
  if (educationSection) {
    const addIcon = educationSection.querySelector('.fa-plus');
    const editIcon = educationSection.querySelector('.fa-pencil-alt');

    if (addIcon) {
      addIcon.addEventListener('click', showAddEducationModal);
    }

    if (editIcon) {
      editIcon.addEventListener('click', () => {
        showNotification('Կրկնակի սեղմեք տարրի վրա՝ խմբագրելու համար');
      });
    }

    // Make existing entries editable
    const entries = educationSection.querySelectorAll('.item-entry');
    entries.forEach(entry => makeEntryEditable(entry));
  }

  // Licenses section handlers
  const licensesSection = document.querySelector('.licenses-section');
  if (licensesSection) {
    const addIcon = licensesSection.querySelector('.fa-plus');
    const editIcon = licensesSection.querySelector('.fa-pencil-alt');

    if (addIcon) {
      addIcon.style.cursor = 'pointer';
      addIcon.addEventListener('click', showAddLicenseModal);
    }

    if (editIcon) {
      editIcon.style.cursor = 'pointer';
      editIcon.addEventListener('click', () => {
        showNotification('Կրկնակի սեղմեք տարրի վրա՝ խմբագրելու համար');
      });
    }

    // Make existing entries editable
    const entries = licensesSection.querySelectorAll('.item-entry');
    entries.forEach(entry => makeEntryEditable(entry));
  }

  // Announcements section handlers
  const announcementsSection = document.querySelector('.announcements-section');
  if (announcementsSection) {
    const addIcon = announcementsSection.querySelector('.fa-plus');

    if (addIcon) {
      addIcon.style.cursor = 'pointer';
      addIcon.addEventListener('click', showAddAnnouncementModal);
    }

    // Attach handlers to existing announcements
    const entries = announcementsSection.querySelectorAll('.item-entry');
    entries.forEach(entry => attachAnnouncementHandlers(entry));
  }

  console.log('Profile interactive editing initialized');
});
