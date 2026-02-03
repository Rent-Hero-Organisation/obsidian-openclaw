# RentHero Sync — Obsidian Plugin

> Forked from [AndyBold/obsidian-openclaw](https://github.com/AndyBold/obsidian-openclaw). Customized for RentHero team collaboration.

Team vault sync & AI chat for the RentHero shared knowledge base. Chat with Thad (AI CTO partner), sync research docs, decisions, and project files bidirectionally between Obsidian and the server.

## What's Different From Upstream

- **Team-focused** — Built for multi-person collaboration, not just single-user
- **RentHero vault structure** — Pre-configured sync paths for our folder conventions
- **Custom sync fixes** — Patched path resolution for nested directory sync
- **Maintained by** the RentHero team

## Install

### Via BRAT (recommended)
1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) in Obsidian
2. Add Beta Plugin: `Rent-Hero-Organisation/obsidian-openclaw`
3. Enable **RentHero Sync** in Community Plugins

### Configuration
| Setting | Value |
|---------|-------|
| Gateway URL | `https://<tailscale-hostname>:18789` |
| Sync Server URL | `https://<tailscale-hostname>:18790` |
| Token | Get from team lead |

### Sync Paths
Configure these in plugin settings:

| Remote | Local | Contents |
|--------|-------|----------|
| `docs` | `docs` | Research, codebase analysis |
| `decisions` | `decisions` | Architecture decision records |
| `projects` | `projects` | Taskboard, sprint plans |
| `people` | `people` | Team member profiles |
| `notes` | `notes` | General notes, guides |
| `lessons` | `lessons` | Learnings and insights |
| `memory` | `memory` | AI agent session logs |
| `handoffs` | `handoffs` | Agent session continuity |
| `inbox` | `inbox` | Quick captures |

## Vault Guide

See [notes/vault-guide.md](https://github.com/Rent-Hero-Organisation/obsidian-openclaw/blob/main/README.md) in the synced vault for full contributing guidelines.

## Development

```bash
git clone https://github.com/Rent-Hero-Organisation/obsidian-openclaw.git
cd obsidian-openclaw
npm install
npm run dev    # Watch mode
npm run build  # Production
```

## Pulling Upstream Updates

```bash
git fetch upstream
git merge upstream/main
# Resolve conflicts, test, push
```

## License

MIT (inherited from upstream)

---

*Part of the [RentHero](https://renthero.co.za) platform.*
