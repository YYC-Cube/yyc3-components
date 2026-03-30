/**
 * @file DevOps 集成面板 / DevOps Hub Panel
 * @description 集成终端、容器管理、系统监控的统一 DevOps 工作台
 * @module components/devops/DevOpsHub
 * @version 0.9.4
 * @since Personalize [Stage3]
 *
 * Unified DevOps workspace integrating terminal, container management, and system monitoring
 */

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { WebTerminal } from "./terminal/WebTerminal";
import { ContainerManager } from "./docker/ContainerManager";
import { SystemMonitor } from "./SystemMonitor";
import { GitPanel } from "./GitPanel";
import { EnvironmentBadge } from "./EnvironmentBadge";
import {
  Terminal,
  Box,
  Activity,
  Workflow,
  Server,
  GitBranch,
  Code2,
} from "lucide-react";
import { useDevOps } from "../hooks/useDevOps";
import { useDocker } from "../hooks/useDocker";
import { useTerminal } from "../hooks/useTerminal";

/**
 * DevOps 集成面板 / DevOps Hub Panel
 *
 * 提供完整的 DevOps 工作台：
 * - Web 终端集成
 * - Docker 容器管理
 * - 系统监控仪表盘
 * - MCP 工具调用
 * - 工作流管理
 *
 * @returns {JSX.Element} DevOps 集成面板 / DevOps Hub Panel
 */
export function DevOpsHub(): JSX.Element {
  const { metrics: devOpsMetrics, servers } = useDevOps();
  const { isHealthy: dockerHealthy } = useDocker();
  const { metrics: terminalMetrics } = useTerminal();

  const [activeTab, setActiveTab] = useState<"terminal" | "docker" | "monitor" | "git">("terminal");
  const [startTime] = useState(Date.now());

  /**
   * 获取标签状态徽章 / Get tab status badge
   */
  const getTabBadge = (tab: string) => {
    switch (tab) {
      case "terminal":
        return terminalMetrics.activeSessions > 0 ? (
          <Badge variant="outline" className="ml-2 border-green-500 text-green-500 text-xs">
            {terminalMetrics.activeSessions}
          </Badge>
        ) : null;
      case "docker":
        return (
          <Badge
            variant="outline"
            className={`ml-2 text-xs ${
              dockerHealthy ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
            }`}
          >
            {dockerHealthy ? "ON" : "OFF"}
          </Badge>
        );
      case "monitor":
        return devOpsMetrics.unresolvedIssues > 0 ? (
          <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-500 text-xs">
            {devOpsMetrics.unresolvedIssues}
          </Badge>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* 头部横幅 / Header Banner */}
      <div className="border-b-2 border-green-500 p-4 bg-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="w-7 h-7 text-green-500" />
            <div>
              <div className="text-green-500 tracking-wider text-xl">DEVOPS HUB</div>
              <div className="text-green-500/50 text-xs tracking-wider">
                CODE | AI | FAMILY v0.9.4 [PERSONALIZE]
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-green-500" />
              <span className="text-green-500 text-sm">
                {devOpsMetrics.healthyServices}/{devOpsMetrics.totalServices} SERVICES
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-green-500" />
              <span className="text-green-500 text-sm">
                {devOpsMetrics.activeWorkflows} WORKFLOWS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-green-500 text-sm">
                {devOpsMetrics.todaySuccessRate.toFixed(0)}% SUCCESS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 / Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          className="h-full flex flex-col"
        >
          <TabsList className="border-b border-green-500/30 bg-black rounded-none w-full justify-start p-0">
            <TabsTrigger
              value="terminal"
              className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-6 py-3"
            >
              <Terminal className="w-4 h-4 mr-2" />
              TERMINAL
              {getTabBadge("terminal")}
            </TabsTrigger>
            <TabsTrigger
              value="docker"
              className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-6 py-3"
            >
              <Box className="w-4 h-4 mr-2" />
              DOCKER
              {getTabBadge("docker")}
            </TabsTrigger>
            <TabsTrigger
              value="monitor"
              className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-6 py-3"
            >
              <Activity className="w-4 h-4 mr-2" />
              MONITOR
              {getTabBadge("monitor")}
            </TabsTrigger>
            <TabsTrigger
              value="git"
              className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-6 py-3"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              GIT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terminal" className="flex-1 mt-0 p-4">
            <WebTerminal />
          </TabsContent>

          <TabsContent value="docker" className="flex-1 mt-0 p-4">
            <ContainerManager />
          </TabsContent>

          <TabsContent value="monitor" className="flex-1 mt-0 p-4">
            <SystemMonitor />
          </TabsContent>

          <TabsContent value="git" className="flex-1 mt-0 p-4">
            <GitPanel />
          </TabsContent>
        </Tabs>
      </div>

      {/* 状态栏 / Status Bar */}
      <div className="border-t border-green-500/30 p-2 bg-black flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-green-500/50">
          <span>YYC³ AI FAMILY</span>
          <span>•</span>
          <EnvironmentBadge />
          <span>•</span>
          <span>MCP SERVERS: {servers.filter((s) => s.status === "connected").length}</span>
        </div>
        <div className="flex items-center gap-4 text-green-500/50">
          <span>SESSION: {new Date().toLocaleDateString()}</span>
          <span>•</span>
          <span>UPTIME: {Math.floor((Date.now() - startTime) / 1000)}s</span>
        </div>
      </div>
    </div>
  );
}