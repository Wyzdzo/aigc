// src/infrastructure/bullmq/contracts/ai-queue.runtime.ts
import { AI_PROVIDERS } from '@app-types/common/ai-provider.types';
import { BULLMQ_JOBS, BULLMQ_QUEUES } from '../bullmq.constants';
import { isNonEmptyString, isOptionalNonEmptyString, isOptionalRecordOfString, isRecord, } from './shared-payload-validators';
const isAiProvider = (value) => {
    return AI_PROVIDERS.some((provider) => provider === value);
};
const isOptionalAiProvider = (value) => {
    if (!isOptionalNonEmptyString(value)) {
        return false;
    }
    if (value === undefined) {
        return true;
    }
    return isAiProvider(value);
};
const isAiGeneratePayload = (payload) => {
    if (!isRecord(payload))
        return false;
    return (isOptionalAiProvider(payload.provider) &&
        isNonEmptyString(payload.model) &&
        isNonEmptyString(payload.prompt) &&
        isOptionalRecordOfString(payload.metadata) &&
        isOptionalNonEmptyString(payload.traceId));
};
const isAiEmbedPayload = (payload) => {
    if (!isRecord(payload))
        return false;
    return (payload.provider === undefined &&
        isNonEmptyString(payload.model) &&
        isNonEmptyString(payload.text) &&
        isOptionalRecordOfString(payload.metadata) &&
        isOptionalNonEmptyString(payload.traceId));
};
export const AI_JOB_CONTRACT = {
    [BULLMQ_JOBS.AI.GENERATE]: {
        payload: {},
        result: {},
        payloadValidator: isAiGeneratePayload,
    },
    [BULLMQ_JOBS.AI.EMBED]: {
        payload: {},
        result: {},
        payloadValidator: isAiEmbedPayload,
    },
};
export const AI_QUEUE_CONTRACT = {
    queueName: BULLMQ_QUEUES.AI,
    jobs: AI_JOB_CONTRACT,
};
