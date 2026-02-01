import { App, Modal, MarkdownRenderer } from "obsidian";
import { SyncConflict } from "./types";

export class ConflictModal extends Modal {
  private result: "local" | "remote" | "skip" = "skip";
  private resolvePromise: (value: "local" | "remote" | "skip") => void;
  private showDiff = false;

  constructor(
    app: App,
    private conflict: SyncConflict
  ) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("openclaw-conflict-modal");

    contentEl.createEl("h2", { text: "Sync Conflict" });
    contentEl.createEl("p", { 
      text: `The file "${this.conflict.localPath}" has been modified in both locations.`,
      cls: "openclaw-conflict-desc"
    });

    // File comparison
    const comparisonEl = contentEl.createDiv({ cls: "openclaw-conflict-comparison" });

    // Local file info
    const localEl = comparisonEl.createDiv({ cls: "openclaw-conflict-side openclaw-conflict-local" });
    localEl.createEl("h3", { text: "📁 Local (Obsidian)" });
    this.renderFileInfo(localEl, {
      modified: this.conflict.localFile.modified,
      size: this.conflict.localFile.size,
    });

    // Remote file info
    const remoteEl = comparisonEl.createDiv({ cls: "openclaw-conflict-side openclaw-conflict-remote" });
    remoteEl.createEl("h3", { text: "☁️ Remote (Gateway)" });
    this.renderFileInfo(remoteEl, {
      modified: this.conflict.remoteFile.modified,
      size: this.conflict.remoteFile.size,
    });

    // Toggle diff view
    const diffToggle = contentEl.createDiv({ cls: "openclaw-conflict-diff-toggle" });
    const diffBtn = diffToggle.createEl("button", { 
      text: "Show Side-by-Side", 
      cls: "openclaw-btn-secondary" 
    });
    diffBtn.addEventListener("click", () => {
      this.showDiff = !this.showDiff;
      diffBtn.setText(this.showDiff ? "Hide Side-by-Side" : "Show Side-by-Side");
      this.renderDiff(contentEl);
    });

    // Diff container (initially hidden)
    contentEl.createDiv({ cls: "openclaw-conflict-diff", attr: { id: "diff-container" } });

    // Action buttons
    const buttonsEl = contentEl.createDiv({ cls: "openclaw-conflict-buttons" });

    const keepLocalBtn = buttonsEl.createEl("button", { 
      text: "Keep Local",
      cls: "openclaw-btn-primary"
    });
    keepLocalBtn.addEventListener("click", () => {
      this.result = "local";
      this.close();
    });

    const keepRemoteBtn = buttonsEl.createEl("button", { 
      text: "Keep Remote",
      cls: "openclaw-btn-primary"
    });
    keepRemoteBtn.addEventListener("click", () => {
      this.result = "remote";
      this.close();
    });

    const skipBtn = buttonsEl.createEl("button", { 
      text: "Skip",
      cls: "openclaw-btn-secondary"
    });
    skipBtn.addEventListener("click", () => {
      this.result = "skip";
      this.close();
    });
  }

  private renderFileInfo(container: HTMLElement, info: { modified: string; size: number }) {
    const infoEl = container.createDiv({ cls: "openclaw-conflict-info" });
    
    const modDate = new Date(info.modified);
    infoEl.createEl("div", { 
      text: `Modified: ${modDate.toLocaleString()}`,
      cls: "openclaw-conflict-meta"
    });
    infoEl.createEl("div", { 
      text: `Size: ${this.formatSize(info.size)}`,
      cls: "openclaw-conflict-meta"
    });
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private renderDiff(contentEl: HTMLElement) {
    const diffContainer = contentEl.querySelector("#diff-container") as HTMLElement;
    if (!diffContainer) return;

    diffContainer.empty();

    if (!this.showDiff) {
      diffContainer.style.display = "none";
      return;
    }

    diffContainer.style.display = "flex";

    // Local content
    const localDiff = diffContainer.createDiv({ cls: "openclaw-diff-pane" });
    localDiff.createEl("h4", { text: "Local" });
    const localContent = localDiff.createEl("pre", { cls: "openclaw-diff-content" });
    localContent.createEl("code", { text: this.conflict.localFile.content });

    // Remote content
    const remoteDiff = diffContainer.createDiv({ cls: "openclaw-diff-pane" });
    remoteDiff.createEl("h4", { text: "Remote" });
    const remoteContent = remoteDiff.createEl("pre", { cls: "openclaw-diff-content" });
    remoteContent.createEl("code", { text: this.conflict.remoteFile.content });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
    if (this.resolvePromise) {
      this.resolvePromise(this.result);
    }
  }

  async waitForResult(): Promise<"local" | "remote" | "skip"> {
    return new Promise((resolve) => {
      this.resolvePromise = resolve;
      this.open();
    });
  }
}
