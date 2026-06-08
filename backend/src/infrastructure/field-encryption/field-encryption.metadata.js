// src/infrastructure/field-encryption/field-encryption.metadata.ts
import 'reflect-metadata';
export const ENCRYPTED_FIELDS_METADATA_KEY = 'core:encrypted_fields';
export const registerEncryptedField = (target, propertyKey) => {
    const existing = getEncryptedFields(target);
    Reflect.defineMetadata(ENCRYPTED_FIELDS_METADATA_KEY, [...new Set([...existing, propertyKey])], target);
};
export const getEncryptedFields = (target) => {
    return (Reflect.getMetadata(ENCRYPTED_FIELDS_METADATA_KEY, target) ?? []);
};
