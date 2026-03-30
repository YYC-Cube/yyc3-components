# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-26

### Added
- 🎉 Initial release of @yyc3/collaboration
- ✨ CRDT collaborative editing engine (Conflict-free Replicated Data Types)
- ✨ OT operation transformation (Operational Transformation)
- ✨ Presence user awareness (cursor positions, selection ranges)
- ✨ Real-time collaboration components (online users, edit status)
- ✨ Conflict detection and resolution (Last-Writer-Wins + OT merge)
- ✨ File synchronization (multi-file sync, conflict merge)
- ✨ Offline editing buffering (offline operations, reconnection sync)
- ✨ Version vector management (Version Vector)
- 🎨 Monaco Editor integration
- 🎨 13 collaboration components

### Components Included

#### Core Components
- MonacoCodeEditor - Professional code editor with collaboration
- CollaborationPresence - Display online users and cursors
- DiffViewer - File diff comparison view

#### UI Components
- UserAIPanel - User AI panel
- CodeDetailPanel - Code detail panel
- CollabViewSwitcher - Collaboration view switcher
- TerminalPanel - Terminal panel
- ProjectFileManager - Project file manager
- ProjectTemplateSelector - Project template selector
- SandboxPreview - Sandbox preview
- GlobalSearchPalette - Global search palette
- DraggablePanelLayout - Draggable panel layout
- EditorTabBar - Editor tab bar

### Features

#### Collaborative Editing
- Multi-user real-time editing
- CRDT-based conflict resolution
- OT operation transformation
- Presence awareness
- Cursor synchronization
- Selection synchronization

#### File Sync
- Multi-file synchronization
- Conflict detection and resolution
- Offline editing support
- Automatic reconnection sync

#### Performance
- Optimistic updates
- Operation batching
- Conflict-free merging
- Efficient diff computation

### Dependencies
- React ^18.0.0
- React DOM ^18.0.0
- @monaco-editor/react ^4.6.0
- lucide-react ^0.378.0
- clsx ^2.1.1
- tailwind-merge ^2.3.0
- diff ^5.2.0

### Documentation
- Complete README with examples
- TypeScript type definitions
- API documentation
- Best practices guide

### Notes
- Supports multi-user real-time collaborative editing
- Automatic conflict handling
- Offline editing support
- Professional code editor integration

---

## [Unreleased]

### Planned
- [ ] More OT algorithms
- [ ] Advanced conflict resolution strategies
- [ ] Rich text collaboration
- [ ] Video/audio collaboration
- [ ] More presence features
- [ ] Unit tests
- [ ] E2E tests
- [ ] Performance optimization

---

## Links

- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
