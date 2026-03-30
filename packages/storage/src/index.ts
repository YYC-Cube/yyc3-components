/**
 * @yyc3/storage
 * YYC3可复用组件库 - 存储系统
 */

// IndexedDB
export {
  IndexedDB,
  SimpleIndexedDB,
  createIndexedDB,
  type DBConfig,
  type StoreDefinition,
  type StoreName,
  type IDBConfig,
} from './indexed-db';

// BroadcastChannel
export {
  BroadcastChannelManager,
  createBroadcastChannel,
  sendMessage,
  onMessage,
  type ChannelConfig,
} from './broadcast-channel';
