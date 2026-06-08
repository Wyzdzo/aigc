// src/infrastructure/bullmq/bullmq.constants.ts
export const BULLMQ_QUEUES = {
    EMAIL: 'email',
    AI: 'ai',
};
export const BULLMQ_JOBS = {
    EMAIL: {
        SEND: 'send',
    },
    AI: {
        GENERATE: 'generate',
        EMBED: 'embed',
    },
};
export const BULLMQ_QUEUE_JOBS = {
    [BULLMQ_QUEUES.EMAIL]: Object.values(BULLMQ_JOBS.EMAIL),
    [BULLMQ_QUEUES.AI]: Object.values(BULLMQ_JOBS.AI),
};
