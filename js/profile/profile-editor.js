// ============================================
// INLINE EDITOR CLASS
// ============================================

/*uncomment
import { showNotification } from './profile-utils.js';
*/
/**
 * InlineEditor class for making content editable
 */
class InlineEditor {
    constructor() {
        this.originalContent = {};
        this.isEditing = false;
        this.editableElements = [];
        this.handler = null;
    }

    /**
     * Make an element editable
     * @param {HTMLElement} element - Element to make editable
     * @param {string} identifier - Unique identifier for the element
     */
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

    /**
     * Save all editable content
     */
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

    /**
     * Cancel editing and restore original content
     */
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

    /**
     * Reset editor state
     */
    resetState() {
        this.originalContent = {};
        this.isEditing = false;
        this.editableElements = [];
    }

    /**
     * Restore buttons to their original state
     */
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
                secondaryBtn._editHandler = () => this.startEditing();
                secondaryBtn.addEventListener('click', secondaryBtn._editHandler);
            }
        }
    }

    /**
     * Start editing mode
     */
    startEditing() {
        if (this.isEditing) return;

        this.isEditing = true;

        // Make elements editable
        const nameElement = document.querySelector('.name-title-section h1');
        const titleElement = document.querySelector('.job-title');
        const descElement = document.querySelector('.desc p');

        if (nameElement) {
            this.makeEditable(nameElement, 'name');
        }

        if (titleElement) {
            this.makeEditable(titleElement, 'title');
        }

        if (descElement) {
            this.makeEditable(descElement, 'description');
        }

        // Transform buttons
        const primaryBtn = document.querySelector('.primary-btn');
        const secondaryBtn = document.querySelector('.secondary-btn');

        if (primaryBtn) {
            primaryBtn.textContent = 'Պահպանել';
            // Remove edit handler if exists
            if (primaryBtn._addHandler) {
                this.handler = primaryBtn._addHandler;
                primaryBtn.removeEventListener('click', primaryBtn._addHandler);
                delete primaryBtn._addHandler;
            }
            // Add save handler
            primaryBtn._saveHandler = () => this.save();
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
            secondaryBtn._cancelHandler = () => this.cancel();
            secondaryBtn.addEventListener('click', secondaryBtn._cancelHandler);
        }

        // Focus on the first editable element
        if (nameElement) {
            nameElement.focus();
        }
    }
}

/**
 * Make entry editable on double-click
 * @param {HTMLElement} entry - Entry element
 */
function makeEntryEditable(entry) {
    const titleEl = entry.querySelector('.item-title');
    const subtitleEl = entry.querySelector('.item-subtitle');

    if (titleEl) {
        titleEl.addEventListener('dblclick', () => {
            const editor = new InlineEditor();
            editor.makeEditable(titleEl, 'title');
            showNotification('Փոփոխությունները պահպանվել են');
        });
    }

    if (subtitleEl) {
        subtitleEl.addEventListener('dblclick', () => {
            const editor = new InlineEditor();
            editor.makeEditable(subtitleEl, 'subtitle');
            showNotification('Փոփոխությունները պահպանվել են');
        });
    }
}
//uncomment
//export { InlineEditor, makeEntryEditable };
