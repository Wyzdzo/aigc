// src/infrastructure/bullmq/contracts/job-contract.registry.ts
import { BULLMQ_JOBS, BULLMQ_QUEUES } from '../bullmq.constants';
import { AI_JOB_CONTRACT } from './ai-queue.runtime';
import { EMAIL_JOB_CONTRACT } from './email-queue.runtime';
export const BULLMQ_JOB_PAYLOAD_VALIDATORS = {
    [BULLMQ_QUEUES.EMAIL]: {
        [BULLMQ_JOBS.EMAIL.SEND]: EMAIL_JOB_CONTRACT[BULLMQ_JOBS.EMAIL.SEND].payloadValidator,
    },
    [BULLMQ_QUEUES.AI]: {
        [BULLMQ_JOBS.AI.GENERATE]: AI_JOB_CONTRACT[BULLMQ_JOBS.AI.GENERATE].payloadValidator,
        [BULLMQ_JOBS.AI.EMBED]: AI_JOB_CONTRACT[BULLMQ_JOBS.AI.EMBED].payloadValidator,
    },
};
const getPayloadValidator = (input) => {
    const validatorsByQueue = BULLMQ_JOB_PAYLOAD_VALIDATORS[input.queueName];
    return validatorsByQueue[input.jobName];
};
export function assertBullMqJobPayload(input) {
    const validator = getPayloadValidator({ queueName: input.queueName, jobName: input.jobName });
    if (!validator(input.payload)) {
        throw new Error(`BullMQ job payload is invalid: ${input.queueName}/${input.jobName}`);
    }
}
