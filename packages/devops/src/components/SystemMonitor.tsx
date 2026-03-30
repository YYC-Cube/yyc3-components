/**
 * @file 系统监控面板 / System Monitor Panel
 * @description 实时系统资源监控与 DevOps 健康仪表盘
 * @module components/devops/SystemMonitor
 * @version 0.9.4
 * @since Personalize [Stage3]
 *
 * Real-time system resource monitoring and DevOps health dashboard
 */

import { useEffect, useState } from 'react';
import { useDevOps } from '../hooks/useDevOps';
import { useDocker } from '../hooks/useDocker';
import { useTerminal } from '../hooks/useTerminal';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import {
  Activity,
  Server,
  Database,
  Container,
  Terminal as TerminalIcon,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
} from 'lucide-react';

/**
 * 系统监控面板 / System Monitor Panel
 *
 * 提供全栈系统监控：
 * - DevOps 服务健康状态
 * - Docker 资源使用
 * - 终端活动统计
 * - 智能诊断问题
 *
 * @returns {JSX.Element} 系统监控面板 / System Monitor Panel
 */
export function SystemMonitor(): JSX.Element {
  const {
    metrics: devOpsMetrics,
    infraServices,
    diagnosticIssues,
    opsLog,
  } = useDevOps();
  const {
    metrics: dockerMetrics,
    resourceUsage,
    isHealthy: dockerHealthy,
  } = useDocker();
  const { metrics: terminalMetrics } = useTerminal();

  const [currentTime, setCurrentTime] = useState(new Date());

  /**
   * 更新当前时间 / Update current time
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /**
   * 格式化字节 / Format bytes
   */
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  /**
   * 获取健康图标 / Get health icon
   */
  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  /**
   * 获取严重级别颜色 / Get severity color
   */
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 text-red-500';
      case 'warning':
        return 'border-yellow-500 text-yellow-500';
      default:
        return 'border-blue-500 text-blue-500';
    }
  };

  return (
    <Card className="flex h-full flex-col border-2 border-green-500 bg-black p-0">
      {/* 头部 / Header */}
      <div className="border-b-2 border-green-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-green-500" />
            <span className="tracking-wider text-green-500">
              SYSTEM MONITOR
            </span>
          </div>
          <div className="text-sm tracking-wider text-green-500">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {/* DevOps 总览 / DevOps Overview */}
          <div className="border-2 border-green-500/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Server className="h-5 w-5 text-green-500" />
              <span className="tracking-wider text-green-500">
                DEVOPS METRICS
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-green-500/20 p-3">
                <div className="mb-1 text-xs text-green-500/50">SERVICES</div>
                <div className="text-xl text-green-500">
                  {devOpsMetrics.healthyServices} /{' '}
                  {devOpsMetrics.totalServices}
                </div>
                <Progress
                  value={
                    (devOpsMetrics.healthyServices /
                      devOpsMetrics.totalServices) *
                    100
                  }
                  className="mt-2 h-1 bg-green-500/20"
                />
              </div>
              <div className="border border-green-500/20 p-3">
                <div className="mb-1 text-xs text-green-500/50">MCP TOOLS</div>
                <div className="text-xl text-green-500">
                  {devOpsMetrics.registeredTools}
                </div>
              </div>
              <div className="border border-green-500/20 p-3">
                <div className="mb-1 text-xs text-green-500/50">WORKFLOWS</div>
                <div className="text-xl text-green-500">
                  {devOpsMetrics.activeWorkflows}
                </div>
              </div>
              <div className="border border-green-500/20 p-3">
                <div className="mb-1 text-xs text-green-500/50">
                  SUCCESS RATE
                </div>
                <div className="text-xl text-green-500">
                  {devOpsMetrics.todaySuccessRate.toFixed(0)}%
                </div>
                <Progress
                  value={devOpsMetrics.todaySuccessRate}
                  className="mt-2 h-1 bg-green-500/20"
                />
              </div>
              <div className="border border-green-500/20 p-3">
                <div className="mb-1 text-xs text-green-500/50">
                  AVG LATENCY
                </div>
                <div className="text-xl text-green-500">
                  {devOpsMetrics.avgLatency.toFixed(0)}ms
                </div>
              </div>
              <div className="border border-green-500/20 p-3">
                <div className="mb-1 text-xs text-green-500/50">EXECUTIONS</div>
                <div className="text-xl text-green-500">
                  {devOpsMetrics.todayExecutions}
                </div>
              </div>
            </div>
          </div>

          {/* Docker 状态 / Docker Status */}
          {dockerMetrics && (
            <div className="border-2 border-green-500/30 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Container className="h-5 w-5 text-green-500" />
                <span className="tracking-wider text-green-500">
                  DOCKER STATUS
                </span>
                <Badge
                  variant="outline"
                  className={
                    dockerHealthy
                      ? 'border-green-500 text-green-500'
                      : 'border-red-500 text-red-500'
                  }
                >
                  {dockerHealthy ? 'CONNECTED' : 'DISCONNECTED'}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-green-500/20 p-3">
                  <div className="mb-1 text-xs text-green-500/50">
                    CONTAINERS
                  </div>
                  <div className="text-xl text-green-500">
                    {dockerMetrics.runningContainers} /{' '}
                    {dockerMetrics.totalContainers}
                  </div>
                </div>
                <div className="border border-green-500/20 p-3">
                  <div className="mb-1 text-xs text-green-500/50">
                    CPU USAGE
                  </div>
                  <div className="text-xl text-green-500">
                    {resourceUsage.cpu.toFixed(1)}%
                  </div>
                  <Progress
                    value={resourceUsage.cpu}
                    className="mt-2 h-1 bg-green-500/20"
                  />
                </div>
                <div className="border border-green-500/20 p-3">
                  <div className="mb-1 text-xs text-green-500/50">MEMORY</div>
                  <div className="text-xl text-green-500">
                    {formatBytes(resourceUsage.memory)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 终端状态 / Terminal Status */}
          <div className="border-2 border-green-500/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <TerminalIcon className="h-5 w-5 text-green-500" />
              <span className="tracking-wider text-green-500">
                TERMINAL STATUS
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-green-500/20 p-3">
                <div className="mb-1 text-xs text-green-500/50">SESSIONS</div>
                <div className="text-xl text-green-500">
                  {terminalMetrics.activeSessions} /{' '}
                  {terminalMetrics.totalSessions}
                </div>
              </div>
              <div className="border border-green-500/20 p-3">
                <div className="mb-1 text-xs text-green-500/50">COMMANDS</div>
                <div className="text-xl text-green-500">
                  {terminalMetrics.totalCommands}
                </div>
              </div>
              <div className="border border-green-500/20 p-3">
                <div className="mb-1 text-xs text-green-500/50">
                  SUCCESS RATE
                </div>
                <div className="text-xl text-green-500">
                  {terminalMetrics.totalCommands > 0
                    ? ((terminalMetrics.successfulCommands / terminalMetrics.totalCommands) * 100).toFixed(0)
                    : '0'}%
                </div>
                <Progress
                  value={
                    terminalMetrics.totalCommands > 0
                      ? (terminalMetrics.successfulCommands / terminalMetrics.totalCommands) * 100
                      : 0
                  }
                  className="mt-2 h-1 bg-green-500/20"
                />
              </div>
            </div>
          </div>

          {/* 基础服务健康 / Infrastructure Services Health */}
          <div className="border-2 border-green-500/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" />
              <span className="tracking-wider text-green-500">
                SERVICES HEALTH
              </span>
            </div>
            <div className="space-y-2">
              {infraServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between border border-green-500/20 p-3"
                >
                  <div className="flex items-center gap-3">
                    {getHealthIcon(service.health)}
                    <div>
                      <div className="text-green-500">{service.name}</div>
                      <div className="text-xs text-green-500/50">
                        {service.endpoint}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        service.health === 'healthy'
                          ? 'border-green-500 text-green-500'
                          : service.health === 'degraded'
                            ? 'border-yellow-500 text-yellow-500'
                            : 'border-red-500 text-red-500'
                      }
                    >
                      {service.health.toUpperCase()}
                    </Badge>
                    <div className="mt-1 text-xs text-green-500/50">
                      {service.latency}ms
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 诊断问题 / Diagnostic Issues */}
          {diagnosticIssues.length > 0 && (
            <div className="border-2 border-yellow-500/30 p-4">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="tracking-wider text-yellow-500">
                  DIAGNOSTIC ISSUES
                </span>
                <Badge
                  variant="outline"
                  className="border-yellow-500 text-yellow-500"
                >
                  {diagnosticIssues.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {diagnosticIssues.slice(0, 5).map((issue) => (
                  <div
                    key={issue.id}
                    className={`border p-3 ${getSeverityColor(issue.severity)}`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="uppercase">{issue.title}</div>
                      <Badge
                        variant="outline"
                        className={getSeverityColor(issue.severity)}
                      >
                        {issue.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs opacity-70">
                      {issue.description}
                    </div>
                    {issue.suggestion && (
                      <div className="mt-2 text-xs opacity-50">
                        💡 {issue.suggestion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 操作日志 / Operations Log */}
          <div className="border-2 border-green-500/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="tracking-wider text-green-500">
                RECENT OPERATIONS
              </span>
            </div>
            <div className="space-y-1">
              {opsLog.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-2 border-b border-green-500/10 pb-1 text-xs"
                >
                  <span className="text-green-500/50">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={
                      log.level === 'error'
                        ? 'text-red-500'
                        : log.level === 'warn'
                          ? 'text-yellow-500'
                          : 'text-green-500'
                    }
                  >
                    [{log.level.toUpperCase()}]
                  </span>
                  <span className="flex-1 text-green-500/70">
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}
