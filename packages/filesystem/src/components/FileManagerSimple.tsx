/**
 * @file 文件管理器简化版（PoC）/ File Manager Simple (PoC)
 * @description 文件系统管理功能的概念验证组件
 * @module components/filesystem/FileManagerSimple
 * @version 1.0.0
 * 
 * 功能 / Features:
 * - 目录浏览 / Directory browsing
 * - 文件列表显示 / File list display
 * - 路径导航 / Path navigation
 * - 文件创建 / File creation
 * - 文件删除 / File deletion
 */

import { useState } from "react";
import { useFileSystem } from "../hooks/useFileSystem";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import type { FSNode } from "../types/filesystem";

/**
 * 文件管理器简化版组件 / File Manager Simple Component
 */
export function FileManagerSimple() {
  const {
    currentPath,
    files,
    loading,
    error,
    browseDirectory,
    goToParent,
    goToHome,
    refresh,
    create,
    deleteFile,
  } = useFileSystem();

  const [newFileName, setNewFileName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  /* ──────────── 事件处理 / Event Handlers ──────────── */

  /**
   * 处理目录双击 / Handle directory double click
   */
  const handleDirectoryClick = async (node: FSNode) => {
    if (node.type === "directory") {
      await browseDirectory(node.path);
    } else {
      toast.info(`文件: ${node.name} (${node.size} bytes)`);
    }
  };

  /**
   * 处理创建文件 / Handle file creation
   */
  const handleCreate = async () => {
    if (!newFileName) {
      toast.error("文件名不能为空 / File name cannot be empty");
      return;
    }

    try {
      await create({
        parentPath: currentPath,
        name: newFileName,
        type: "file",
        content: "",
      });
      toast.success(`创建成功: ${newFileName} / Created: ${newFileName}`);
      setNewFileName("");
      setShowCreateForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "创建失败 / Creation failed");
    }
  };

  /**
   * 处理删除文件 / Handle file deletion
   */
  const handleDelete = async (node: FSNode) => {
    if (!window.confirm(`确认删除 ${node.name}？/ Confirm delete ${node.name}?`)) {
      return;
    }

    try {
      await deleteFile({ path: node.path, recursive: node.type === "directory" });
      toast.success(`删除成功: ${node.name} / Deleted: ${node.name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "删除失败 / Deletion failed");
    }
  };

  /* ──────────── 渲染 / Render ──────────── */

  return (
    <div className="flex h-full flex-col bg-black text-green-500 font-mono p-4 border border-green-500/30">
      {/* 标题 / Header */}
      <div className="mb-4">
        <h2 className="text-xl mb-2">FILE MANAGER / 文件管理器</h2>
        <div className="h-px bg-green-500/30" />
      </div>

      {/* 工具栏 / Toolbar */}
      <div className="flex gap-2 mb-4">
        <Button 
          onClick={goToHome} 
          variant="outline"
          className="border-green-500 text-green-500 hover:bg-green-500/10"
        >
          HOME / 主目录
        </Button>
        <Button 
          onClick={goToParent} 
          variant="outline"
          className="border-green-500 text-green-500 hover:bg-green-500/10"
        >
          PARENT / 上级
        </Button>
        <Button 
          onClick={refresh} 
          variant="outline"
          className="border-green-500 text-green-500 hover:bg-green-500/10"
        >
          REFRESH / 刷新
        </Button>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)} 
          variant="outline"
          className="border-green-500 text-green-500 hover:bg-green-500/10"
        >
          NEW FILE / 新建文件
        </Button>
      </div>

      {/* 创建文件表单 / Create File Form */}
      {showCreateForm && (
        <div className="flex gap-2 mb-4">
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="FILE NAME / 文件名"
            className="bg-black border-green-500 text-green-500"
          />
          <Button 
            onClick={handleCreate}
            className="bg-green-500 text-black hover:bg-green-600"
          >
            CREATE / 创建
          </Button>
          <Button 
            onClick={() => setShowCreateForm(false)}
            variant="outline"
            className="border-green-500 text-green-500"
          >
            CANCEL / 取消
          </Button>
        </div>
      )}

      {/* 当前路径 / Current Path */}
      <div className="mb-2 p-2 bg-green-500/5 border border-green-500/30">
        <span className="text-green-500/70">PATH / 路径:</span>{" "}
        <span className="text-green-500">{currentPath}</span>
      </div>

      {/* 错误提示 / Error Message */}
      {error && (
        <div className="mb-2 p-2 bg-red-500/10 border border-red-500 text-red-500">
          ERROR / 错误: {error}
        </div>
      )}

      {/* 加载中 / Loading */}
      {loading && (
        <div className="text-green-500 text-center py-4">
          LOADING / 加载中...
        </div>
      )}

      {/* 文件列表 / File List */}
      {!loading && (
        <div className="flex-1 overflow-auto border border-green-500/30">
          <table className="w-full">
            <thead className="bg-green-500/10 sticky top-0">
              <tr>
                <th className="text-left p-2 border-b border-green-500/30">NAME / 名称</th>
                <th className="text-left p-2 border-b border-green-500/30">TYPE / 类型</th>
                <th className="text-left p-2 border-b border-green-500/30">SIZE / 大小</th>
                <th className="text-left p-2 border-b border-green-500/30">MODIFIED / 修改时间</th>
                <th className="text-left p-2 border-b border-green-500/30">ACTIONS / 操作</th>
              </tr>
            </thead>
            <tbody>
              {files.map((node) => (
                <tr 
                  key={node.path}
                  className="hover:bg-green-500/5 border-b border-green-500/10 cursor-pointer"
                  onDoubleClick={() => handleDirectoryClick(node)}
                >
                  <td className="p-2">
                    {node.type === "directory" ? "📁" : "📄"} {node.name}
                  </td>
                  <td className="p-2">{node.type}</td>
                  <td className="p-2">{node.size} bytes</td>
                  <td className="p-2">{new Date(node.modifiedAt).toLocaleString()}</td>
                  <td className="p-2">
                    <Button
                      onClick={() => handleDelete(node)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-500/10"
                    >
                      DELETE / 删除
                    </Button>
                  </td>
                </tr>
              ))}
              {files.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-green-500/50">
                    EMPTY DIRECTORY / 空目录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 状态栏 / Status Bar */}
      <div className="mt-2 p-2 bg-green-500/5 border border-green-500/30 text-sm">
        <span className="text-green-500/70">ITEMS / 项目:</span>{" "}
        <span className="text-green-500">{files.length}</span>
        <span className="mx-4">|</span>
        <span className="text-green-500/70">STATUS / 状态:</span>{" "}
        <span className="text-green-500">{loading ? "LOADING" : "READY"}</span>
      </div>
    </div>
  );
}
