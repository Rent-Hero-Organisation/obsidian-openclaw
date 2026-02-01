export interface OpenClawSettings {
  gatewayUrl: string;
  gatewayToken: string;
  showActionsInChat: boolean;
  auditLogEnabled: boolean;
  auditLogPath: string;
}

export const DEFAULT_SETTINGS: OpenClawSettings = {
  gatewayUrl: "http://127.0.0.1:18789",
  gatewayToken: "",
  showActionsInChat: false,
  auditLogEnabled: false,
  auditLogPath: "OpenClaw/audit-log.md",
};

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
