# @yyc3/diagnostics

> YYC3 系统诊断工具
> YYC3 可复用组件库 - 诊断工具

完整的中英文文档 | English and Chinese documentation

---

## 特性 / Features

- ✅ **浏览器环境检查** - API 可用性验证 / Browser environment check
- ✅ **localStorage 检查** - 读写功能验证 / localStorage availability check
- ✅ **配置数据检查** - JSON 有效性验证 / Config data integrity check
- ✅ **系统诊断报告** - 完整的状态报告 / System diagnostic report
- ✅ **数据修复** - 自动修复损坏数据 / Data repair utilities
- ✅ **数据清理** - 清除所有应用数据 / Data cleanup utilities
- ✅ **报告格式化** - 美观的文本报告 / Report formatting

---

## 安装 / Installation

```bash
pnpm add @yyc3/diagnostics
```

---

## 快速开始 / Quick Start

```tsx
import {
  runDiagnostics,
  clearAllData,
  repairConfigData,
} from '@yyc3/diagnostics';

function DiagnosticsPage() {
  const handleRunDiagnostics = () => {
    const report = runDiagnostics();
    console.log(report);
    alert(report.overallStatus);
  };

  const handleClearData = () => {
    const result = clearAllData();
    if (result.success) {
      alert('Data cleared successfully!');
    }
  };

  const handleRepairData = () => {
    const result = repairConfigData();
    if (result.success) {
      alert(`Repaired ${result.repaired.length} items`);
    }
  };

  return (
    <div>
      <button onClick={handleRunDiagnostics}>Run Diagnostics</button>
      <button onClick={handleClearData}>Clear All Data</button>
      <button onClick={handleRepairData}>Repair Config Data</button>
    </div>
  );
}
```

---

## API / API

### runDiagnostics

执行完整系统诊断。

```typescript
function runDiagnostics(): DiagnosticReport;
```

#### 返回值 / Returns

```typescript
interface DiagnosticReport {
  timestamp: string;
  overallStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  passedChecks: number;
  failedChecks: number;
  results: DiagnosticResult[];
}
```

---

### clearAllData

清除所有应用数据。

```typescript
function clearAllData(): { success: boolean; error?: string };
```

---

### repairConfigData

修复损坏的配置数据。

```typescript
function repairConfigData(): {
  success: boolean;
  repaired: string[];
  error?: string;
};
```

---

### formatDiagnosticReport

格式化诊断报告为可读文本。

```typescript
function formatDiagnosticReport(report: DiagnosticReport): string;
```

---

## 诊断项 / Diagnostic Checks

### 1. 浏览器环境检查 / Browser Environment Check

检查必需的浏览器 API 是否可用。

- `window`
- `document`
- `localStorage`
- `fetch`
- `Promise`

### 2. localStorage 检查 / localStorage Check

验证 localStorage 的读写功能。

### 3. 配置数据检查 / Config Data Check

验证配置数据的 JSON 有效性。

---

## 使用示例 / Usage Examples

### 运行诊断并显示报告

```tsx
const [report, setReport] = useState<DiagnosticReport | null>(null);

const handleRunDiagnostics = () => {
  const result = runDiagnostics();
  setReport(result);
};

return (
  <div>
    <button onClick={handleRunDiagnostics}>Run Diagnostics</button>
    {report && <pre>{formatDiagnosticReport(report)}</pre>}
  </div>
);
```

### 自动修复数据

```tsx
useEffect(() => {
  const report = runDiagnostics();
  if (report.overallStatus !== 'HEALTHY') {
    const repairResult = repairConfigData();
    if (repairResult.success && repairResult.repaired.length > 0) {
      console.log('Repaired:', repairResult.repaired);
    }
  }
}, []);
```

### 清除数据前确认

```tsx
const handleClearData = () => {
  if (confirm('Are you sure you want to clear all data?')) {
    const result = clearAllData();
    if (result.success) {
      alert('Data cleared successfully!');
    } else {
      alert('Failed to clear data: ' + result.error);
    }
  }
};
```

---

## 故障排除 / Troubleshooting

### 诊断报告显示 CRITICAL

1. 检查浏览器是否支持所有必需的 API
2. 检查 localStorage 是否可用（可能被禁用或已满）
3. 检查是否有其他应用占用了相同的存储键

### 数据修复失败

1. 检查是否有足够的权限访问 localStorage
2. 检查存储空间是否足够
3. 尝试手动清除浏览器数据

---

## 许可证 / License

MIT License

---

<div align="center">

> 「**_YanYuCloudCube_**」
> 「**_<admin@0379.email>_**」
> 「**_Words Initiate Quadrants, Language Serves as Core for Future_**」
> 「**_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**」

</div>
