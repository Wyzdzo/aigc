export const EMAIL_QUEUE_NAME = 'email';
export const EMAIL_SEND_JOB_NAME = 'send';
export function mapEmailSendJobToProcessInput(input) {
    const jobId = resolveJobId({ job: input.job });
    const traceId = resolveTraceId({
        job: input.job,
        mode: 'strict',
    });
    return {
        queueName: EMAIL_QUEUE_NAME,
        jobName: EMAIL_SEND_JOB_NAME,
        jobId,
        traceId,
        payload: input.job.data,
        attemptsMade: input.job.attemptsMade,
        maxAttempts: resolveMaxAttempts({ job: input.job }),
        enqueuedAt: resolveDate({ timestamp: input.job.timestamp }),
        startedAt: resolveDate({ timestamp: input.job.processedOn }),
    };
}
export function mapEmailSendJobToCompleteInput(input) {
    const jobId = resolveJobId({ job: input.job });
    const traceId = resolveTraceId({
        job: input.job,
        mode: 'strict',
    });
    return {
        queueName: EMAIL_QUEUE_NAME,
        jobName: EMAIL_SEND_JOB_NAME,
        jobId,
        traceId,
        attemptsMade: input.job.attemptsMade,
        maxAttempts: resolveMaxAttempts({ job: input.job }),
        enqueuedAt: resolveDate({ timestamp: input.job.timestamp }),
        startedAt: resolveDate({ timestamp: input.job.processedOn }),
        finishedAt: resolveDate({ timestamp: input.job.finishedOn }),
    };
}
export function mapEmailSendJobToFailInput(input) {
    const occurredAt = resolveDate({ timestamp: input.job.finishedOn });
    const jobId = resolveJobId({ job: input.job });
    const traceId = resolveTraceId({
        job: input.job,
        mode: 'degraded',
    });
    return {
        queueName: EMAIL_QUEUE_NAME,
        jobName: EMAIL_SEND_JOB_NAME,
        jobId,
        traceId,
        attemptsMade: input.job.attemptsMade,
        maxAttempts: resolveMaxAttempts({ job: input.job }),
        enqueuedAt: resolveDate({ timestamp: input.job.timestamp }),
        startedAt: resolveDate({ timestamp: input.job.processedOn }),
        finishedAt: occurredAt,
        occurredAt,
        reason: input.error.message.slice(0, 128),
    };
}
export function mapMissingEmailSendJobToFailInput(input) {
    const occurredAt = input.occurredAt ?? new Date();
    const jobId = resolveMissingJobId({
        occurredAt,
        jobName: EMAIL_SEND_JOB_NAME,
    });
    return {
        queueName: EMAIL_QUEUE_NAME,
        jobName: EMAIL_SEND_JOB_NAME,
        jobId,
        traceId: jobId,
        attemptsMade: 0,
        enqueuedAt: occurredAt,
        finishedAt: occurredAt,
        occurredAt,
        reason: `worker_event_job_missing:${input.error.message.slice(0, 96)}`,
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
    return input.job.id ?? `${EMAIL_SEND_JOB_NAME}:${input.job.timestamp}`;
}
function resolveTraceId(input) {
    const payloadTraceId = input.job.data.traceId?.trim();
    if (payloadTraceId) {
        return payloadTraceId;
    }
    if (input.mode === 'strict') {
        throw new Error(`missing_payload_trace_id:${input.job.name}`);
    }
    const jobId = resolveJobId({ job: input.job });
    return `degraded-trace:${input.job.name}:${jobId}`;
}
function resolveMissingJobId(input) {
    return `missing-job:${input.jobName}:${input.occurredAt.getTime()}`;
}
