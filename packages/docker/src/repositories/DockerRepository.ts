import type {
  DockerContainer,
  DockerImage,
  DockerNetwork,
  DockerVolume,
  DockerLogEntry,
  DockerMetrics,
  ContainerCreateConfig,
  ContainerOperationResult,
  ContainerOperationType,
} from '../types/docker';

export const dockerRepository = {
  async getContainers(): Promise<DockerContainer[]> {
    return [];
  },
  async getImages(): Promise<DockerImage[]> {
    return [];
  },
  async getNetworks(): Promise<DockerNetwork[]> {
    return [];
  },
  async getVolumes(): Promise<DockerVolume[]> {
    return [];
  },
  async getMetrics(): Promise<DockerMetrics | null> {
    return null;
  },
  async containerOperation(
    _containerId: string,
    _operation: ContainerOperationType
  ): Promise<ContainerOperationResult> {
    return {
      operation: _operation,
      containerId: _containerId,
      success: false,
      error: 'Not implemented',
      duration: 0,
      timestamp: new Date().toISOString(),
    };
  },
  async createContainer(_config: ContainerCreateConfig): Promise<string | null> {
    return null;
  },
  async getContainerLogs(_containerId: string, _tail?: number): Promise<DockerLogEntry[]> {
    return [];
  },
};
