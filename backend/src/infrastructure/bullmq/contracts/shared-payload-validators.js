// src/infrastructure/bullmq/contracts/shared-payload-validators.ts
export const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
export const isOptionalString = (value) => value === undefined || typeof value === 'string';
export const isOptionalBoolean = (value) => value === undefined || typeof value === 'boolean';
export const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
export const isOptionalNonEmptyString = (value) => value === undefined || isNonEmptyString(value);
export const isOptionalRecordOfString = (value) => {
    if (value === undefined)
        return true;
    if (!isRecord(value))
        return false;
    return Object.values(value).every((item) => typeof item === 'string');
};
