// Tyros Admin - Bottom Sheet & Modal Component (js/sheet.js)
class SheetManager {
  constructor() {
    this.activeSheet = null;
    this.keyHandler = null;
  }

  show({ title, subtitle, contentEl, actions = [], onDismiss }) {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.className = 'sheet-backdrop';

    const sheet = document.createElement('div');
    sheet.className = 'sheet-container';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');

    // Drag handle for iOS feel
    const handle = document.createElement('div');
    handle.className = 'sheet-handle';
    sheet.appendChild(handle);

    // Title
    if (title) {
      const h3 = document.createElement('h3');
      h3.style.fontFamily = 'var(--font-display)';
      h3.style.fontSize = '22px';
      h3.style.fontWeight = '700';
      h3.style.color = 'var(--text-primary)';
      h3.style.lineHeight = '1.2';
      h3.textContent = title;
      sheet.appendChild(h3);
    }

    // Subtitle
    if (subtitle) {
      const p = document.createElement('p');
      p.style.fontSize = '13.5px';
      p.style.color = 'var(--text-muted)';
      p.style.marginTop = '4px';
      p.style.marginBottom = '16px';
      p.textContent = subtitle;
      sheet.appendChild(p);
    }

    // Content element
    if (contentEl) {
      sheet.appendChild(contentEl);
    }

    // Actions container
    if (actions.length > 0) {
      const actionsDiv = document.createElement('div');
      actionsDiv.style.display = 'flex';
      actionsDiv.style.gap = '10px';
      actionsDiv.style.marginTop = '20px';
      actionsDiv.style.justifyContent = 'flex-end';

      actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = action.primary ? 'btn-primary' : 'btn-secondary';
        btn.textContent = action.label;
        btn.style.flex = action.fullWidth ? '1' : 'initial';
        if (action.danger) {
          btn.style.backgroundColor = 'var(--status-overdue)';
          btn.style.color = '#FFFFFF';
        }
        btn.addEventListener('click', async (e) => {
          if (action.onClick) {
            await action.onClick(e);
          }
          this.close();
        });
        actionsDiv.appendChild(btn);
      });

      sheet.appendChild(actionsDiv);
    }

    backdrop.appendChild(sheet);
    document.body.appendChild(backdrop);

    // Animate in
    requestAnimationFrame(() => {
      backdrop.classList.add('active');
    });

    // Close on backdrop tap
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        if (onDismiss) onDismiss();
        this.close();
      }
    });

    // Close on Escape
    this.keyHandler = (e) => {
      if (e.key === 'Escape') {
        if (onDismiss) onDismiss();
        this.close();
      }
    };
    window.addEventListener('keydown', this.keyHandler);

    this.activeSheet = backdrop;
    return sheet;
  }

  confirm({ title = 'Confirm Action', message = 'Are you sure you want to proceed?', confirmText = 'Confirm', danger = false, onConfirm }) {
    const p = document.createElement('p');
    p.style.fontSize = '14px';
    p.style.color = 'var(--text-secondary)';
    p.style.marginTop = '6px';
    p.textContent = message;

    return this.show({
      title,
      contentEl: p,
      actions: [
        { label: 'Cancel', primary: false },
        { label: confirmText, primary: true, danger, onClick: onConfirm }
      ]
    });
  }

  close() {
    if (!this.activeSheet) return;
    const sheet = this.activeSheet;
    sheet.classList.remove('active');
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
    setTimeout(() => {
      if (sheet.parentNode) {
        sheet.parentNode.removeChild(sheet);
      }
    }, 250);
    this.activeSheet = null;
  }
}

export const Sheet = new SheetManager();
