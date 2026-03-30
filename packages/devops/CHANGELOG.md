# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-26

### Added

- 🎉 Initial release of @yyc3/devops
- ✨ MCP server management (probe, connect, disconnect, auto-connect)
- ✨ MCP tool execution and result handling
- ✨ Workflow engine (create, update, delete, execute)
- ✨ Infrastructure service management
- ✨ Diagnostic system for infrastructure issues
- ✨ Operations logging and querying
- ✨ DevOps metrics collection and monitoring
- ✨ WebSocket connection status monitoring
- 🎨 UI components (DevOpsHub, GitPanel, SystemMonitor, WebSocketStatus)

### Features

#### MCP Server Management

- Server probing and status checking
- Auto-connect support
- Tool execution with parameter support
- Connection state management

#### Workflow Engine

- Workflow CRUD operations
- Step-based workflow execution
- Workflow execution history
- Parameter injection support

#### Infrastructure Monitoring

- Real-time service health monitoring
- Diagnostic issue tracking
- Automatic issue detection and repair
- Service metadata management

#### Logging

- Operations log with multiple levels
- Log export functionality
- Log filtering and searching
- Timestamp-based queries

#### Metrics

- DevOps KPI tracking
- Performance metrics
- Connection statistics
- System health indicators

### Dependencies

- React ^18.0.0
- React DOM ^18.0.0
- lucide-react ^0.378.0
- clsx ^2.1.1
- tailwind-merge ^2.3.0

### Documentation

- Complete README with examples
- TypeScript type definitions
- API documentation
- Best practices guide

### Notes

- Supports MCP (Model Context Protocol) standard
- Fully TypeScript type-safe
- Comprehensive error handling
- Performance optimized

---

## [Unreleased]

### Planned

- [ ] More diagnostic rules
- [ ] Advanced workflow scheduling
- [ ] Alert notifications
- [ ] Performance dashboard
- [ ] Integration with more DevOps tools
- [ ] Unit tests
- [ ] E2E tests
- [ ] Storybook integration

---

## Links

- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
