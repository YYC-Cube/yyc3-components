/**
 * @file 系统监控面板 / System Monitor Panel
 * @description 实时系统资源监控与 DevOps 健康仪表盘
 * @module components/devops/SystemMonitor
 * @version 0.9.4
 * @since Personalize [Stage3]
 *
 * Real-time system resource monitoring and DevOps health dashboard
 */

import { useEffect, useState } from "react";
import { useDevOps } from "../hooks/useDevOps";
import { useDocker } from "../hooks/useDocker";
import { useTerminal } from "../hooks/useTerminal";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";
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
} from "lucide-react";

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
  const { metrics: devOpsMetrics, infraServices, diagnosticIssues, opsLog } = useDevOps();
  const { metrics: dockerMetrics, resourceUsage, isHealthy: dockerHealthy } = useDocker();
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
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  /**
   * 获取健康图标 / Get health icon
   */
  const getHealthIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  /**
   * 获取严重级别颜色 / Get severity color
   */
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 text-red-500";
      case "warning":
        return "border-yellow-500 text-yellow-500";
      default:
        return "border-blue-500 text-blue-500";
    }
  };

  return (
    <Card className="border-2 border-green-500 bg-black p-0 h-full flex flex-col">
      {/* 头部 / Header */}
      <div className="border-b-2 border-green-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-green-500" />
            <span className="text-green-500 tracking-wider">SYSTEM MONITOR</span>
          </div>
          <div className="text-green-500 text-sm tracking-wider">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* DevOps 总览 / DevOps Overview */}
          <div className="border-2 border-green-500/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-5 h-5 text-green-500" />
              <span className="text-green-500 tracking-wider">DEVOPS METRICS</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-green-500/20 p-3">
                <div className="text-green-500/50 text-xs mb-1">SERVICES</div>
                <div className="text-green-500 text-xl">
                  {devOpsMetrics.healthyServices} / {devOpsMetrics.totalServices}
                </div>
                <Progress
                  value={(devOpsMetrics.healthyServices / devOpsMetrics.totalServices) * 100}
                  className="mt-2 h-1 bg-green-500/20"
                />
              </div>
              <div className="border border-green-500/20 p-3">
                <div className="text-green-500/50 text-xs mb-1">MCP TOOLS</div>
                <div className="text-green-500 text-xl">{devOpsMetrics.registeredTools}</div>
              </div>
              <div className="border border-green-500/20 p-3">
                <div className="text-green-500/50 text-xs mb-1">WORKFLOWS</div>
                <div className="text-green-500 text-xl">{devOpsMetrics.activeWorkflows}</div>
              </div>
              <div className="border border-green-500/20 p-3">
                <div className="text-green-500/50 text-xs mb-1">SUCCESS RATE</div>
                <div className="text-green-500 text-xl">
                  {devOpsMetrics.todaySuccessRate.toFixed(0)}%
                </div>
                <Progress
                  value={devOpsMetrics.todaySuccessRate}
                  className="mt-2 h-1 bg-green-500/20"
                />
              </div>
              <div className="border border-green-500/20 p-3">
                <div className="text-green-500/50 text-xs mb-1">AVG LATENCY</div>
                <div className="text-green-500 text-xl">{devOpsMetrics.avgLatency.toFixed(0)}ms</div>
              </div>
              <div className="border border-green-500/20 p-3">
                <div className="text-green-500/50 text-xs mb-1">EXECUTIONS</div>
                <div className="text-green-500 text-xl">{devOpsMetrics.todayExecutions}</div>
              </div>
            </div>
          </div>

          {/* Docker 状态 / Docker Status */}
          {dockerMetrics && (
            <div className="border-2 border-green-500/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Container className="w-5 h-5 text-green-500" />
                <span className="text-green-500 tracking-wider">DOCKER STATUS</span>
                <Badge
                  variant="outline"
                  className={dockerHealthy ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}
                >
                  {dockerHealthy ? "CONNECTED" : "DISCONNECTED"}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-green-500/20 p-3">
                  <div className="text-green-500/50 text-xs mb-1">CONTAINERS</div>
                  <div className="text-green-500 text-xl">
                    {dockerMetrics.runningContainers} / {dockerMetrics.totalContainers}
                  </div>
                </div>
                <div className="border border-green-500/20 p-3">
                  <div className="text-green-500/50 text-xs mb-1">CPU USAGE</div>
                  <div className="text-green-500 text-xl">{resourceUsage.cpu.toFixed(1)}%</div>
                  <Progress value={resourceUsage.cpu} className="mt-2 h-1 bg-green-500/20" />
                </div>
                <div className="border border-green-500/20 p-3">
                  <div className="text-green-500/50 text-xs mb-1">MEMORY</div>
                  <div className="text-green-500 text-xl">{formatBytes(resourceUsage.memory)}</div>
                </div>
              </div>
            </div>
          )}

          {/* 终端状态 / Terminal Status */}
          <div className="border-2 border-green-500/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TerminalIcon className="w-5 h-5 text-green-500" />
              <span className="text-green-500 tracking-wider">TERMINAL STATUS</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-green-500/20 p-3">
                <div className="text-green-500/50 text-xs mb-1">SESSIONS</div>
                <div className="text-green-500 text-xl">
                  {terminalMetrics.activeSessions} / {terminalMetrics.totalSessions}
                </div>
              </div>
              <div className="border border-green-500/20 p-3">
                <div className="text-green-500/50 text-xs mb-1">COMMANDS</div>
                <div className="text-green-500 text-xl">{terminalMetrics.todayCommands}</div>
              </div>
              <div className="border border-green-500/20 p-3">
                <div className="text-green-500/50 text-xs mb-1">SUCCESS RATE</div>
                <div className="text-green-500 text-xl">{terminalMetrics.successRate.toFixed(0)}%</div>
                <Progress
                  value={terminalMetrics.successRate}
                  className="mt-2 h-1 bg-green-500/20"
                />
              </div>
            </div>
          </div>

          {/* 基础服务健康 / Infrastructure Services Health */}
          <div className="border-2 border-green-500/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-5 h-5 text-green-500" />
              <span className="text-green-500 tracking-wider">SERVICES HEALTH</span>
            </div>
            <div className="space-y-2">
              {infraServices.map((service) => (
                <div
                  key={service.id}
                  className="border border-green-500/20 p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {getHealthIcon(service.health)}
                    <div>
                      <div className="text-green-500">{service.name}</div>
                      <div className="text-green-500/50 text-xs">{service.endpoint}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        service.health === "healthy"
                          ? "border-green-500 text-green-500"
                          : service.health === "degraded"
                          ? "border-yellow-500 text-yellow-500"
                          : "border-red-500 text-red-500"
                      }
                    >
                      {service.health.toUpperCase()}
                    </Badge>
                    <div className="text-green-500/50 text-xs mt-1">{service.latency}ms</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 诊断问题 / Diagnostic Issues */}
          {diagnosticIssues.length > 0 && (
            <div className="border-2 border-yellow-500/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-500 tracking-wider">DIAGNOSTIC ISSUES</span>
                <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                  {diagnosticIssues.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {diagnosticIssues.slice(0, 5).map((issue) => (
                  <div
                    key={issue.id}
                    className={`border p-3 ${getSeverityColor(issue.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="uppercase">{issue.title}</div>
                      <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                        {issue.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs opacity-70">{issue.description}</div>
                    {issue.suggestion && (
                      <div className="text-xs mt-2 opacity-50">💡 {issue.suggestion}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 操作日志 / Operations Log */}
          <div className="border-2 border-green-500/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-green-500 tracking-wider">RECENT OPERATIONS</span>
            </div>
            <div className="space-y-1">
              {opsLog.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="border-b border-green-500/10 pb-1 flex items-start gap-2 text-xs"
                >
                  <span className="text-green-500/50">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span
                    className={
                      log.level === "error"
                        ? "text-red-500"
                        : log.level === "warn"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }
                  >
                    [{log.level.toUpperCase()}]
                  </span>
                  <span className="text-green-500/70 flex-1">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}
