/**
 * data.ts
 * ======
 * 数据处理工具函数
 * 从 AI Family 项目中提取
 */

/**
 * 根据ID查找成员
 * @param id - 成员ID
 * @param members - 成员列表
 * @returns 找到的成员或undefined
 */
export function getMember<T extends { id: string }>(
  id: string,
  members: T[]
): T | undefined {
  return members.find(m => m.id === id);
}

/**
 * 获取家族数据统计摘要
 * @param members - 成员列表
 * @param options - 可选数据
 * @returns 数据统计摘要
 */
export function getDataSummary<T extends {
  growth: number;
  contribution: number;
}>(members: T[], options?: {
  totalMessages?: number;
  totalActivities?: number;
  totalMemories?: number;
  totalMedals?: number;
  systemUptime?: number;
  familyAge?: number;
}) {
  const avgGrowth = Math.round(
    members.reduce((sum, m) => sum + m.growth, 0) / members.length
  );
  const avgContribution = Math.round(
    members.reduce((sum, m) => sum + m.contribution, 0) / members.length
  );

  return {
    totalMessages: options?.totalMessages || 0,
    totalActivities: options?.totalActivities || 0,
    totalMemories: options?.totalMemories || 0,
    totalMedals: options?.totalMedals || 0,
    avgGrowth,
    avgContribution,
    systemUptime: options?.systemUptime || 0,
    familyAge: options?.familyAge || 0,
  };
}

/**
 * 深度克隆对象
 * @param obj - 要克隆的对象
 * @returns 克隆后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * 数组去重
 * @param arr - 数组
 * @param key - 对象数组去重的key(可选)
 * @returns 去重后的数组
 */
export function unique<T>(arr: T[], key?: keyof T): T[] {
  if (!key) return Array.from(new Set(arr));

  const seen = new Set();
  return arr.filter(item => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/**
 * 数组分组
 * @param arr - 数组
 * @param key - 分组的key
 * @returns 分组后的对象
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const k = String(item[key]);
    if (!groups[k]) groups[k] = [];
    groups[k].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * 数组分块
 * @param arr - 数组
 * @param size - 每块的大小
 * @returns 分块后的数组
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
