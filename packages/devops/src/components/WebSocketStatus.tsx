/**
 * WebSocket 连接状态组件
 * WebSocket Connection Status Component
 * 
 * 显示 WebSocket 连接状态和统计信息
 * Displays WebSocket connection status and statistics
 * 
 * @module components/devops/WebSocketStatus
 */

import { motion } from 'motion/react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { WebSocketState, WebSocketConnectionInfo, WebSocketStatistics } from '../types/websocket';

/**
 * WebSocket 状态组件属性 / WebSocket Status component props
 */
export interface WebSocketStatusProps {
  /** 连接状态 / Connection state */
  state: WebSocketState;
  /** 连接信息 / Connection info */
  connectionInfo: WebSocketConnectionInfo;
  /** 统计信息 / Statistics */
  statistics: WebSocketStatistics;
  /** 是否使用降级模式 / Is using fallback */
  isFallbackActive: boolean;
  /** 重连函数 / Reconnect function */
  onReconnect: () => void;
  /** 是否紧凑模式 / Compact mode */
  compact?: boolean;
}

/**
 * WebSocket 状态组件 / WebSocket Status Component
 * 
 * @param {WebSocketStatusProps} props - 组件属性 / Component props
 * @returns {JSX.Element} WebSocket 状态UI / WebSocket status UI
 */
export function WebSocketStatus({
  state,
  connectionInfo,
  statistics,
  isFallbackActive,
  onReconnect,
  compact = false,
}: WebSocketStatusProps): JSX.Element {
  /**
   * 获取状态颜色 / Get state color
   */
  const getStateColor = (): string => {
    switch (state) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
      case 'reconnecting':
        return 'text-yellow-500';
      case 'disconnected':
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-green-500/50';
    }
  };
  
  /**
   * 获取状态图标 / Get state icon
   */
  const getStateIcon = () => {
    switch (state) {
      case 'connected':
        return <Wifi className="w-4 h-4" />;
      case 'connecting':
      case 'reconnecting':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'disconnected':
      case 'failed':
        return <WifiOff className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };
  
  /**
   * 获取状态文本 / Get state text
   */
  const getStateText = (): string => {
    switch (state) {
      case 'connected':
        return 'CONNECTED';
      case 'connecting':
        return 'CONNECTING...';
      case 'reconnecting':
        return `RECONNECTING (${connectionInfo.reconnectAttempts})...`;
      case 'disconnected':
        return 'DISCONNECTED';
      case 'failed':
        return 'CONNECTION FAILED';
      default:
        return 'UNKNOWN';
    }
  };
  
  /**
   * 格式化字节数 / Format bytes
   */
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };
  
  /**
   * 格式化时长 / Format duration
   */
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };
  
  // 紧凑模式 / Compact mode
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          className={`flex items-center gap-1 ${getStateColor()}`}
          animate={{ opacity: state === 'connecting' || state === 'reconnecting' ? [1, 0.5, 1] : 1 }}
          transition={{ repeat: state === 'connecting' || state === 'reconnecting' ? Infinity : 0, duration: 1.5 }}
        >
          {getStateIcon()}
          <span className="text-xs tracking-wider">{getStateText()}</span>
        </motion.div>
        
        {isFallbackActive && (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500 text-xs">
            POLLING
          </Badge>
        )}
        
        {(state === 'disconnected' || state === 'failed') && (
          <Button
            size="sm"
            variant="outline"
            onClick={onReconnect}
            className="h-6 text-xs border-green-500 text-green-500 hover:bg-green-500/10"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            RETRY
          </Button>
        )}
      </div>
    );
  }
  
  // 完整模式 / Full mode
  return (
    <Card className="border-2 border-green-500 bg-black p-4">
      <div className="space-y-4">
        {/* 状态头部 / Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className={getStateColor()}
              animate={{ opacity: state === 'connecting' || state === 'reconnecting' ? [1, 0.5, 1] : 1 }}
              transition={{ repeat: state === 'connecting' || state === 'reconnecting' ? Infinity : 0, duration: 1.5 }}
            >
              {getStateIcon()}
            </motion.div>
            <div>
              <div className={`tracking-wider ${getStateColor()}`}>
                {getStateText()}
              </div>
              {connectionInfo.lastConnectedAt && (
                <div className="text-green-500/50 text-xs">
                  LAST: {connectionInfo.lastConnectedAt.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isFallbackActive && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                POLLING MODE
              </Badge>
            )}
            
            {(state === 'disconnected' || state === 'failed') && (
              <Button
                size="sm"
                variant="outline"
                onClick={onReconnect}
                className="border-green-500 text-green-500 hover:bg-green-500/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                RECONNECT
              </Button>
            )}
          </div>
        </div>
        
        {/* 连接信息 / Connection Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-green-500/50 text-xs tracking-wider">SERVER</div>
            <div className="text-green-500 text-sm font-mono break-all">
              {connectionInfo.serverUrl}
            </div>
          </div>
          
          {connectionInfo.connectedDuration > 0 && (
            <div className="space-y-2">
              <div className="text-green-500/50 text-xs tracking-wider">UPTIME</div>
              <div className="text-green-500 text-sm">
                {formatDuration(connectionInfo.connectedDuration)}
              </div>
            </div>
          )}
        </div>
        
        {/* 统计信息 / Statistics */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-green-500/30">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-green-500/50 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>SENT</span>
            </div>
            <div className="text-green-500 text-sm">
              {statistics.messagesSent}
            </div>
            <div className="text-green-500/50 text-xs">
              {formatBytes(statistics.bytesSent)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-green-500/50 text-xs">
              <TrendingDown className="w-3 h-3" />
              <span>RECEIVED</span>
            </div>
            <div className="text-green-500 text-sm">
              {statistics.messagesReceived}
            </div>
            <div className="text-green-500/50 text-xs">
              {formatBytes(statistics.bytesReceived)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-green-500/50 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>ERRORS</span>
            </div>
            <div className={`text-sm ${statistics.errorCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {statistics.errorCount}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-green-500/50 text-xs">
              <Clock className="w-3 h-3" />
              <span>LATENCY</span>
            </div>
            <div className="text-green-500 text-sm">
              {statistics.averageLatency}ms
            </div>
          </div>
        </div>
        
        {/* 错误信息 / Error Info */}
        {connectionInfo.lastError && (
          <div className="flex items-start gap-2 p-3 border border-red-500/30 bg-red-500/5 rounded">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
            <div className="flex-1">
              <div className="text-red-500 text-xs tracking-wider mb-1">ERROR</div>
              <div className="text-red-500/80 text-sm">{connectionInfo.lastError}</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
