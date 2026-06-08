export const AI_QUEUE_NAME = 'ai';
export const AI_GENERATE_JOB_NAME = 'generate';
export const AI_EMBED_JOB_NAME = 'embed';
export function mapAiGenerateJobToProcessInput(input) {
    const jobId = resolveJobId({ job: input.job });
    const traceId = resolveTraceId({
        job: input.job,
        mode: 'strict',
    });
    return {
        queueName: AI_QUEUE_NAME,
        jobName: AI_GENERATE_JOB_NAME,
        jobId,
        traceId,
        payload: input.job.data,
        attemptsMade: input.job.attemptsMade,
        maxAttempts: resolveMaxAttempts({ job: input.job }),
        enqueuedAt: resolveDate({ timestamp: input.job.timestamp }),
        startedAt: resolveDate({ timestamp: input.job.processedOn }),
    };
}
export function mapAiGenerateJobToCompleteInput(input) {
    const jobId = resolveJobId({ job: input.job });
    const traceId = resolveTraceId({
        job: input.job,
        mode: 'strict',
    });
    return {
        queueName: AI_QUEUE_NAME,
        jobName: AI_GENERATE_JOB_NAME,
        jobId,
        traceId,
        attemptsMade: input.job.attemptsMade,
        maxAttempts: resolveMaxAttempts({ job: input.job }),
        enqueuedAt: resolveDate({ timestamp: input.job.timestamp }),
        startedAt: resolveDate({ timestamp: input.job.processedOn }),
        finishedAt: resolveDate({ timestamp: input.job.finishedOn }),
    };
}
export function mapAiGenerateJobToFailInput(input) {
    const occurredAt = resolveDate({ timestamp: input.job.finishedOn });
    const jobId = resolveJobId({ job: input.job });
    const traceId = resolveTraceId({
        job: input.job,
        mode: 'degraded',
    });
    return {
        queueName: AI_QUEUE_NAME,
        jobName: AI_GENERATE_JOB_NAME,
        jobId,
        traceId,
        attemptsMade: input.job.attemptsMade,
        maxAttempts: resolveMaxAttempts({ job: input.job }),
        enqueuedAt: resolveDate({ timestamp: input.job.timestamp }),
        startedAt: resolveDate({ timestamp: input.job.processedOn }),
        finishedAt: occurredAt,
        occurredAt,
        reason: resolveWorkerFailedReason({ message: input.error.message }),
        error: input.error,
    };
}
export function mapMissingAiJobToFailInput(input) {
    const occurredAt = input.occurredAt ?? new Date();
    const jobName = 'unknown';
    const jobId = resolveMissingJobId({ occurredAt, jobName });
    return {
        queueName: AI_QUEUE_NAME,
        jobName,
        jobId,
        traceId: jobId,
        bizType: 'ai_worker',
        bizKey: jobId,
        attemptsMade: 0,
        enqueuedAt: occurredAt,
        finishedAt: occurredAt,
        occurredAt,
        reason: `worker_event_job_missing:${input.error.message.slice(0, 96)}`,
        error: input.error,
    };
}
export function mapUnknownAiJobToFailInput(input) {
    const occurredAt = resolveDate({ timestamp: input.job.finishedOn }) ?? new Date();
    const jobName = resolveFailedJobName({ job: input.job });
    const jobId = resolveJobId({ job: input.job });
    const traceId = resolveTraceId({
        job: input.job,
        mode: 'degraded',
    });
    return {
        queueName: AI_QUEUE_NAME,
        jobName,
        jobId,
        traceId,
        bizType: 'ai_worker',
        bizKey: traceId,
        attemptsMade: input.job.attemptsMade,
        maxAttempts: resolveMaxAttempts({ job: input.job }),
        enqueuedAt: resolveDate({ timestamp: input.job.timestamp }),
        startedAt: resolveDate({ timestamp: input.job.processedOn }),
        finishedAt: occurredAt,
        occurredAt,
        reason: `unsupported_ai_job:${jobName}:${input.error.message.slice(0, 96)}`,
        error: input.error,
    };
}
export function mapAiEmbedJobToProcessInput(input) {
    const jobId = resolveJobId({ job: input.job });
    const traceId = resolveTraceId({
        job: input.job,
        mode: 'strict',
    });
    return {
        queueName: AI_QUEUE_NAME,
        jobName: AI_EMBED_JOB_NAME,
        jobId,
        traceId,
        payload: input.job.data,
        attemptsMade: input.job.attemptsMade,
        maxAttempts: resolveMaxAttempts({ job: input.job }),
        enqueuedAt: resolveDate({ timestamp: input.job.timestamp }),
        startedAt: resolveDate({ timestamp: input.job.processedOn }),
    };
}
export function mapAiEmbedJobToCompleteInput(input) {
    const jobId = resolveJobId({ job: input.job });
    const traceId = resolveTraceId({
        job: input.job,
        mode: 'strict',
    });
    return {
        queueName: AI_QUEUE_NAME,
        jobName: AI_EMBED_JOB_NAME,
        jobId,
        traceId,
        attemptsMade: input.job.attemptsMade,
        maxAttempts: resolveMaxAttempts({ job: input.job }),
        enqueuedAt: resolveDate({ timestamp: input.job.timestamp }),
        startedAt: resolveDate({ timestamp: input.job.processedOn }),
        finishedAt: resolveDate({ timestamp: input.job.finishedOn }),
    };
}
export function mapAiEmbedJobToFailInput(input) {
    const occurredAt = resolveDate({ timestamp: input.job.finishedOn });
    const jobId = resolveJobId({ job: input.job });
    const traceId = resolveTraceId({
        job: input.job,
        mode: 'degraded',
    });
    return {
        queueName: AI_QUEUE_NAME,
        jobName: AI_EMBED_JOB_NAME,
        jobId,
        traceId,
        attemptsMade: input.job.attemptsMade,
        maxAttempts: resolveMaxAttempts({ job: input.job }),
        enqueuedAt: resolveDate({ timestamp: input.job.timestamp }),
        startedAt: resolveDate({ timestamp: input.job.processedOn }),
        finishedAt: occurredAt,
        occurredAt,
        reason: resolveWorkerFailedReason({ message: input.error.message }),
        error: input.error,
    };
}
function resolveDate(input) {
    if (typeof input.timestamp !== 'number' || Number.isNaN(input.timestamp)) {
        return undefined;
    }
    return new Date(input.timestamp);
}
function resolveMaxAttempts(input) {
    const attempts = input.job.opts.attempts;
    if (typeof attempts !== 'number' || Number.isNaN(attempts)) {
        return undefined;
    }
    return attempts;
}
function resolveJobId(input) {
    if (typeof input.job.id === 'number') {
        return String(input.job.id);
    }
    return input.job.id ?? `${input.job.name}:${input.job.timestamp}`;
}
function resolveTraceId(input) {
    const payloadTraceId = resolvePayloadTraceId({ job: input.job });
    if (payloadTraceId) {
        return payloadTraceId;
    }
    if (input.mode === 'strict') {
        throw new Error(`missing_payload_trace_id:${input.job.name}`);
    }
    const jobId = resolveJobId({ job: input.job });
    return `degraded-trace:${input.job.name}:${jobId}`;
}
function resolvePayloadTraceId(input) {
    const payload = input.job.data;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return undefined;
    }
    const traceId = payload.traceId;
    if (typeof traceId !== 'string') {
        return undefined;
    }
    const normalizedTraceId = traceId.trim();
    return normalizedTraceId || undefined;
}
function resolveFailedJobName(input) {
    const normalizedName = input.job.name.trim();
    return normalizedName || 'unknown';
}
function resolveMissingJobId(input) {
    return `missing-job:${input.jobName}:${input.occurredAt.getTime()}`;
}
function resolveWorkerFailedReason(input) {
    const normalizedMessage = input.message.trim() || 'worker_unknown_error';
    if (normalizedMessage.startsWith('worker_failed:')) {
        return normalizedMessage.slice(0, 128);
    }
    if (normalizedMessage.startsWith('missing_payload_trace_id')) {
        return normalizedMessage.slice(0, 128);
    }
    const prefix = 'worker_failed:';
    const availableSummaryLength = Math.max(128 - prefix.length, 1);
    const summary = normalizedMessage.slice(0, availableSummaryLength);
    return `${prefix}${summary}`;
}
