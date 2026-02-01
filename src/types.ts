export interface SyncPathConfig {
  remotePath: string;  // Path on Gateway (e.g., "notes")
  localPath: string;   // Path in vault (e.g., "OpenClaw/Notes")
  enabled: boolean;
}

export interface OpenClawSettings {
  gatewayUrl: string;
  // Token storage - uses encrypted if available, falls back to plaintext
  gatewayTokenEncrypted: string | null;
  gatewayTokenPlaintext: string;
  showActionsInChat: boolean;
  auditLogEnabled: boolean;
  auditLogPath: string;
  // Sync settings
  syncEnabled: boolean;
  syncServerUrl: string;
  syncPaths: SyncPathConfig[];
  syncInterval: number; // minutes, 0 = manual only
  syncConflictBehavior: "ask" | "preferLocal" | "preferRemote";
}

export const DEFAULT_SETTINGS: OpenClawSettings = {
  gatewayUrl: "http://127.0.0.1:18789",
  gatewayTokenEncrypted: null,
  gatewayTokenPlaintext: "",
  showActionsInChat: false,
  auditLogEnabled: false,
  auditLogPath: "OpenClaw/audit-log.md",
  // Sync defaults
  syncEnabled: false,
  syncServerUrl: "http://127.0.0.1:18790",
  syncPaths: [{ remotePath: "notes", localPath: "OpenClaw/Notes", enabled: true }],
  syncInterval: 0,
  syncConflictBehavior: "ask",
};

export interface SyncFileState {
  path: string;
  hash: string;
  modified: string;
  size: number;
}

export interface SyncConflict {
  localPath: string;
  remotePath: string;
  localFile: SyncFileState & { content: string };
  remoteFile: SyncFileState & { content: string };
}

export type OpenClawAction =
  | { action: "createFile"; path: string; content: string }
  | { action: "updateFile"; path: string; content: string }
  | { action: "appendToFile"; path: string; content: string }
  | { action: "deleteFile"; path: string }
  | { action: "renameFile"; path: string; newPath: string }
  | { action: "openFile"; path: string };

export interface ChatMessage {
  role: "user" | "assistant" | "error";
  content: string;
  timestamp: number;
  actions?: OpenClawAction[];
}

export interface ChatResponse {
  text: string;
  actions: OpenClawAction[];
}
