// src/infrastructure/bullmq/contracts/email-queue.runtime.ts
import { BULLMQ_JOBS, BULLMQ_QUEUES } from '../bullmq.constants';
import { isNonEmptyString, isOptionalNonEmptyString, isOptionalRecordOfString, isOptionalString, isRecord, } from './shared-payload-validators';
const isEmailSendPayload = (payload) => {
    if (!isRecord(payload))
        return false;
    const hasEmailBody = isNonEmptyString(payload.text) ||
        isNonEmptyString(payload.html) ||
        isNonEmptyString(payload.templateId);
    return (isNonEmptyString(payload.to) &&
        isNonEmptyString(payload.subject) &&
        isOptionalString(payload.text) &&
        isOptionalString(payload.html) &&
        isOptionalNonEmptyString(payload.templateId) &&
        hasEmailBody &&
        isOptionalRecordOfString(payload.meta) &&
        isOptionalNonEmptyString(payload.traceId));
};
export const EMAIL_JOB_CONTRACT = {
    [BULLMQ_JOBS.EMAIL.SEND]: {
        payload: {},
        result: {},
        payloadValidator: isEmailSendPayload,
    },
};
export const EMAIL_QUEUE_CONTRACT = {
    queueName: BULLMQ_QUEUES.EMAIL,
    jobs: EMAIL_JOB_CONTRACT,
};
