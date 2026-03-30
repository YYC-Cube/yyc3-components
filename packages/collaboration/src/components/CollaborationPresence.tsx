/**
 * CollaborationPresence - 协同参与者在线状态指示器
 *
 * 职责：
 * - 显示当前协同参与者头像列表
 * - 实时光标/选区位置
 * - 在线/离线状态
 * - 协同会话信息
 *
 * @file components/collaboration/CollaborationPresence.tsx
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Circle,
  Wifi,
  WifiOff,
  GitBranch,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { cn } from './ui/utils';
import type {
  CollaborationParticipant,
  CollaborationSession,
} from '../types/collaboration';

// ==========================================
// Types
// ==========================================

export interface CollaborationPresenceProps {
  participants: CollaborationParticipant[];
  session: CollaborationSession | null;
  isConnected: boolean;
  version: number;
  conflictCount: number;
}

// ==========================================
// Component
// ==========================================

export function CollaborationPresence({
  participants,
  session,
  isConnected,
  version,
  conflictCount,
}: CollaborationPresenceProps) {
  const [expanded, setExpanded] = useState(false);

  const onlineCount = participants.filter((p) => p.isOnline).length;

  return (
    <div className="relative">
      {/* Compact Bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 rounded-lg border border-white/[0.04] bg-black/20 px-2.5 py-1 transition-all hover:border-white/[0.08]"
      >
        {/* Connection Status */}
        <div
          className={cn(
            'flex items-center gap-1 font-mono text-[9px]',
            isConnected ? 'text-emerald-500' : 'text-blue-500'
          )}
        >
          {isConnected ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          <span>{isConnected ? 'LIVE' : 'LOCAL'}</span>
        </div>

        <div className="h-3 w-px bg-white/[0.06]" />

        {/* Participant Avatars */}
        <div className="flex items-center -space-x-1">
          {participants.slice(0, 4).map((p) => (
            <div
              key={p.userId}
              className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-900 text-[7px] text-white"
              style={{ backgroundColor: p.avatarColor }}
              title={p.userName}
            >
              {p.userName.charAt(0)}
            </div>
          ))}
          {participants.length > 4 && (
            <div className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-900 bg-slate-700 text-[7px] text-slate-400">
              +{participants.length - 4}
            </div>
          )}
        </div>

        <span className="font-mono text-[9px] text-slate-600">
          {onlineCount} 在线
        </span>

        {/* Version Badge */}
        <span className="rounded bg-black/30 px-1 py-0.5 font-mono text-[8px] text-slate-700">
          v{version}
        </span>

        {conflictCount > 0 && (
          <span className="rounded bg-amber-500/10 px-1 py-0.5 font-mono text-[8px] text-amber-400">
            {conflictCount} 冲突
          </span>
        )}

        <ChevronDown
          className={cn(
            'h-3 w-3 text-slate-600 transition-transform',
            expanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            className="absolute right-0 top-full z-50 mt-1 min-w-[260px] rounded-xl border border-white/[0.08] bg-slate-900/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            {/* Session Info */}
            {session && (
              <div className="mb-2 border-b border-white/[0.04] pb-2">
                <div className="mb-1 font-mono text-[9px] uppercase tracking-widest text-slate-600">
                  协同会话
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                  <GitBranch className="h-3 w-3" />
                  <span className="truncate">
                    {session.sessionId.slice(0, 20)}...
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>
                    创建于 {new Date(session.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}

            {/* Participants List */}
            <div className="mb-1.5 font-mono text-[9px] uppercase tracking-widest text-slate-600">
              参与者 ({participants.length})
            </div>
            <div className="space-y-1.5">
              {participants.map((p) => (
                <div key={p.userId} className="flex items-center gap-2">
                  <div
                    className="flex h-5 w-5 flex-none items-center justify-center rounded-full text-[8px] text-white"
                    style={{ backgroundColor: p.avatarColor }}
                  >
                    {p.userName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-mono text-[10px] text-slate-300">
                      {p.userName}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[8px] text-slate-600">
                      <Circle
                        className="h-1.5 w-1.5"
                        style={{
                          color: p.isOnline ? '#10b981' : '#475569',
                          fill: p.isOnline ? '#10b981' : '#475569',
                        }}
                      />
                      <span>{p.isOnline ? '在线' : '离线'}</span>
                      <span className="text-slate-700">|</span>
                      <span>
                        {p.role === 'owner'
                          ? '所有者'
                          : p.role === 'editor'
                            ? '编辑者'
                            : '查看者'}
                      </span>
                      {p.cursor && (
                        <>
                          <span className="text-slate-700">|</span>
                          <span>
                            L{p.cursor.line}:C{p.cursor.column}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-2 flex items-center justify-between border-t border-white/[0.04] pt-2 font-mono text-[9px] text-slate-600">
              <span>文档版本: v{version}</span>
              <span>CRDT 模式</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
