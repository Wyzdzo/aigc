// 文件位置：src/usecases/account/update-visible-user-info.input.normalize.ts
import { Gender, UserState } from '@app-types/models/user-info.types';
import { ACCOUNT_ERROR, DomainError, INPUT_NORMALIZE_ERROR, } from '@core/common/errors/domain-error';
import { normalizeOptionalText, normalizeRequiredText, normalizeTextList, } from '@core/common/input-normalize/input-normalize.policy';
export function normalizeVisibleNicknameInput(input) {
    try {
        const normalized = normalizeRequiredText(input, { fieldName: '昵称' });
        if (normalized.length > 50) {
            throw new DomainError(ACCOUNT_ERROR.OPERATION_NOT_SUPPORTED, '昵称长度不能超过 50');
        }
        return normalized;
    }
    catch (error) {
        if (error instanceof DomainError) {
            if (error.code === INPUT_NORMALIZE_ERROR.REQUIRED_TEXT_EMPTY) {
                throw new DomainError(ACCOUNT_ERROR.OPERATION_NOT_SUPPORTED, '昵称不可为空');
            }
            if (error.code === INPUT_NORMALIZE_ERROR.INVALID_TEXT) {
                throw new DomainError(ACCOUNT_ERROR.OPERATION_NOT_SUPPORTED, '昵称必须是字符串');
            }
        }
        throw error;
    }
}
export function normalizeVisibleBirthDateInput(input) {
    const normalized = normalizeVisibleNullableTextInput(input, { fieldName: '出生日期' });
    if (normalized === null) {
        return null;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
        throw new DomainError(ACCOUNT_ERROR.OPERATION_NOT_SUPPORTED, '出生日期格式必须为 YYYY-MM-DD');
    }
    return normalized;
}
export function normalizeVisibleNullableTextInput(input, options) {
    try {
        const normalized = normalizeOptionalText(input, 'to_null', { fieldName: options.fieldName });
        return normalized ?? null;
    }
    catch (error) {
        if (error instanceof DomainError && error.code === INPUT_NORMALIZE_ERROR.INVALID_TEXT) {
            throw new DomainError(ACCOUNT_ERROR.OPERATION_NOT_SUPPORTED, `${options.fieldName}必须是字符串`);
        }
        throw error;
    }
}
export function normalizeVisibleLimitedNullableTextInput(input, options) {
    const normalized = normalizeVisibleNullableTextInput(input, { fieldName: options.fieldName });
    if (normalized && normalized.length > options.maxLen) {
        throw new DomainError(ACCOUNT_ERROR.OPERATION_NOT_SUPPORTED, options.tooLongMessage);
    }
    return normalized;
}
export function normalizeVisibleTagsInput(input) {
    try {
        const normalized = normalizeTextList(input, {
            filter_empty: true,
            reject_invalid_item: true,
            dedupe: true,
            empty_result: 'to_null',
        }, { fieldName: '标签' });
        if (normalized === undefined || normalized === null) {
            return null;
        }
        return [...normalized];
    }
    catch (error) {
        if (error instanceof DomainError &&
            (error.code === INPUT_NORMALIZE_ERROR.INVALID_TEXT_LIST ||
                error.code === INPUT_NORMALIZE_ERROR.INVALID_TEXT_LIST_ITEM)) {
            throw new DomainError(ACCOUNT_ERROR.OPERATION_NOT_SUPPORTED, '标签必须是字符串数组或为 null');
        }
        throw error;
    }
}
export function normalizeVisibleGeographicInput(input) {
    if (input === undefined || input === null) {
        return null;
    }
    if (typeof input !== 'object' || Array.isArray(input)) {
        throw new DomainError(ACCOUNT_ERROR.OPERATION_NOT_SUPPORTED, '地理信息必须是对象或为 null');
    }
    return input;
}
export function normalizeVisibleGenderInput(input) {
    if (input === null || typeof input === 'undefined') {
        return Gender.SECRET;
    }
    return input;
}
export function normalizeVisibleUserStateInput(input) {
    if (typeof input === 'undefined') {
        return UserState.PENDING;
    }
    return input;
}
export function normalizeVisibleNonNegativeIntInput(input) {
    const normalized = typeof input === 'number' ? input : 0;
    if (!Number.isInteger(normalized) || normalized < 0) {
        throw new DomainError(ACCOUNT_ERROR.OPERATION_NOT_SUPPORTED, '计数必须为不小于 0 的整数');
    }
    return normalized;
}
