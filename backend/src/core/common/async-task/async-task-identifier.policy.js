const BIZ_KEY_POLICY_BY_DOMAIN = {
    ai_generation: 'trace_id',
    ai_embedding: 'trace_id',
    email: 'job_id',
};
export function resolveAsyncTaskBizKey(input) {
    const policy = BIZ_KEY_POLICY_BY_DOMAIN[input.domain];
    if (policy === 'trace_id') {
        return normalizeRequiredValue(input.traceId);
    }
    const normalizedJobId = normalizeOptionalValue(input.jobId);
    if (normalizedJobId) {
        return normalizedJobId;
    }
    const normalizedDedupKey = normalizeOptionalValue(input.dedupKey);
    if (normalizedDedupKey) {
        return normalizedDedupKey;
    }
    return normalizeRequiredValue(input.traceId);
}
export function resolveEnqueueFailureIdentifiers(input) {
    const traceId = normalizeOptionalValue(input.traceId) ?? `${input.traceIdPrefix}${input.occurredAt.getTime()}`;
    const failedJobId = normalizeOptionalValue(input.dedupKey);
    const bizKey = resolveAsyncTaskBizKey({
        domain: input.domain,
        traceId,
        jobId: failedJobId,
        dedupKey: input.dedupKey,
    });
    return {
        traceId,
        failedJobId,
        bizKey,
    };
}
function normalizeOptionalValue(value) {
    const normalized = value?.trim();
    return normalized || undefined;
}
function normalizeRequiredValue(value) {
    const normalized = value.trim();
    return normalized || value;
}
