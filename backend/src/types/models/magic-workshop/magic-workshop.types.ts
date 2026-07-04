// src/types/models/magic-workshop/magic-workshop.types.ts

export enum TaskStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

export enum ItemType {
  WEAPON = 'WEAPON',
  ARMOR = 'ARMOR',
  TOOL = 'TOOL',
  TOY = 'TOY',
}

export enum QualityLevel {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export interface MagicItemCraftTaskModel {
  id: string;
  itemName: string;
  itemType: ItemType;
  materialLevel: number;
  requestNote?: string;
  status: TaskStatus;
  qualityLevel?: QualityLevel;
  resultDescription?: string;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
