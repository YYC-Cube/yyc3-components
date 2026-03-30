/**
 * @file Docker 容器管理组件 / Docker Container Manager Component
 * @description Docker 容器生命周期管理界面
 * @module components/docker/ContainerManager
 * @version 0.9.4
 * @since Personalize [Stage3]
 *
 * Docker container lifecycle management interface
 */

import { useState } from "react";
import { useDocker } from "../hooks/useDocker";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Container,
  Play,
  Square,
  RotateCw,
  Trash2,
  Pause,
  Terminal,
  Activity,
  HardDrive,
  Network,
  FileText,
} from "lucide-react";
import type { DockerContainer, ContainerOperationType } from "../types/docker";

/**
 * Docker 容器管理组件 / Docker Container Manager Component
 *
 * 提供完整的 Docker 容器管理：
 * - 容器列表与状态
 * - 生命周期操作（启动、停止、重启）
 * - 资源监控
 * - 日志查看
 *
 * @returns {JSX.Element} Docker 容器管理组件 / Docker Container Manager Component
 */
export function ContainerManager(): JSX.Element {
  const {
    containers,
    containerOperation,
    getContainerLogs,
    images,
    networks,
    volumes,
    metrics,
    resourceUsage,
    isHealthy,
    isOperating,
    refresh,
  } = useDocker();

  const [selectedTab, setSelectedTab] = useState<"containers" | "images" | "networks" | "volumes">(
    "containers"
  );
  const [selectedContainer, setSelectedContainer] = useState<DockerContainer | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  /**
   * 处理容器操作 / Handle container operation
   */
  const handleOperation = async (containerId: string, operation: ContainerOperationType) => {
    try {
      await containerOperation(containerId, operation);
    } catch (error) {
      // 错误已在 Hook 层处理 / Error handled in Hook layer
    }
  };

  /**
   * 获取容器状态颜色 / Get container status color
   */
  const getStatusColor = (status: DockerContainer["status"]) => {
    switch (status) {
      case "running":
        return "text-green-500 border-green-500";
      case "exited":
        return "text-gray-500 border-gray-500";
      case "paused":
        return "text-yellow-500 border-yellow-500";
      default:
        return "text-red-500 border-red-500";
    }
  };

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
   * 查看容器日志 / View container logs
   */
  const handleViewLogs = async (container: DockerContainer) => {
    setSelectedContainer(container);
    setShowLogs(true);
    try {
      const logEntries = await getContainerLogs(container.id, 100);
      setLogs(logEntries.map((entry) => `[${entry.stream}] ${entry.content}`));
    } catch {
      setLogs(["FAILED_TO_FETCH_LOGS / 获取日志失败"]);
    }
  };

  return (
    <Card className="border-2 border-green-500 bg-black p-0 h-full flex flex-col">
      {/* 头部 / Header */}
      <div className="border-b-2 border-green-500 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Container className="w-6 h-6 text-green-500" />
            <span className="text-green-500 tracking-wider">DOCKER MANAGER</span>
            <Badge
              variant="outline"
              className={`${isHealthy ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}`}
            >
              {isHealthy ? "CONNECTED" : "DISCONNECTED"}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
            onClick={() => refresh()}
          >
            <RotateCw className="w-4 h-4 mr-1" />
            REFRESH
          </Button>
        </div>

        {/* 指标 / Metrics */}
        {metrics && (
          <div className="grid grid-cols-4 gap-3">
            <div className="border border-green-500/30 p-2">
              <div className="text-green-500/50 text-xs mb-1">CONTAINERS</div>
              <div className="text-green-500">
                {metrics.runningContainers} / {metrics.totalContainers}
              </div>
            </div>
            <div className="border border-green-500/30 p-2">
              <div className="text-green-500/50 text-xs mb-1">CPU</div>
              <div className="text-green-500">{resourceUsage.cpu.toFixed(1)}%</div>
            </div>
            <div className="border border-green-500/30 p-2">
              <div className="text-green-500/50 text-xs mb-1">MEMORY</div>
              <div className="text-green-500">{formatBytes(resourceUsage.memory)}</div>
            </div>
            <div className="border border-green-500/30 p-2">
              <div className="text-green-500/50 text-xs mb-1">IMAGES</div>
              <div className="text-green-500">{metrics.totalImages}</div>
            </div>
          </div>
        )}
      </div>

      {/* 标签页 / Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={(v) => setSelectedTab(v as typeof selectedTab)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="border-b border-green-500/30 bg-transparent rounded-none w-full justify-start">
          <TabsTrigger
            value="containers"
            className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500"
          >
            <Container className="w-4 h-4 mr-2" />
            CONTAINERS ({containers.length})
          </TabsTrigger>
          <TabsTrigger
            value="images"
            className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500"
          >
            <HardDrive className="w-4 h-4 mr-2" />
            IMAGES ({images.length})
          </TabsTrigger>
          <TabsTrigger
            value="networks"
            className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500"
          >
            <Network className="w-4 h-4 mr-2" />
            NETWORKS ({networks.length})
          </TabsTrigger>
          <TabsTrigger
            value="volumes"
            className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500"
          >
            <HardDrive className="w-4 h-4 mr-2" />
            VOLUMES ({volumes.length})
          </TabsTrigger>
        </TabsList>

        {/* 容器列表 / Container List */}
        <TabsContent value="containers" className="flex-1 mt-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {containers.map((container) => (
                <div
                  key={container.id}
                  className="border-2 border-green-500/30 p-4 hover:border-green-500/50"
                >
                  {/* 容器头部 / Container Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-green-500">{container.name}</span>
                        <Badge
                          variant="outline"
                          className={getStatusColor(container.status)}
                        >
                          {container.status.toUpperCase()}
                        </Badge>
                        {container.health !== "none" && (
                          <Badge
                            variant="outline"
                            className={
                              container.health === "healthy"
                                ? "border-green-500 text-green-500"
                                : "border-yellow-500 text-yellow-500"
                            }
                          >
                            {container.health.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <div className="text-green-500/50 text-xs">
                        {container.image} | ID: {container.id.slice(0, 12)}
                      </div>
                    </div>
                    
                    {/* 操作按钮 / Action Buttons */}
                    <div className="flex items-center gap-2">
                      {container.status === "running" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                            onClick={() => handleOperation(container.id, "pause")}
                            disabled={isOperating}
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-black"
                            onClick={() => handleOperation(container.id, "stop")}
                            disabled={isOperating}
                          >
                            <Square className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {container.status === "exited" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                          onClick={() => handleOperation(container.id, "start")}
                          disabled={isOperating}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                        onClick={() => handleOperation(container.id, "restart")}
                        disabled={isOperating}
                      >
                        <RotateCw className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                        onClick={() => handleViewLogs(container)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* 资源使用 / Resource Usage */}
                  {container.stats && (
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="border border-green-500/20 p-2">
                        <div className="text-green-500/50 mb-1">CPU</div>
                        <div className="text-green-500">{container.stats.cpuPercent.toFixed(1)}%</div>
                      </div>
                      <div className="border border-green-500/20 p-2">
                        <div className="text-green-500/50 mb-1">MEMORY</div>
                        <div className="text-green-500">
                          {formatBytes(container.stats.memoryUsage)}
                        </div>
                      </div>
                      <div className="border border-green-500/20 p-2">
                        <div className="text-green-500/50 mb-1">NET RX</div>
                        <div className="text-green-500">
                          {formatBytes(container.stats.networkRx)}
                        </div>
                      </div>
                      <div className="border border-green-500/20 p-2">
                        <div className="text-green-500/50 mb-1">NET TX</div>
                        <div className="text-green-500">
                          {formatBytes(container.stats.networkTx)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 镜像列表 / Images List */}
        <TabsContent value="images" className="flex-1 mt-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="border border-green-500/30 p-3 hover:border-green-500/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-green-500 mb-1">
                        {image.repoTags.length > 0 ? image.repoTags[0] : "UNTAGGED"}
                      </div>
                      <div className="text-green-500/50 text-xs">
                        {image.id.slice(0, 19)} | {formatBytes(image.size)}
                      </div>
                    </div>
                    {image.isDangling && (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        DANGLING
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 网络列表 / Networks List */}
        <TabsContent value="networks" className="flex-1 mt-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {networks.map((network) => (
                <div
                  key={network.id}
                  className="border border-green-500/30 p-3 hover:border-green-500/50"
                >
                  <div className="text-green-500 mb-1">{network.name}</div>
                  <div className="text-green-500/50 text-xs">
                    {network.driver.toUpperCase()} | {network.subnet} | {network.containers.length}{" "}
                    CONTAINERS
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 卷列表 / Volumes List */}
        <TabsContent value="volumes" className="flex-1 mt-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {volumes.map((volume) => (
                <div
                  key={volume.name}
                  className="border border-green-500/30 p-3 hover:border-green-500/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-green-500 mb-1">{volume.name}</div>
                      <div className="text-green-500/50 text-xs">
                        {volume.driver.toUpperCase()} | {volume.mountpoint}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        volume.inUse
                          ? "border-green-500 text-green-500"
                          : "border-gray-500 text-gray-500"
                      }
                    >
                      {volume.inUse ? "IN USE" : "UNUSED"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* 日志弹窗 / Logs Modal */}
      {showLogs && selectedContainer && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
          <Card className="border-2 border-green-500 bg-black w-4/5 h-4/5 flex flex-col">
            <div className="border-b-2 border-green-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-500" />
                <span className="text-green-500">LOGS: {selectedContainer.name}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-black"
                onClick={() => setShowLogs(false)}
              >
                CLOSE
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <pre className="text-green-500 text-xs font-mono whitespace-pre-wrap">
                {logs.join("\n")}
              </pre>
            </ScrollArea>
          </Card>
        </div>
      )}
    </Card>
  );
}
