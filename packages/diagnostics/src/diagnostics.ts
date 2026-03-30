/**
 * file: diagnostics.ts
 * description: 系统诊断工具函数 · 提供完整的系统健康检查和故障排除功能
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [diagnostics],[utility],[browser]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 系统诊断和故障排除工具
 *
 * details:
 * - checkLocalStorage: 检查 localStorage 可用性
 * - checkConfigData: 检查配置数据完整性
 * - checkBrowserEnvironment: 检查浏览器环境
 * - runDiagnostics: 执行完整系统诊断
 * - clearAllData: 清除所有应用数据
 * - repairConfigData: 修复损坏的配置数据
 * - formatDiagnosticReport: 格式化诊断报告
 *
 * dependencies: localStorage, Browser APIs
 * exports: runDiagnostics, clearAllData, repairConfigData, formatDiagnosticReport
 * notes: 所有函数均为纯函数，便于测试和维护
 */

import type { DiagnosticResult, DiagnosticReport } from "./types";

/**
 * 检查 localStorage 可用性 / Check localStorage availability
 */
function checkLocalStorage(): DiagnosticResult {
  try {
    const testKey = '__yyc3_storage_test__';
    localStorage.setItem(testKey, 'test');
    const value = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (value === 'test') {
      return {
        name: 'LOCALSTORAGE_CHECK',
        passed: true,
        message: 'localStorage is accessible and functioning / localStorage 可访问且正常运行',
      };
    } else {
      return {
        name: 'LOCALSTORAGE_CHECK',
        passed: false,
        message: 'localStorage read/write mismatch / localStorage 读写不匹配',
      };
    }
  } catch (error) {
    return {
      name: 'LOCALSTORAGE_CHECK',
      passed: false,
      message: 'localStorage is not accessible / localStorage 不可访问',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    };
  }
}

/**
 * 检查关键配置数据 / Check critical config data
 */
function checkConfigData(): DiagnosticResult {
  try {
    const keys = [
      'yyc3_ui_settings',
      'yyc3_database_config',
    ];

    const issues: string[] = [];

    for (const key of keys) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          JSON.parse(data);
        } catch {
          issues.push(`CORRUPTED_DATA: ${key}`);
        }
      }
    }

    if (issues.length === 0) {
      return {
        name: 'CONFIG_DATA_CHECK',
        passed: true,
        message: 'All config data is valid JSON / 所有配置数据均为有效 JSON',
      };
    } else {
      return {
        name: 'CONFIG_DATA_CHECK',
        passed: false,
        message: `Found ${issues.length} corrupted config(s) / 发现 ${issues.length} 个损坏配置`,
        error: issues.join(', '),
      };
    }
  } catch (error) {
    return {
      name: 'CONFIG_DATA_CHECK',
      passed: false,
      message: 'Failed to check config data / 配置数据检查失败',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    };
  }
}

/**
 * 检查浏览器环境 / Check browser environment
 */
function checkBrowserEnvironment(): DiagnosticResult {
  try {
    const required = [
      'window',
      'document',
      'localStorage',
      'fetch',
      'Promise',
    ];

    const missing = required.filter(api => typeof (globalThis as Record<string, unknown>)[api] === 'undefined');

    if (missing.length === 0) {
      return {
        name: 'BROWSER_ENV_CHECK',
        passed: true,
        message: 'All required browser APIs available / 所有必需的浏览器 API 可用',
      };
    } else {
      return {
        name: 'BROWSER_ENV_CHECK',
        passed: false,
        message: `Missing browser APIs / 缺少浏览器 API`,
        error: missing.join(', '),
      };
    }
  } catch (error) {
    return {
      name: 'BROWSER_ENV_CHECK',
      passed: false,
      message: 'Environment check failed / 环境检查失败',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    };
  }
}

/**
 * 执行完整系统诊断 / Run full system diagnostics
 */
export function runDiagnostics(): DiagnosticReport {
  const results: DiagnosticResult[] = [
    checkBrowserEnvironment(),
    checkLocalStorage(),
    checkConfigData(),
  ];

  const passedChecks = results.filter(r => r.passed).length;
  const failedChecks = results.filter(r => !r.passed).length;

  let overallStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  if (failedChecks === 0) {
    overallStatus = 'HEALTHY';
  } else if (failedChecks === 1) {
    overallStatus = 'WARNING';
  } else {
    overallStatus = 'CRITICAL';
  }

  return {
    timestamp: new Date().toISOString(),
    overallStatus,
    passedChecks,
    failedChecks,
    results,
  };
}

/**
 * 清除所有应用数据 / Clear all application data
 */
export function clearAllData(): { success: boolean; error?: string } {
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('yyc3_'));
    for (const key of keys) {
      localStorage.removeItem(key);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    };
  }
}

/**
 * 修复损坏的配置数据 / Repair corrupted config data
 */
export function repairConfigData(): { success: boolean; repaired: string[]; error?: string } {
  try {
    const repairedKeys: string[] = [];
    const keys = [
      'yyc3_ui_settings',
      'yyc3_database_config',
    ];

    for (const key of keys) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          JSON.parse(data);
        } catch {
          localStorage.removeItem(key);
          repairedKeys.push(key);
        }
      }
    }

    return { success: true, repaired: repairedKeys };
  } catch (error) {
    return {
      success: false,
      repaired: [],
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    };
  }
}

/**
 * 格式化诊断报告为可读文本 / Format diagnostic report as readable text
 */
export function formatDiagnosticReport(report: DiagnosticReport): string {
  const lines: string[] = [
    '╔═══════════════════════════════════════════════════════════╗',
    '║   YYC³ SYSTEM DIAGNOSTICS REPORT / 系统诊断报告          ║',
    '╠═══════════════════════════════════════════════════════════╣',
    `║ Timestamp / 时间: ${report.timestamp.padEnd(39)} ║`,
    `║ Status / 状态: ${report.overallStatus.padEnd(44)} ║`,
    `║ Passed / 通过: ${String(report.passedChecks).padEnd(44)} ║`,
    `║ Failed / 失败: ${String(report.failedChecks).padEnd(44)} ║`,
    '╠═══════════════════════════════════════════════════════════╣',
  ];

  for (const result of report.results) {
    const status = result.passed ? '✓' : '✗';
    lines.push(`║ ${status} ${result.name.padEnd(54)} ║`);
    lines.push(`║   ${result.message.slice(0, 57).padEnd(57)} ║`);
    if (result.error) {
      lines.push(`║   ERROR: ${result.error.slice(0, 49).padEnd(49)} ║`);
    }
  }

  lines.push('╚═══════════════════════════════════════════════════════════╝');

  return lines.join('\n');
}
