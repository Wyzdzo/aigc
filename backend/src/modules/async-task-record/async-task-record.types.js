// src/modules/async-task-record/async-task-record.types.ts
import { RECORD_SOURCES } from '@app-types/common/record-source.types';
export const ASYNC_TASK_RECORD_SOURCES = RECORD_SOURCES;
export const ASYNC_TASK_RECORD_STATUSES = [
    'queued',
    'processing',
    'succeeded',
    'failed',
    'cancelled',
];
