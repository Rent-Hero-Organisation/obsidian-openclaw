import { App, PluginSettingTab, Setting } from "obsidian";
import type OpenClawPlugin from "../main";

export class OpenClawSettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: OpenClawPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "OpenClaw Settings" });

    new Setting(containerEl)
      .setName("Gateway URL")
      .setDesc("URL of your OpenClaw gateway. Do not include a trailing slash.")
      .addText((text) =>
        text
          .setPlaceholder("http://127.0.0.1:18789")
          .setValue(this.plugin.settings.gatewayUrl)
          .onChange(async (value) => {
            // Strip trailing slashes to prevent 405 errors
            this.plugin.settings.gatewayUrl = value.replace(/\/+$/, "");
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Gateway Token")
      .setDesc("Authentication token for the OpenClaw gateway")
      .addText((text) => {
        text
          .setPlaceholder("Enter your token")
          .setValue(this.plugin.settings.gatewayToken)
          .onChange(async (value) => {
            this.plugin.settings.gatewayToken = value;
            await this.plugin.saveSettings();
          });
        text.inputEl.type = "password";
      });

    new Setting(containerEl)
      .setName("Show actions in chat")
      .setDesc("Display file action indicators in chat messages")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showActionsInChat)
          .onChange(async (value) => {
            this.plugin.settings.showActionsInChat = value;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h3", { text: "Audit Log" });

    new Setting(containerEl)
      .setName("Enable audit logging")
      .setDesc("Log all file actions to a markdown file for review")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.auditLogEnabled)
          .onChange(async (value) => {
            this.plugin.settings.auditLogEnabled = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Audit log path")
      .setDesc("Path to the audit log file (relative to vault root)")
      .addText((text) =>
        text
          .setPlaceholder("OpenClaw/audit-log.md")
          .setValue(this.plugin.settings.auditLogPath)
          .onChange(async (value) => {
            this.plugin.settings.auditLogPath = value || "OpenClaw/audit-log.md";
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h3", { text: "Connection Test" });

    const testContainer = containerEl.createDiv({ cls: "openclaw-test-container" });
    const testBtn = testContainer.createEl("button", { text: "Test Connection" });
    const testResult = testContainer.createEl("span", { cls: "openclaw-test-result" });

    testBtn.addEventListener("click", async () => {
      testResult.setText("Testing...");
      try {
        const response = await this.plugin.api.chat("Say 'Connection successful!' in 5 words or less", {});
        testResult.setText(`✓ ${response.text}`);
        testResult.addClass("openclaw-test-success");
        testResult.removeClass("openclaw-test-error");
      } catch (err) {
        testResult.setText(`✗ ${err instanceof Error ? err.message : "Failed"}`);
        testResult.addClass("openclaw-test-error");
        testResult.removeClass("openclaw-test-success");
      }
    });
  }
}
