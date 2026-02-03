export interface SyncPathConfig {
  remotePath: string;  // Path on Gateway (e.g., "notes")
  localPath: string;   // Path in vault (e.g., "RentHero/Notes")
  enabled: boolean;
}

// Hardcoded vault structure — update here, push to repo, everyone gets it
export const RENTHERO_SYNC_PATHS: SyncPathConfig[] = [
  { remotePath: "docs",      localPath: "RentHero/Docs",      enabled: true },
  { remotePath: "repos",     localPath: "RentHero/Repos",     enabled: true },
  { remotePath: "decisions", localPath: "RentHero/Decisions",  enabled: true },
  { remotePath: "projects",  localPath: "RentHero/Projects",   enabled: true },
  { remotePath: "notes",     localPath: "RentHero/Notes",      enabled: true },
  { remotePath: "people",    localPath: "RentHero/People",     enabled: true },
  { remotePath: "lessons",   localPath: "RentHero/Lessons",    enabled: true },
  { remotePath: "templates", localPath: "RentHero/Templates",  enabled: true },
  { remotePath: "inbox",     localPath: "RentHero/Inbox",      enabled: true },
  { remotePath: "memory",    localPath: "RentHero/Memory",     enabled: true },
  { remotePath: "handoffs",  localPath: "RentHero/Handoffs",   enabled: true },
];

export interface RennieSettings {
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

export const DEFAULT_SETTINGS: RennieSettings = {
  gatewayUrl: "http://127.0.0.1:18789",
  gatewayTokenEncrypted: null,
  gatewayTokenPlaintext: "",
  showActionsInChat: false,
  auditLogEnabled: false,
  auditLogPath: "RentHero/audit-log.md",
  // Sync defaults
  syncEnabled: false,
  syncServerUrl: "http://127.0.0.1:18790",
  syncPaths: [...RENTHERO_SYNC_PATHS],
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

export type RennieAction =
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
  actions?: RennieAction[];
}

export interface ChatResponse {
  text: string;
  actions: RennieAction[];
}
