/**
 * @yyc3/types
 * YYC3可复用组件库 - 通用类型定义
 */

// ═══ 错误处理类型 ═══

export type ErrorCategory =
  | 'network'
  | 'parse'
  | 'auth'
  | 'runtime'
  | 'validation'
  | 'storage'
  | 'unknown';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export type ErrorBoundaryLevel = 'page' | 'module' | 'component';

export interface ErrorStats {
  total: number;
  byCategory: Record<ErrorCategory, number>;
  bySeverity: Record<ErrorSeverity, number>;
  recent: AppError[];
  unresolvedCount?: number;
  lastErrorTime?: number | null;
}

export interface AppError {
  id: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: number;
  stack?: string;
  context?: Record<string, unknown>;
  resolved: boolean;
  source?: string;
  userAction?: string;
}

// ═══ 用户与认证类型 ═══

export type UserRole = 'admin' | 'user' | 'guest';

export interface AppUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  created_at?: string;
}

export interface AppSession {
  user: AppUser;
  token?: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
}

export interface AuthContextValue {
  logout: () => Promise<void>;
  userEmail: string;
  userRole: UserRole | null;
  isGhost: boolean;
}

// ═══ 国际化类型 ═══

export type Locale = 'zh-CN' | 'en-US';

export interface LocaleInfo {
  code: string;
  label: string;
  nativeLabel: string;
}

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  availableLocales: LocaleInfo[];
}

export interface I18nMessages {
  [key: string]: string | I18nMessages;
}

// ═══ 组件状态类型 ═══

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

export interface ComponentStatus {
  mounted: boolean;
  ready: boolean;
  error: AppError | null;
}

// ═══ 表单类型 ═══

export interface FormField {
  name: string;
  value: unknown;
  error?: string;
  touched?: boolean;
  dirty?: boolean;
}

export interface FormState {
  fields: Record<string, FormField>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

// ═══ 网络请求类型 ═══

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  code?: number;
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retry?: number;
}

// ═══ 存储类型 ═══

export type StorageType = 'localStorage' | 'sessionStorage' | 'indexedDB';

export interface StorageItem<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl?: number;
}

export interface StorageOptions {
  ttl?: number; // 存活时间（毫秒）
  prefix?: string; // 键前缀
}

// ═══ 主题与样式类型 ═══

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

export type ColorScheme =
  | 'blue'
  | 'green'
  | 'purple'
  | 'orange'
  | 'red'
  | 'cyan'
  | 'pink';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

// ═══ 动画类型 ═══

export type AnimationDuration = 'fast' | 'normal' | 'slow';
export type AnimationEasing =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out';

export interface AnimationOptions {
  duration?: AnimationDuration | number;
  easing?: AnimationEasing;
  delay?: number;
  loop?: boolean;
}

// ═══ 通用工具类型 ═══

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type MaybePromise<T> = T | Promise<T>;

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortParams<T = string> {
  field: T;
  direction: SortDirection;
}

export interface FilterParams {
  [key: string]: unknown;
}

// ═══ 路由类型 ═══

export type RoutePath = string;
export type RouteParams = Record<string, string | number>;

export interface RouteMatch {
  path: RoutePath;
  params: RouteParams;
}

// ═══ 文件类型 ═══

export type FileType =
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'archive'
  | 'other';

export interface FileInfo {
  name: string;
  size: number;
  type: FileType;
  mimeType: string;
  lastModified: number;
  url?: string;
}

// ═══ 通知类型 ═══

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
  dismissed?: boolean;
}

// ═══ 性能监控类型 ═══

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

export interface PerformanceStats {
  loadTime: number;
  renderTime: number;
  apiTime: number;
  errorCount: number;
}

// ═══ React组件相关类型 ═══

export type ComponentSize = 'sm' | 'default' | 'lg' | 'xl';

export type ComponentVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost';

export interface BaseComponentProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
  style?: React.CSSProperties;
}

export interface PolymorphicComponentProps<E extends React.ElementType> {
  as?: E;
}
