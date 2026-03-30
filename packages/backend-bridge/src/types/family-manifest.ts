/**
 * Family Manifest Types
 * 家庭成员清单类型定义
 */

export type RoleId = string;

export interface FamilyMember {
  id: string;
  roleId: RoleId;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  lastSeen?: Date;
  permissions: string[];
}

export interface FamilyManifest {
  id: string;
  name: string;
  members: FamilyMember[];
  createdAt: Date;
  updatedAt: Date;
}
