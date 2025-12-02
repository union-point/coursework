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

  create(title, content, onSave) {
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
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
    `;

    // Modal header
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    `;

    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    titleEl.style.cssText = `
      margin: 0;
      font-size: 24px;
      color: #2c3e50;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 32px;
      cursor: pointer;
      color: #7f8c8d;
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
    footer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    `;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Պահպանել';
    saveBtn.style.cssText = `
      padding: 10px 24px;
      background: #0073b1;
      color: white;
      border: none;
      border-radius: 20px;
      cursor: pointer;
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
    cancelBtn.textContent = 'Չեղարկել';
    cancelBtn.style.cssText = `
      padding: 10px 24px;
      background: white;
      color: #0073b1;
      border: 1px solid #0073b1;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
    `;
    cancelBtn.onclick = () => this.close();

    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);

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
  }

  getFormData(contentEl) {
    const formData = {};
    const inputs = contentEl.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      formData[input.name || input.id] = input.value;
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
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">Ուսումնական հաստատություն</label>
      <input type="text" id="edu-institution" name="institution" 
        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;"
        placeholder="Օրինակ՝ Հայաստանի ազգային պոլիտեխնիկական համալսարան">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">Աստիճան և մասնագիտություն</label>
      <input type="text" id="edu-degree" name="degree" 
        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;"
        placeholder="Օրինակ՝ Բակալավրի աստիճան, Ծրագրային ինժեներություն">
    </div>
    <div style="display: flex; gap: 12px;">
      <div style="flex: 1;">
        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">Սկիզբ</label>
        <input type="month" id="edu-start" name="startDate" 
          style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
      </div>
      <div style="flex: 1;">
        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">Ավարտ</label>
        <input type="month" id="edu-end" name="endDate" 
          style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
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
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">Հավաստագրի անվանում</label>
      <input type="text" id="cert-name" name="name" 
        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;"
        placeholder="Օրինակ՝ Python Ծրագրավորում">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">Կազմակերպություն</label>
      <input type="text" id="cert-org" name="organization" 
        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;"
        placeholder="Օրինակ՝ Armenian Code Academy">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">Տրման ամսաթիվ</label>
      <input type="month" id="cert-date" name="issueDate" 
        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">Հավաստագրի հղում (ոչ պարտադիր)</label>
      <input type="url" id="cert-url" name="credentialUrl" 
        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;"
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
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">Վերնագիր</label>
      <input type="text" id="announcement-title" name="title" 
        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;"
        placeholder="Օրինակ՝ Աշխատանքային հնարավորություն">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">Բովանդակություն</label>
      <textarea id="announcement-content" name="content" rows="6"
        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; resize: vertical;"
        placeholder="Մուտքագրեք հայտարարության բովանդակությունը..."></textarea>
    </div>
  `;

  modal.create('Ավելացնել հայտարարություն', form, (data) => {
    console.log('Announcement added:', data);
    addAnnouncementEntry(data);
    showNotification('Հայտարարությունը ավելացվել է');
  });
}

function addAnnouncementEntry(data) {
  const announcementSection = document.querySelector('.announcements-section');
  const newEntry = document.createElement('div');
  newEntry.className = 'item-entry';
  newEntry.innerHTML = `
    <div class="announcement-card">
      <div class="announcement-content">
        <p><strong>${data.title || 'Նոր հայտարարություն'}</strong>
        ${data.content || 'Բովանդակություն'}
        </p>
      </div>
      <div class="comments-section">
        <button class="btn-comments">Մեկնաբանություններ (0)</button>
        <div class="edit-icons">
          <button class="btn btn-edit">Փոփոխել</button>
          <button class="btn btn-delete">Հեռացնել</button>
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
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">Վերնագիր</label>
      <input type="text" id="announcement-title" name="title" value="${currentTitle}"
        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">Բովանդակություն</label>
      <textarea id="announcement-content" name="content" rows="6"
        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; resize: vertical;">${currentContent}</textarea>
    </div>
  `;

  modal.create('Փոփոխել հայտարարությունը', form, (data) => {
    contentEl.innerHTML = `<strong>${data.title}</strong> ${data.content}`;
    showNotification('Հայտարարությունը թարմացվել է');
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
      border-top: 1px solid #eee;
      animation: fadeIn 0.3s ease;
    `;

    // Dummy comments
    const commentsList = document.createElement('div');
    commentsList.className = 'comments-list';
    commentsList.innerHTML = `
      <div class="comment" style="margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <div style="width: 24px; height: 24px; background: #ddd; border-radius: 50%;"></div>
          <span style="font-weight: 600; font-size: 13px;">Արմեն Պետրոսյան</span>
          <span style="font-size: 12px; color: #888;">2 ժամ առաջ</span>
        </div>
        <p style="font-size: 14px; margin: 0; padding-left: 32px;">Շնորհակալություն տեղեկության համար:</p>
      </div>
      <div class="comment" style="margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <div style="width: 24px; height: 24px; background: #ddd; border-radius: 50%;"></div>
          <span style="font-weight: 600; font-size: 13px;">Անի Գրիգորյան</span>
          <span style="font-size: 12px; color: #888;">1 ժամ առաջ</span>
        </div>
        <p style="font-size: 14px; margin: 0; padding-left: 32px;">CV-ն ուղարկել եմ:</p>
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
        style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 12px; font-size: 14px;">
      <button class = "primary-btn" style="  color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer;">
        <i class="fas fa-paper-plane"></i>
      </button>
    `;

    // Handle new comment
    const input = commentForm.querySelector('input');
    const sendBtn = commentForm.querySelector('button');

    const addComment = () => {
      const text = input.value.trim();
      if (text) {
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.style.marginBottom = '12px';
        newComment.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <div style="width: 24px; height: 24px; background: #0A66C2; border-radius: 6px;"></div>
            <span style="font-weight: 600; font-size: 13px;">Դուք</span>
            <span style="font-size: 12px; color: #888;">Հենց հիմա</span>
          </div>
          <p style="font-size: 14px; margin: 0; padding-left: 32px;">${text}</p>
        `;
        commentsList.appendChild(newComment);
        input.value = '';

        // Update count
        const currentCount = parseInt(btnComments.textContent.match(/\d+/)[0]);
        btnComments.textContent = `Մեկնաբանություններ (${currentCount + 1})`;
      }
    };

    sendBtn.onclick = addComment;
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
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
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
